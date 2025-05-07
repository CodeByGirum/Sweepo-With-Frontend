import ReactDOM from "react-dom";
import { error } from "../../utils/types";

const COLORS = {INVALID_VALUE:"#FF5733",TYPE_MISMATCH:"#FFC300",NULL_VALUE:"#36A2EB",DUPLICATE_VALUE:"#4CAF50",INVALID_FORMAT:"#9C27B0",INVALID_SEPARATOR:"#FF9800",INVALID_DATE: "#E53935"}

export const Tooltip = ({
  issues,
  cursorPosition,
  isTooltipAbove,
}: {
  issues: error[];
  cursorPosition: { x: number; y: number };
  isTooltipAbove: boolean;
}) => {
  const tooltip = (
    <ul
      className={`fixed border border-gray-300 rounded-lg p-2 font-light text-sm z-50 bg-secondary text-secondary-foreground ${
        isTooltipAbove ? "before:bottom-[-5px]" : "before:top-[-5px]"
      } before:content-[''] before:absolute before:w-2 before:h-2 before:bg-white before:border-l before:border-t before:border-gray-300 before:rotate-45`}
      style={{ top: `${cursorPosition.y}px`, left: `${cursorPosition.x}px`, whiteSpace: "nowrap" }}
    >
      <h4 className="mb-1">({issues.length}) Issues in this row</h4>
      {issues.map((error, idx) => (
        <div key={idx} className="flex gap-1">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: COLORS[error.issueType as keyof typeof COLORS] }} 
            ></div>
          <li>
            On column <b>{error.column}:&nbsp;</b>
            {error.issueDesc}
          </li>
        </div>
      ))}
    </ul>
  );

  return ReactDOM.createPortal(tooltip, document.body);
};
