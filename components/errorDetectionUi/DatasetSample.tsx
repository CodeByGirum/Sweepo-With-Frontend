'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Search, Download } from "lucide-react"

const DatasetSample = ({records}:{records:Record<string,number | string | null | boolean>[]}) => {
    const [filterValue, setFilterValue] = useState("")
    
    // Filter function that searches across all columns
    const filteredRecords = records.filter(record =>
        filterValue === "" || 
        Object.values(record).some(value => 
            value !== null && String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
    )

    return (
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md">
            {/* Table Header Controls */}
            <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-white">Dataset Sample</h2>
                    <span className="text-xs text-gray-400">The first {records.length} rows of the dataset</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-[#2a2a2a] text-white transition-colors">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Filter controls */}
            <div className="border-b border-[#2a2a2a] p-3 bg-[#1a1a1a] flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 flex-grow max-w-md">
                    <Search className="h-3.5 w-3.5 text-white" />
                    <input
                        type="text"
                        placeholder="Search sample data..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className="bg-[#252525] border border-[#333] rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-gray-500 text-white"
                    />
                </div>
                <div className="text-xs text-white ml-auto">
                    {filteredRecords.length} of {records.length} rows
                </div>
            </div>

            {/* Table Component */}
            <div className="overflow-x-auto scrollbar-themed">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            {records.length > 0 && Object.keys(records[0]).map((key, index) => (
                                <TableHead key={index} className="whitespace-nowrap">{key}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record, index) => (
                                <TableRow key={index} className="hover:bg-[#1a1a1a] transition-colors">
                                    {Object.values(record).map((value, recordIndex) => (
                                        <TableCell key={recordIndex} className="whitespace-nowrap">
                                            {value !== null ? String(value) : <i className="text-red-400">Null</i>}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={Object.keys(records[0] || {}).length} className="text-center py-8">
                                    No rows match your search criteria
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DatasetSample