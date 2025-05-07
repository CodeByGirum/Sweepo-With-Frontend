import { useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { FaBoxTissue } from "react-icons/fa";
import SmallLoading from "@/components/SmallLoading";
import { useGlobalContext } from "@/context/context";

// Define types
interface Issue {
    row: number;
    issueType: string;
}

interface IssuesData {
    [column: string]: Issue[];
}

const COLORS = {INVALID_VALUE:"#FF5733",TYPE_MISMATCH:"#FFC300",NULL_VALUE:"#36A2EB",DUPLICATE_VALUE:"#4CAF50",INVALID_FORMAT:"#9C27B0",INVALID_SEPARATOR:"#FF9800",INVALID_DATE: "#E53935"}

const ColumnsIssue = () => {
    const [isIssueOpen, setIsIssueOpen] = useState<boolean>(false);
    const [expandedColumns, setExpandedColumns] = useState<Record<string, boolean>>({});
    const { issues, isCleanDataLoading, setSelectedRow } = useGlobalContext();

    // Ensure 'issues' is correctly typed as an array of objects
    const columnBasedIssues: IssuesData = (issues as { row: number; errors: { column: string; issueType: string }[] }[]).reduce((acc, { row, errors }) => {
        errors.forEach(({ column, issueType }) => {
        if (!acc[column]) {
            acc[column] = [];
        }
        acc[column].push({ row, issueType });
        });
        return acc;
    }, {} as IssuesData); 

    // Toggle column open/close state
    const toggleColumn = (column: string) => {
        setExpandedColumns((prev) => ({
        ...prev,
        [column]: !prev[column],
        }));
    };

    return (
        <div>
        {/* Main Toggle Button */}
        <button
            onClick={() => setIsIssueOpen(!isIssueOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition"
        >
            <span className="text-xs para">Column&apos;s Issues</span>
            {isIssueOpen ? <IoChevronDown /> : <IoChevronForward />}
        </button>

        {/* Display Issues */}
        {isIssueOpen && (
            <ul className="mt-2 space-y-2 overflow-y-auto overflow-x-hidden">
            {isCleanDataLoading ? (
                <div className="flex justify-center py-2">
                <SmallLoading />
                </div>
            ) : Object.keys(columnBasedIssues).length > 0 ? (
                Object.entries(columnBasedIssues).map(([column, issues]) => (
                <li key={column} className="px-4 py-2 shadow-sm transition relative hover:secondaryBg">
                    {/* Column Name (Clickable) */}
                    <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleColumn(column)}
                    >
                    <span className="flex items-center text-sm gap-1 truncate font-bold">
                        <FaBoxTissue />
                        {column} <span className="para text-xs font-light">({issues.length})</span>
                    </span>
                    {expandedColumns[column] ? <IoChevronDown /> : <IoChevronForward />}
                    </div>

                    {/* List of Issues (Only show if column is expanded) */}
                    {expandedColumns[column] && (
                    <ul className="ml-5 mt-1 text-xs space-y-1">
                        {issues.map(({ row, issueType }, i) => (
                        <div key={i} className="flex gap-1">
                            <div 
                            className="min-w-4 min-h-4 rounded" 
                            style={{ backgroundColor: COLORS[issueType as keyof typeof COLORS] }} 
                            ></div>
                            <li
                                key={i}
                                className="cursor-pointer text-nowrap hover:underline"
                                onClick={() => setSelectedRow(row)}
                            >
                                Row {row}: {issueType}
                            </li>
                        </div>
                        ))}
                    </ul>
                    )}
                </li>
                ))
            ) : (
                <div className="p-2 rounded-lg text-wrap text-sm max-w-[80%] mr-auto bg-secondary text-secondary-foreground">
                No Issues Found
                </div>
            )}
            </ul>
        )}
        </div>
    );
};

export default ColumnsIssue;
