/**
 * Issue Table Component
 * 
 * Purpose:
 * Displays data quality issues detected in a dataset with filtering capabilities.
 * Provides a structured view of errors with impact level indicators and actions.
 * 
 * Usage:
 * - Error Detection page
 * - Data quality reports
 * - Analysis views for identifying and resolving data issues
 * 
 * Features:
 * - Impact level visual indicators (High, Medium, Low)
 * - Filtering by issue type
 * - View affected rows functionality
 * - Responsive design with pagination
 * - Interactive search for specific issues
 */

'use client';
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useRouter } from 'next/navigation';
import { useLoading } from './LoadingProvider';
import { IssueCountType } from '@/utils/types';

/**
 * Issue Table Component
 * Displays data quality issues with filtering and interaction capabilities
 * 
 * @param {Object} props - Component props
 * @param {IssueCountType[]} props.issueTypeCounts - Array of data quality issues to display
 * @param {string} props.fileId - ID of the current file/dataset
 * @returns {JSX.Element} Rendered component
 */
export function IssueTable({ issueTypeCounts, fileId }: { issueTypeCounts: IssueCountType[]; fileId: string }) {
  // State management for filtering, search, and pagination
  const [filteredIssues, setFilteredIssues] = useState(issueTypeCounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesPerPage] = useState(7);
  
  const router = useRouter();
  const { isLoading, setLoading } = useLoading();

  /**
   * Updates filtered issues when issues prop changes or search query is updated
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredIssues(issueTypeCounts);
    } else {
      const filtered = issueTypeCounts.filter(issue => 
        issue.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.impact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.columns && issue.columns.some((col: string) => 
          col.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredIssues(filtered);
    }
    setCurrentPage(1);
  }, [issueTypeCounts, searchQuery]);

  /**
   * Determines the CSS class for impact level indicator
   * @param {string} impact - Impact level (High, Medium, Low)
   * @returns {string} CSS class for styling the impact indicator
   */
  const getImpactClass = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  /**
   * Handles "View Affected" button click to navigate to cleaning page
   * @param {string} issue - The issue type to filter for
   * @param {string[]} columns - Affected columns
   */
  const handleViewAffected = (issue: string, columns: string[]) => {
    setLoading(true);
    router.push(`/cleandata/${fileId}?issue=${encodeURIComponent(issue)}&columns=${columns.join(',')}`);
  };

  // Calculate pagination
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

  /**
   * Navigate to a specific page
   * @param {number} pageNumber - Page number to navigate to
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Render the issue table component
  return (
    <div className="w-full">
      {/* Search and filter controls */}
      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-[#1a1a1a] border-[#2a2a2a] text-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1 text-sm bg-[#2a2a2a] text-gray-300 rounded hover:bg-[#3a3a3a]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Issues table */}
      <div className="rounded-md border border-[#2a2a2a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Issue</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Affected Columns</TableHead>
              <TableHead>Occurrences</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                  No issues match your search.
                </TableCell>
              </TableRow>
            ) : (
              currentIssues.map((issue, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{issue.issueType}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getImpactClass(issue.impact)}`}>
                      {issue.impact}
                    </span>
                  </TableCell>
                  <TableCell>
                    {issue.columns?.map((col: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-[#2a2a2a] rounded-full text-xs mr-1">
                        {col}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{issue.totalCount}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleViewAffected(issue.issueType, issue.columns || [])}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                    >
                      View Affected
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {filteredIssues.length > issuesPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstIssue + 1}-{Math.min(indexOfLastIssue, filteredIssues.length)} of {filteredIssues.length} issues
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 ? 'bg-[#1a1a1a] text-gray-500' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              return (
                <button
                  key={i}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages ? 'bg-[#1a1a1a] text-gray-500' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}