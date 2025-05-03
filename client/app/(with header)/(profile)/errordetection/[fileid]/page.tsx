'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Download, 
  Edit, 
  ExternalLink, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Play, 
  RefreshCw, 
  Share2, 
  Star, 
  Table, 
  Trash2, 
  Users, 
  ChevronDown,
  BarChart3,
  PieChart,
  Database,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BsStars as BsStarsIcon } from "react-icons/bs"
import ExportDropdown from '@/components/ExportDropDown'
import Loading from '../loading'
import Summary from '@/components/errorDetectionUi/Summary'
import Status from '@/components/errorDetectionUi/Status'
import ColumnStatisticsTable from '@/components/errorDetectionUi/SchemaDefinitionTable'
import { GetIssues, GetSchema } from '@/utils/errorDetectionActions'
import { IssueTable } from '@/components/IssueTable'
import BarChartComponent from '@/components/BarChart'
import PieChartComponent from '@/components/PieChart'
import { Props, IssueCountType, ColumnIssueType } from '@/utils/types'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { DeleteFile } from "@/utils/fileActions"
import { useRouter } from "next/navigation"
import { TeamCollaborationCard } from "@/components/TeamCollaboration"

const DatasetDetails = ({params}:Props) => {
  
  const [isLoading, setIsLoading] = useState(true)
  const [fileId, setFileId] = useState<string>("")
  const [qualityScore, setQualityScore] = useState<number>(0)
  const [highImpactIssues, setHighImpactIssues] = useState<number>(0)
  const [totalAffectedColumns, setTotalAffectedColumns] = useState<number>(0)
  const [columnIssueCounts, setColumnIssueCounts] = useState<ColumnIssueType[]>([])
  const [issueTypeCounts, setIssueTypeCounts] = useState<IssueCountType[]>([])
  const [originalName, setOriginalName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const [visibility, setVisibility] = useState("private")
  const [newTag, setNewTag] = useState("")
  const [tags, setTags] = useState<string[]>(["CSV", "Dataset"])
  const [overviewRecords, setOverviewRecords] = useState<Record<string, any>[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()
  
  // Convert quality score to progress percentage for UI
  const progressPercentage = qualityScore

  useEffect(() => {
    const fetchErrorReport = async () => {
        const fileId = await params
        const { fileid } = fileId
        setIsLoading(true)

        if (fileid) {
            setFileId(fileid)
            try {
                const resp = await GetIssues(fileid)
                setTotalAffectedColumns(resp.totalAffectedColumns)
                setQualityScore(resp.qualityScore)
                setHighImpactIssues(resp.highImpactIssues)
                setColumnIssueCounts(resp.columnIssueCounts)
                setIssueTypeCounts(resp.issueTypeCounts)
                setOriginalName(resp.original_name)
                setDescription(resp.description)
                
                // Use first 5 records from GetIssues for overview
                setOverviewRecords(resp.records || [])
            } catch (error) {
                console.error('Unexpected error:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    fetchErrorReport()
  }, [params])

  if (fileId && isLoading) {
    return <Loading/>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const createdAt = new Date()
  const updatedAt = new Date()

  // Handle dataset deletion
  const handleDeleteDataset = async () => {
    if (!fileId) {
      setDeleteError("Cannot delete: File ID is missing");
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      console.log(`Starting deletion of dataset: ${originalName} (${fileId})`);
      const response = await DeleteFile(fileId);
      
      // Check if we got a "not found" error but consider it a successful deletion
      if (response?.data?.message?.toLowerCase().includes("not found")) {
        console.log("File not found but considering deletion successful");
        // Navigate back to projects since the file effectively doesn't exist anymore
        router.push('/projects');
        return;
      }
      
      if (response?.data?.status) {
        // Navigate back to projects after successful deletion
        router.push('/projects');
      } else {
        // Handle deletion error
        const errorMessage = response?.data?.message || "Unknown error occurred";
        console.error('Failed to delete dataset:', errorMessage);
        setDeleteError(errorMessage);
        // Keep dialog open to show the error
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      setDeleteError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-xs">
        <Link href="/projects" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-white">{originalName}</span>
      </div>

      {/* Project Header */}
      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-medium mb-1">{originalName}</h1>
            <p className="text-gray-400 text-xs">{description || "No description provided"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
              <Star className="h-4 w-4 text-gray-400" />
            </button>
            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
              <Share2 className="h-4 w-4 text-gray-400" />
            </button>
            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-1 font-normal">Status</p>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3a3a3a]"></span>
              <span className="text-sm font-normal">Active</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 font-normal">Created</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-normal">{formatDate(createdAt)}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 font-normal">Last Modified</p>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-normal">
                {formatDate(updatedAt)} at {formatTime(updatedAt)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 font-normal">Owner</p>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-normal">John Doe</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400 font-normal">Data Quality</span>
            <span className="text-xs font-normal">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full">
            <div
              className="h-1.5 bg-[#3a3a3a] rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/cleandata/${fileId}`}
            target='_blank'
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            Clean Dataset
          </Link>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Play className="h-3.5 w-3.5" />
            Start Processing
          </button>
          <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
          <div className="ml-auto">
            <ExportDropdown />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2a2a] mb-6">
        <div className="flex items-center gap-1">
          <button
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "overview" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "data" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("data")}
          >
            Data
          </button>
          <button
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "analysis" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </button>
          <button
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "settings" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === "overview" && (
          <div className="flex gap-6">
            {/* Main Column */}
            <div className="flex-1 space-y-6">
              {/* Dataset Sample */}
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <CardTitle className="text-sm font-medium">Dataset Overview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {overviewRecords.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto">
                      <div className="overflow-x-auto">
                        <UITable className="w-full relative">
                          <TableHeader className="sticky top-0 bg-[#1e1e1e] z-10">
                            <TableRow>
                              {Object.keys(overviewRecords[0]).slice(0, 8).map((key) => (
                                <TableHead key={key} className="text-muted-foreground whitespace-nowrap">
                                  {key}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {overviewRecords.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {Object.entries(row).slice(0, 8).map(([key, value]) => (
                                  <TableCell key={`${rowIndex}-${key}`} className="text-foreground whitespace-nowrap text-sm font-normal">
                                    {value !== null && value !== undefined ? 
                                      (typeof value === 'object' ? JSON.stringify(value) : value.toString()) : 
                                      <span className="text-destructive">Null</span>}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">No sample data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Cards */}
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-gray-400" />
                    <CardTitle className="text-sm font-medium">Status Metrics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Status 
                    totalAffectedColumns={totalAffectedColumns} 
                    highImpactIssues={highImpactIssues} 
                    issueTypeCounts={issueTypeCounts} 
                  />
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                  <CardHeader className="border-b border-[#2a2a2a] p-4">
                    <CardTitle className="text-sm font-medium">Issue Distribution</CardTitle>
                    <CardDescription className="text-xs text-gray-400 font-normal">Distribution of issues by type</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <PieChartComponent issueTypeCounts={issueTypeCounts} />
                  </CardContent>
                </Card>

                <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                  <CardHeader className="border-b border-[#2a2a2a] p-4">
                    <CardTitle className="text-sm font-medium">Column Issues</CardTitle>
                    <CardDescription className="text-xs text-gray-400 font-normal">Issues by column</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <BarChartComponent columnIssueCounts={columnIssueCounts} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 space-y-6">
              {/* Project Info */}
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <CardTitle className="text-sm font-medium">Dataset Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Dataset Name</p>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm">{originalName}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">File ID</p>
                    <span className="text-sm">{fileId}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Data Quality</p>
                    <span className="text-sm">{qualityScore.toFixed(1)}%</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-[#2a2a2a] text-xs px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <CardTitle className="text-sm font-medium">Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <Link href={`/cleandata/${fileId}`} target='_blank' className="w-full">
                    <Button
                      className='w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white transition-all flex items-center justify-center gap-2'
                    >
                      <BsStarsIcon />
                      Clean Data
                    </Button>
                  </Link>
                  <Button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white flex items-center justify-center gap-2 transition-colors">
                    <Download className="h-4 w-4" />
                    Download Dataset
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-400 font-normal">Data Completeness</p>
                        <span className="text-xs font-normal">{Math.round(100 - (100 - qualityScore) * 0.7)}%</span>
                      </div>
                      <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                        <div
                          className="h-1 bg-[#3a3a3a] rounded-full transition-all"
                          style={{ width: `${Math.round(100 - (100 - qualityScore) * 0.7)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-400 font-normal">Data Quality</p>
                        <span className="text-xs font-normal">{qualityScore.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                        <div
                          className="h-1 bg-[#3a3a3a] rounded-full transition-all"
                          style={{ width: `${qualityScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-400 font-normal">Processing Speed</p>
                        <span className="text-xs font-normal">97%</span>
                      </div>
                      <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                        <div
                          className="h-1 bg-[#3a3a3a] rounded-full transition-all"
                          style={{ width: "97%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Collaboration Card */}
              <TeamCollaborationCard projectId={fileId} />
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-6">
            {/* Column Statistics */}
            <ColumnStatisticsTable fileId={fileId} />
            
            {/* Critical Issues */}
            <IssueTable issueTypeCounts={issueTypeCounts} fileId={fileId} />
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Data Quality Overview */}
            <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
              <CardHeader className="border-b border-[#2a2a2a] p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <CardTitle className="text-sm font-medium">Data Quality Analysis</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-400 font-normal">
                  Comprehensive analysis of your dataset quality
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#1a1a1a] p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-normal">Completeness</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white font-normal">
                        Good
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-2xl font-medium">{Math.round(100 - (100 - qualityScore) * 0.7)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 font-normal">Few missing values detected</p>
                  </div>

                  <div className="bg-[#1a1a1a] p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-normal">Consistency</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white font-normal">
                        {qualityScore > 90 ? "Good" : qualityScore > 70 ? "Fair" : "Poor"}
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-2xl font-medium">{Math.round(qualityScore * 0.85)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 font-normal">Some inconsistent values</p>
                  </div>

                  <div className="bg-[#1a1a1a] p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-normal">Accuracy</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white font-normal">
                        {qualityScore > 85 ? "Good" : qualityScore > 65 ? "Fair" : "Poor"}
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-2xl font-medium">{Math.round(qualityScore * 0.92)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 font-normal">Few outliers detected</p>
                  </div>

                  <div className="bg-[#1a1a1a] p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-normal">Overall Score</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white font-normal">
                        {qualityScore > 90 ? "Excellent" : qualityScore > 80 ? "Good" : qualityScore > 65 ? "Fair" : "Poor"}
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-2xl font-medium">{qualityScore.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 font-normal">
                      {qualityScore > 90 
                        ? "Dataset is in excellent condition" 
                        : qualityScore > 80 
                          ? "Dataset is in good condition" 
                          : qualityScore > 65 
                            ? "Dataset needs improvement" 
                            : "Dataset needs significant cleanup"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualization Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <CardTitle className="text-sm font-medium">Issue Distribution</CardTitle>
                  <CardDescription className="text-xs text-gray-400 font-normal">Distribution of issues by type</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <PieChartComponent issueTypeCounts={issueTypeCounts} />
                </CardContent>
              </Card>

              <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
                <CardHeader className="border-b border-[#2a2a2a] p-4">
                  <CardTitle className="text-sm font-medium">Column Issues</CardTitle>
                  <CardDescription className="text-xs text-gray-400 font-normal">Issues by column</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <BarChartComponent columnIssueCounts={columnIssueCounts} />
                </CardContent>
              </Card>
            </div>

            {/* Critical Issues */}
            <IssueTable issueTypeCounts={issueTypeCounts} fileId={fileId} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Project Settings */}
            <Card className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden">
              <CardHeader className="border-b border-[#2a2a2a] p-4">
                <CardTitle className="text-sm font-medium">Dataset Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Dataset Name</label>
                  <input
                    type="text"
                    defaultValue={originalName}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    defaultValue={description}
                    rows={3}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="bg-[#2a2a2a] text-xs px-2 py-1 rounded flex items-center gap-1">
                        {tag}
                        <button 
                          className="text-gray-400 hover:text-white transition-colors"
                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          e.preventDefault();
                          setTags([...tags, newTag.trim()]);
                          setNewTag('');
                        }
                      }}
                    />
                    <button 
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium transition-colors"
                      onClick={() => {
                        if (newTag.trim()) {
                          setTags([...tags, newTag.trim()]);
                          setNewTag('');
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "private"}
                        onChange={() => setVisibility("private")}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#3a3a3a] focus:ring-[#3a3a3a] focus:ring-offset-0 focus:ring-offset-transparent"
                      />
                      <span className="text-sm font-normal">Private</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="visibility"
                        checked={visibility === "public"}
                        onChange={() => setVisibility("public")}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#3a3a3a] focus:ring-[#3a3a3a] focus:ring-offset-0 focus:ring-offset-transparent"
                      />
                      <span className="text-sm font-normal">Public</span>
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md py-1.5 px-3 text-xs font-medium transition-colors">
                    Save Changes
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-[#1e1e1e] border border-red-900/30 rounded-md overflow-hidden">
              <CardHeader className="border-b border-[#2a2a2a] p-4">
                <CardTitle className="text-sm font-medium text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Archive this dataset</h3>
                    <p className="text-xs text-gray-400 font-normal">
                      Archive this dataset to make it read-only and hide it from the main view.
                    </p>
                  </div>
                  <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-red-400 rounded-md py-1.5 px-3 text-xs font-medium transition-colors">
                    Archive
                  </button>
                </div>
                <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Transfer ownership</h3>
                    <p className="text-xs text-gray-400 font-normal">
                      Transfer this dataset to another team member.
                    </p>
                  </div>
                  <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-md py-1.5 px-3 text-xs font-medium transition-colors">
                    Transfer
                  </button>
                </div>
                <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Delete this dataset</h3>
                    <p className="text-xs text-gray-400 font-normal">
                      Once you delete a dataset, there is no going back. Please be certain.
                    </p>
                  </div>
                  <button 
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-red-400 rounded-md py-1.5 px-3 text-xs font-medium transition-colors"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>        
    </div>
    
    {/* Delete Confirmation Dialog */}
    <DeleteConfirmationDialog
      isOpen={isDeleteDialogOpen}
      onClose={() => {
        setDeleteError(null);
        setIsDeleteDialogOpen(false);
      }}
      onConfirm={handleDeleteDataset}
      datasetName={originalName}
      isDeleting={isDeleting}
      error={deleteError}
    />
    </>
  )
}

export default DatasetDetails