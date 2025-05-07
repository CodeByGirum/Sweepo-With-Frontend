import { TableRow, TableCell } from "@/components/ui/table";
import { Tooltip } from "@/components/workstationUi/Tooltip";
import { RecordType, Issue } from "../../utils/types";

interface TableDataRowProps {
  record: RecordType;
  index: number;
  issues: Issue[];
  selectedRow: number | null;
  handleMouseMove: (e: React.MouseEvent<HTMLTableRowElement>, index: number) => void;
  handleMouseLeave: () => void;
  hoveredRowIndex: number | null;
  cursorPosition: { x: number; y: number };
  isTooltipAbove: boolean;
}

export const TableDataRow = ({
  record,
  index,
  issues,
  selectedRow,
  handleMouseMove,
  handleMouseLeave,
  hoveredRowIndex,
  cursorPosition,
  isTooltipAbove,
}: TableDataRowProps) => {
  const rowIssues = issues.find((issue) => issue.row === index + 1);
  const errorColumns = rowIssues ? rowIssues.errors.map((error) => error.column) : [];

  return (
    <TableRow
      key={index}
      id={`row-${index}`}
      onMouseMove={(e) => handleMouseMove(e, index)}
      onMouseLeave={handleMouseLeave}
      className={`w-full relative ${selectedRow === index + 1 ? "animate-blink bg-blue-400" : ""}`}
    >
      <TableCell className="w-3 sticky left-0 z-40 bg-secondary">{index + 1}</TableCell>

      {Object.entries(record).map(([key, value], i) => (
        <TableCell key={i} className={`z-10 text-nowrap ${errorColumns.includes(key) ? "bg-red-600/60" : ""} font-medium`}>
          {String(value)}

          {hoveredRowIndex === index && rowIssues && (
            <Tooltip issues={rowIssues.errors} cursorPosition={cursorPosition} isTooltipAbove={isTooltipAbove} />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};