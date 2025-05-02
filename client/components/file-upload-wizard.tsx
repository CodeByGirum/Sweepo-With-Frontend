/**
 * File Upload Wizard Component
 * Purpose: Multi-step wizard for uploading and configuring data files
 * Used in: Project creation and data import flows
 * Features:
 * - CSV/Excel file upload with drag-and-drop
 * - Automatic column type detection
 * - Column schema configuration
 * - Data preview
 * - Project metadata collection
 */

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Database,
  Plus,
  Trash2,
  AlertCircle,
  FileUp,
  Info,
  Download,
} from "lucide-react"
import { parseCSVFile, detectColumnTypes } from "@/utils/file-parsers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FileUploadWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (projectData: any) => void
}

type FileWithPreview = File & {
  preview?: string
}

/**
 * Column schema definition for data configuration
 */
type ColumnSchema = {
  name: string
  dataType: string
  numericSign?: string
  precision?: string
  uniqueness?: string
  dateFormat?: string
  dateSeparator?: string
  description?: string
}

type DataRow = Record<string, any>

/**
 * Multi-step file upload wizard component
 * Handles file upload, data preview, and column configuration
 * @param isOpen - Controls wizard visibility
 * @param onClose - Callback when wizard is closed
 * @param onComplete - Callback when upload is complete
 */
export function FileUploadWizard({ isOpen, onClose, onComplete }: FileUploadWizardProps) {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [fileData, setFileData] = useState<DataRow[]>([])
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [dataDescription, setDataDescription] = useState("")
  const [columns, setColumns] = useState<ColumnSchema[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState("")
  const [expandedColumns, setExpandedColumns] = useState<number[]>([])
  const [isParsingFile, setIsParsingFile] = useState(false)

  /**
   * Returns color class based on data type for UI styling
   * @param dataType - Type of data (String, Integer, Float, etc.)
   */
  const getTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'String':
        return 'bg-blue-900/30 text-blue-300'
      case 'Integer':
        return 'bg-green-900/30 text-green-300'
      case 'Float':
        return 'bg-emerald-900/30 text-emerald-300'
      case 'Boolean':
        return 'bg-purple-900/30 text-purple-300'
      case 'Date':
        return 'bg-orange-900/30 text-orange-300'
      case 'DateTime':
        return 'bg-yellow-900/30 text-yellow-300'
      default:
        return 'bg-gray-900/30 text-gray-300'
    }
  }

  // Refs for click outside detection
  const modalRef = useRef<HTMLDivElement>(null)

  /**
   * Handles click outside modal to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  /**
   * Handles escape key press to close modal
   */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  /**
   * Handles file drop and initial processing
   * - Creates file preview
   * - Extracts project name
   * - Parses file data
   * - Detects column types
   * - Configures column schema
   */
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return

      const file = acceptedFiles[0]
      setIsParsingFile(true)
      
      try {
        // Add preview property to the file
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
        setFiles([fileWithPreview])
        
        // Try to extract a project name from the file
        if (!projectName) {
          const fileName = file.name
          const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".")
          setProjectName(nameWithoutExtension)
        }
        
        // Parse file to get actual data for preview
        const data = await parseCSVFile(file, 10) // Get first 10 rows for preview
        setFileData(data)
        
        // Generate column definitions based on the data
        const columnTypes = detectColumnTypes(data)
        
        const generatedColumns: ColumnSchema[] = Object.keys(columnTypes).map(colName => {
          const dataType = columnTypes[colName]
          
          // Configure default properties based on data type
          const column: ColumnSchema = { 
            name: colName, 
            dataType 
          }
          
          // Add data-type-specific properties
          if (dataType === 'Integer' || dataType === 'Float') {
            // Check if all values are positive
            const allPositive = data.every(row => typeof row[colName] === 'number' && row[colName] >= 0)
            if (allPositive) {
              column.numericSign = 'Positive Only'
            }
            
            // For float values, detect precision
            if (dataType === 'Float') {
              const maxDecimals = data.reduce((max, row) => {
                if (typeof row[colName] !== 'number') return max
                const decimal = row[colName].toString().split('.')[1]
                return Math.max(max, decimal ? decimal.length : 0)
              }, 0)
              
              if (maxDecimals > 0) {
                column.precision = `${maxDecimals} Decimals`
              }
            }
          }
          
          // For dates, try to detect format
          if (dataType === 'Date') {
            // Get the first date value
            const dateValue = data.find(row => row[colName] !== null)?.[colName]
            if (dateValue) {
              // Simple format detection (this is very basic)
              if (dateValue.includes('/')) {
                column.dateSeparator = '/'
                
                const parts = dateValue.split('/')
                if (parts.length === 3) {
                  if (parts[0].length === 4) {
                    column.dateFormat = 'YYYY/MM/DD'
                  } else if (parts[2].length === 4) {
                    column.dateFormat = 'MM/DD/YYYY'
                  }
                }
              } else if (dateValue.includes('-')) {
                column.dateSeparator = '-'
                
                const parts = dateValue.split('-')
                if (parts.length === 3) {
                  if (parts[0].length === 4) {
                    column.dateFormat = 'YYYY-MM-DD'
                  } else if (parts[2].length === 4) {
                    column.dateFormat = 'MM-DD-YYYY'
                  }
                }
              }
            }
          }
          
          return column
        })
        
        setColumns(generatedColumns)
        
        // If this is a new file upload, automatically expand the first 2 columns
        if (expandedColumns.length === 0 && generatedColumns.length > 0) {
          setExpandedColumns([0, 1].filter(i => i < generatedColumns.length));
        }
        
      } catch (error) {
        console.error("Error parsing file:", error)
        // Add user-friendly error notification
        alert(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Clear the file
        setFiles([]);
      } finally {
        setIsParsingFile(false)
      }
    },
    [projectName, expandedColumns],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
  })

  /**
   * Toggles the expanded state of a column in the configuration UI
   * @param index - Index of the column to toggle
   */
  const toggleColumnExpanded = (index: number) => {
    setExpandedColumns((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  /**
   * Adds a new column to the schema configuration
   * Automatically expands the new column in the UI
   */
  const addColumn = () => {
    const newColumnIndex = columns.length
    setColumns([...columns, { name: `column_${newColumnIndex + 1}`, dataType: "String" }])
    setExpandedColumns([...expandedColumns, newColumnIndex])
  }

  /**
   * Removes a column from the schema configuration
   * @param index - Index of the column to remove
   */
  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
    setExpandedColumns(expandedColumns.filter((i) => i !== index))
  }

  /**
   * Updates a specific field of a column in the schema
   * @param index - Index of the column to update
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateColumn = (index: number, field: keyof ColumnSchema, value: string) => {
    setColumns(columns.map((col, i) => (i === index ? { ...col, [field]: value } : col)))
  }

  /**
   * Handles the final submission of the file upload wizard
   * - Validates input
   * - Prepares project data
   * - Calls onComplete callback
   */
  const handleSubmit = async () => {
    if (!projectName || !projectDescription || !dataDescription || !category) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const projectData = {
        name: projectName,
        description: projectDescription,
        dataDescription,
        category,
        columns,
        file: files[0],
      }
      onComplete(projectData)
    } catch (error) {
      console.error("Error submitting project:", error)
      alert("Error submitting project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Advances to the next step in the wizard
   * Validates current step before proceeding
   */
  const nextStep = () => {
    if (step === 1 && files.length === 0) {
      alert("Please upload a file first")
      return
    }
    setStep(step + 1)
  }

  /**
   * Returns to the previous step in the wizard
   */
  const prevStep = () => {
    setStep(step - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-md bg-[#121212] border border-[#2a2a2a] shadow-xl"
      >
        {/* Header */}
        <div className="border-b border-[#2a2a2a] p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">New Project</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-3 flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center space-y-1.5 relative">
                <div
                  className={`w-16 h-0.5 absolute top-1 ${stepNumber === 1 ? "hidden" : step >= stepNumber ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}
                  style={{ right: "50%", marginRight: "10px" }}
                ></div>
                <div
                  className={`w-16 h-0.5 absolute top-1 ${stepNumber === 3 ? "hidden" : step > stepNumber ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"}`}
                  style={{ left: "50%", marginLeft: "10px" }}
                ></div>
                <div
                  className={`w-5 h-5 flex items-center justify-center ${
                    step === stepNumber
                      ? "border-2 border-[#2a2a2a] bg-[#1a1a1a]"
                      : step > stepNumber
                        ? "bg-[#2a2a2a] text-[#121212]"
                        : "bg-[#1a1a1a] text-gray-500"
                  }`}
                >
                  {step > stepNumber ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span className="text-xs">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    step === stepNumber ? "font-medium" : step > stepNumber ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stepNumber === 1 ? "Upload" : stepNumber === 2 ? "Details" : "Schema"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${
                      isDragActive
                        ? "border-[#3a3a3a] bg-[#2a2a2a]/10"
                        : "border-[#2a2a2a] hover:border-gray-500 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {isParsingFile ? (
                        <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : isDragActive ? (
                        <FileUp className="h-8 w-8 text-gray-300" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="space-y-1">
                        <p className="text-xs font-medium">
                          {isParsingFile 
                            ? "Analyzing file..." 
                            : isDragActive 
                              ? "Drop the file here" 
                              : "Drag & drop your file here"}
                        </p>
                        <p className="text-xs text-gray-500">Supports CSV, XLS, XLSX</p>
                      </div>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
                      {files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between p-2 border-b border-[#2a2a2a] last:border-0"
                        >
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-4 w-4 text-gray-300" />
                            <div>
                              <p className="text-xs font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setFiles([])
                              setFileData([])
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium">Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                      >
                        <option value="">Select a category</option>
                        <option value="Analytics">Analytics</option>
                        <option value="Research">Research</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Project Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-medium">About Your Data</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Providing details about your data helps us improve error detection and cleaning processes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Data Description</label>
                    <textarea
                      value={dataDescription}
                      onChange={(e) => setDataDescription(e.target.value)}
                      placeholder="Describe your data's purpose, structure, and any other relevant details..."
                      rows={4}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                    />
                  </div>

                  {files.length > 0 && fileData.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium">File Preview</h4>
                        <div className="text-xs text-gray-400">
                          {fileData.length} row{fileData.length !== 1 ? 's' : ''} preview
                        </div>
                      </div>
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md mt-4">
                        {/* Table Header Controls */}
                        <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium text-white">Data Preview</h2>
                            <span className="text-xs text-gray-400">Sample of the data to be processed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Table Component */}
                        <div className="overflow-x-auto scrollbar-themed">
                          {fileData.length > 0 ? (
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(fileData[0]).map((column) => {
                                    const colType = columns.find((col) => col.name === column)?.dataType || "Unknown";
                                    return (
                                      <TableHead key={column} className="whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                          {column}
                                          <span className={`text-[10px] px-1 py-0.5 rounded-full ${getTypeColor(colType)}`}>
                                            {colType}
                                          </span>
                                        </div>
                                      </TableHead>
                                    );
                                  })}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {fileData.map((row, rowIndex) => (
                                  <TableRow key={rowIndex} className="hover:bg-[#1a1a1a] transition-colors">
                                    {Object.keys(fileData[0]).map((column) => (
                                      <TableCell key={`${rowIndex}-${column}`} className="whitespace-nowrap">
                                        {row[column] !== null ? String(row[column]) : <i className="text-red-400">Null</i>}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-sm text-gray-400">No data preview available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-medium">Column Types</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        We've automatically detected the data types for your columns. You can review and refine the schema below. 
                        This helps ensure data quality checks are applied correctly.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium">Schema Definition</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Define the schema for your data columns</p>
                  </div>
                  <button
                    onClick={addColumn}
                    className="flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-2 py-1 text-xs font-medium hover:bg-[#3a3a3a] transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {columns.length === 0 ? (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4 text-center">
                      <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-xs font-medium mb-1">No Columns Detected</h4>
                      <p className="text-xs text-gray-400 mb-3">
                        Upload a file in step 1 or manually add columns using the "Add Column" button.
                      </p>
                      <button
                        onClick={addColumn}
                        className="inline-flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-2 py-1 text-xs font-medium hover:bg-[#3a3a3a] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Column</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Column Type Summary Stats */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['String', 'Integer', 'Float', 'Boolean', 'Date'].map((type) => {
                          const count = columns.filter((col) => col.dataType === type).length;
                          if (count === 0) return null;
                          return (
                            <div key={type} className="px-2 py-1 bg-[#1a1a1a] rounded-md border border-[#2a2a2a]">
                              <span className="text-xs font-medium">{type}</span>
                              <span className="text-xs text-gray-400 ml-1">({count})</span>
                            </div>
                          );
                        })}
                      </div>

                      {columns.map((column, index) => (
                        <div key={index} className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a]/50 overflow-hidden">
                          <div
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#1e1e1e] transition-colors"
                            onClick={() => toggleColumnExpanded(index)}
                          >
                            <div className="flex items-center space-x-2">
                              <Database className="h-3.5 w-3.5 text-gray-300" />
                              <span className="text-xs font-medium">{column.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${getTypeColor(column.dataType)}`}>
                                {column.dataType}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeColumn(index)
                                }}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <ChevronDown
                                className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                                  expandedColumns.includes(index) ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {expandedColumns.includes(index) && (
                            <div className="p-2 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Column Name</label>
                                  <input
                                    type="text"
                                    value={column.name}
                                    onChange={(e) => updateColumn(index, "name", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Data Type</label>
                                  <select
                                    value={column.dataType}
                                    onChange={(e) => updateColumn(index, "dataType", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  >
                                    <option value="String">String</option>
                                    <option value="Integer">Integer</option>
                                    <option value="Float">Float</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                    <option value="DateTime">DateTime</option>
                                  </select>
                                </div>

                                {(column.dataType === "Integer" || column.dataType === "Float") && (
                                  <>
                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Numeric Sign</label>
                                      <select
                                        value={column.numericSign || "Any"}
                                        onChange={(e) => updateColumn(index, "numericSign", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="Any">Any</option>
                                        <option value="Positive Only">Positive Only</option>
                                        <option value="Negative Only">Negative Only</option>
                                        <option value="Non-Zero">Non-Zero</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Precision</label>
                                      <select
                                        value={column.precision || "No Limit"}
                                        onChange={(e) => updateColumn(index, "precision", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="No Limit">No Limit</option>
                                        <option value="0 Decimals">0 Decimals</option>
                                        <option value="1 Decimal">1 Decimal</option>
                                        <option value="2 Decimals">2 Decimals</option>
                                        <option value="3 Decimals">3 Decimals</option>
                                        <option value="4 Decimals">4 Decimals</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                {(column.dataType === "Date" || column.dataType === "DateTime") && (
                                  <>
                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Date Format</label>
                                      <select
                                        value={column.dateFormat || "MM/DD/YYYY"}
                                        onChange={(e) => updateColumn(index, "dateFormat", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                        <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="block text-xs font-medium">Date Separator</label>
                                      <select
                                        value={column.dateSeparator || "/"}
                                        onChange={(e) => updateColumn(index, "dateSeparator", e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                      >
                                        <option value="/">/</option>
                                        <option value="-">-</option>
                                        <option value=".">.</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                <div className="space-y-2">
                                  <label className="block text-xs font-medium">Uniqueness</label>
                                  <select
                                    value={column.uniqueness || "Non-Unique"}
                                    onChange={(e) => updateColumn(index, "uniqueness", e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors"
                                  >
                                    <option value="Non-Unique">Non-Unique (Duplicates permitted)</option>
                                    <option value="Unique">Unique (No duplicates allowed)</option>
                                  </select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                  <label className="block text-xs font-medium">Description</label>
                                  <textarea
                                    value={column.description || ""}
                                    onChange={(e) => updateColumn(index, "description", e.target.value)}
                                    placeholder="Describe this column's purpose and content..."
                                    rows={2}
                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-[#3a3a3a] focus:border-[#3a3a3a] transition-colors resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-[#2a2a2a] p-3 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-md bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-1 rounded-md bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={step === 1 && files.length === 0}
                className={`flex items-center space-x-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  step === 1 && files.length === 0
                    ? "bg-[#2a2a2a]/50 cursor-not-allowed"
                    : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-1 rounded-md bg-[#2a2a2a] px-3 py-1.5 text-xs font-medium hover:bg-[#3a3a3a] transition-colors disabled:bg-[#2a2a2a]/50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Create Project</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 