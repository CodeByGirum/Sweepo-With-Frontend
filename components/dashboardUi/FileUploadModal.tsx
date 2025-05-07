"use client"

import { useState } from 'react'
import { FileUploadWizard } from '@/components/file-upload-wizard'
import { uploadProjectFile, updateProjectSchema, UploadResponse } from '@/utils/file-upload-adapter'
import { transformColumnsToSchema } from '@/utils/schema-transformers'
import { useGlobalContext } from '@/context/context'

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  revalidateProjects: boolean
  setRevalidateProjects: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FileUploadModal({
  isOpen,
  onClose,
  revalidateProjects,
  setRevalidateProjects
}: FileUploadModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { setCleanDataFileId } = useGlobalContext()

  const handleProjectComplete = async (projectData: any) => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // Create form data from the wizard data
      const formData = new FormData()
      formData.append('file', projectData.files[0])
      formData.append('category', projectData.category || 'General')
      formData.append('description', projectData.description || 'Uploaded file')
      
      // Add timestamp metadata with full precision
      const now = new Date()
      
      // Format date and time for display and filtering
      const uploadDate = now.toISOString().split('T')[0]
      const uploadTime = now.toISOString().split('T')[1].split('.')[0]
      const fullTimestamp = `${uploadDate}T${uploadTime}`
      const timestampOrder = now.getTime() // Unix timestamp for sorting
      
      // Add all time-related metadata to the form
      formData.append('upload_date', uploadDate)
      formData.append('upload_time', uploadTime)
      formData.append('timestamp', fullTimestamp)
      formData.append('timestamp_order', timestampOrder.toString())

      // Upload file using existing backend
      const uploadResult: UploadResponse = await uploadProjectFile(formData)

      if (uploadResult?.fileSchemaDefinition?.file_id) {
        // Prepare metadata for schema
        const metadata = {
          upload_date: uploadDate,
          upload_time: uploadTime,
          timestamp: fullTimestamp,
          timestamp_order: timestampOrder,
          created_at: now.toISOString()
        }
        
        // Transform column format and update schema
        const schemaDefinition = {
          file_id: uploadResult.fileSchemaDefinition.file_id,
          schema_definition: transformColumnsToSchema(projectData.columns, metadata),
          awareness: projectData.dataDescription || "",
          created_at: metadata.created_at,
          timestamp: metadata.timestamp,
          timestamp_order: metadata.timestamp_order
        }

        const schemaResult = await updateProjectSchema(schemaDefinition)
        
        if (schemaResult) {
          // Update global context with the new file ID
          setCleanDataFileId?.(uploadResult.fileSchemaDefinition.file_id)
          
          // Trigger projects revalidation immediately
          setRevalidateProjects(!revalidateProjects)
          
          // Close the modal with success
          onClose()
          
          // Force an additional refresh after a short delay
          setTimeout(() => {
            setRevalidateProjects(prev => !prev)
          }, 1000)
        } else {
          throw new Error("Failed to update schema")
        }
      } else if (uploadResult?.errors) {
        // Handle upload errors
        const errorMsg = uploadResult.errors.root 
          ? uploadResult.errors.root[0] 
          : Object.values(uploadResult.errors)[0]?.[0] || "Upload failed"
        
        console.error("Upload failed:", errorMsg)
        alert(`Upload failed: ${errorMsg}`)
      } else {
        throw new Error("Upload failed with unknown error")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Error completing project:", errorMessage)
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <FileUploadWizard
      isOpen={isOpen}
      onClose={onClose}
      onComplete={handleProjectComplete}
    />
  )
} 