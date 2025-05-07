// IssuesSection.tsx
import { useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { useGlobalContext } from "@/context/context";
import RowsIssue from "./RowsIssue";
import ColumnsIssue from "./ColumnsIssue";


export default function IssuesSection() {
  const [isIssueOpen, setIsIssueOpen] = useState(true);
  const { issues } = useGlobalContext();
  const totalErrors = issues.reduce((sum, issue) => sum + issue.errors.length, 0);

  return (
    <div>
      <button onClick={() => setIsIssueOpen(!isIssueOpen)} className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition">
        <span className="text-sm para">Issues&nbsp;({totalErrors})</span>
        {isIssueOpen ? <IoChevronDown /> : <IoChevronForward />}
      </button>

      {isIssueOpen && <>
        <div className="ml-1">
          <ColumnsIssue />
          <RowsIssue />
        </div>
      </>}
    </div>
  );
}
