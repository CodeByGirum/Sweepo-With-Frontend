/**
 * Table Component
 * 
 * Purpose:
 * Provides a standardized, accessible table implementation following the application's design system.
 * Serves as the foundation for all table interfaces throughout the application.
 * 
 * Usage:
 * - Data displays (Dataset samples, Schema definitions)
 * - Issue tables (Error lists, validation reports)
 * - Column statistics displays
 * 
 * Features:
 * - Fully accessible with proper ARIA attributes
 * - Responsive design with scroll handling
 * - Dark theme styling with consistent colors
 * - Support for header, body, row, and cell customization
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Root Table component
 * Container for the entire table structure with role="table" for accessibility
 * Includes scrollbar theming and responsive overflow handling
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto scrollbar-themed">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm text-foreground", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

/**
 * TableHeader component
 * Container for header rows with role="rowgroup" for accessibility
 * Styled with dark background and border for visual separation
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-[#1a1a1a] [&_tr]:border-b border-[#2a2a2a]", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * TableBody component
 * Container for table data rows with role="rowgroup" for accessibility
 * Includes hover effects and transition styling for rows
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 [&_tr:hover]:bg-[#1a1a1a] [&_tr]:transition-colors", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * TableFooter component
 * Container for footer rows with role="rowgroup" for accessibility
 * Styled with a distinct background and border for visual separation
 * Typically used for summary rows or pagination controls
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[#2a2a2a] bg-[#1a1a1a] font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * TableRow component
 * Represents a table row with role="row" for accessibility
 * Includes hover state styling and border definition
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[#2a2a2a] transition-colors hover:bg-[#1a1a1a] data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * TableHead component
 * Represents a header cell with role="columnheader" for accessibility
 * Used for column headers with distinct styling from data cells
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 py-2 text-left font-medium text-white [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * TableCell component
 * Represents a data cell with role="cell" for accessibility
 * Used for displaying table data with consistent padding and text color
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-2 text-white [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * TableCaption component
 * Provides a caption for the table with role="caption" for accessibility
 * Used to describe the table's purpose or content
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-xs text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
