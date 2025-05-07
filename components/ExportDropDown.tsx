/**
 * Export Dropdown Component
 * Purpose: Provides export options for reports and data
 * Used in: Report pages, data analysis views
 * Features:
 * - Export to PDF
 * - Dropdown menu interface
 * - Styled export button
 */

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import ExportToPDF from "./ExportToPDF"

/**
 * Export dropdown component with PDF export option
 * - Provides a styled export button
 * - Contains PDF export functionality
 * - Uses dropdown menu for export options
 */
function ExportDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border-border rounded-md py-1.5 px-3 text-xs font-medium transition-colors flex items-center gap-2"
        >
          <Download className="h-3.5 w-3.5" />
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 bg-[#1e1e1e] border border-[#2a2a2a] text-foreground">
        <DropdownMenuSeparator className="bg-[#2a2a2a]" />
        <DropdownMenuItem className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer">
          <ExportToPDF exportContentId="reportContent" fileName="ErrorDetectionReport" />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#2a2a2a]" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportDropdown;