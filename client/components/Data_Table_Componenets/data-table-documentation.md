# Data Table Component Documentation

This document provides comprehensive guidance on how to use and customize the Data Table component in your Next.js application.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Component Structure](#component-structure)
5. [Customization](#customization)
6. [Features](#features)
7. [API Reference](#api-reference)
8. [Styling](#styling)
9. [Accessibility](#accessibility)
10. [Performance Considerations](#performance-considerations)

## Overview

The Data Table component is a highly customizable, feature-rich table implementation designed for displaying and interacting with structured data. It includes built-in support for sorting, filtering, pagination, column resizing, and more.

## Installation

To use the Data Table component in your Next.js project:

1. Copy the `data-table.tsx` file to your components directory
2. Ensure you have the required dependencies:
   - Lucide React for icons
   - Tailwind CSS for styling

\`\`\`bash
npm install lucide-react
\`\`\`

## Basic Usage

\`\`\`tsx
import DataTable from '@/components/data-table'

export default function MyPage() {
  return <DataTable />
}
\`\`\`

## Component Structure

The Data Table component is composed of several key sections:

### 1. Header Section
Contains the table title and action buttons for keyboard shortcuts, column visibility, and data export.

### 2. Filter Controls
Includes search input, column selector for filtering, and filter status information.

### 3. Category Filters
Allows filtering by data types or categories.

### 4. Table Header
Contains sortable column headers with resize handles.

### 5. Table Body
Displays the data rows with support for horizontal and vertical scrolling.

### 6. Pagination Controls
Provides navigation between pages and control over rows per page.

### 7. Detail Panel
A modal that shows detailed information about a selected row.

## Customization

### Data Source

Replace the sample data with your own data structure:

\`\`\`tsx
// Your custom data
const myData = [
  {
    name: "item_1",
    type: "category_a",
    // other properties...
  },
  // more items...
];

// In your component
const [filteredData, setFilteredData] = useState(myData);
\`\`\`

### Column Configuration

Modify the column visibility state to match your data structure:

\`\`\`tsx
const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
  name: true,
  category: true,
  status: true,
  // your custom columns...
});
\`\`\`

### Column Widths

Set default column widths:

\`\`\`tsx
const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({
  name: 200,
  category: 120,
  status: 100,
  // your custom columns...
});
\`\`\`

### Styling

The component uses Tailwind CSS for styling. You can customize the appearance by modifying the CSS classes:

\`\`\`tsx
// Example: Change the background color
<div className="bg-[#your-color] border border-[#your-border-color] rounded-md">
\`\`\`

## Features

### 1. Sorting

Click on column headers to sort data. The component supports both ascending and descending sorting.

### 2. Filtering

- Text-based filtering across all columns or specific columns
- Category-based filtering using the filter buttons

### 3. Pagination

Navigate through large datasets with built-in pagination controls.

### 4. Column Resizing

Drag the column edges to resize columns to your preferred width.

### 5. Column Visibility

Toggle the visibility of columns using the eye icon in the header.

### 6. Data Export

Export the filtered data as a CSV file.

### 7. Detail View

Click on a row to view detailed information in a modal.

### 8. Keyboard Shortcuts

The component supports keyboard shortcuts for common actions:
- `Ctrl+F`: Focus the search input
- `Ctrl+E`: Export data as CSV
- `Esc`: Close detail view or clear filter

## API Reference

### Props

The component can accept the following props:

\`\`\`tsx
interface DataTableProps {
  data?: any[]; // Your data array
  title?: string; // Table title
  defaultSort?: { key: string; direction: 'asc' | 'desc' }; // Default sorting
  defaultPageSize?: number; // Default rows per page
  onRowClick?: (row: any) => void; // Row click handler
  onExport?: (data: any[]) => void; // Custom export handler
}
\`\`\`

### Methods

You can access the component's methods using a ref:

\`\`\`tsx
const tableRef = useRef<DataTableRef>(null);

// Later in your code
tableRef.current?.exportData();
\`\`\`

## Styling

The component uses a dark theme by default. Key styling elements include:

1. **Color Scheme**: Dark background (`#121212`, `#1e1e1e`, `#1a1a1a`) with white text
2. **Borders**: Subtle borders (`#2a2a2a`) to separate sections
3. **Interactive Elements**: Hover states and transitions for buttons and rows
4. **Scrollbars**: Custom black scrollbars for better integration with the dark theme

To change the theme, modify the color values in the component.

## Accessibility

The component implements several accessibility features:

- Keyboard navigation support
- ARIA attributes for interactive elements
- Focus management
- Screen reader-friendly structure

## Performance Considerations

For large datasets, consider:

1. Implementing server-side pagination
2. Using virtualization for very large tables
3. Memoizing expensive calculations with `useMemo` and `useCallback`
4. Optimizing render cycles by carefully managing state updates

## Tiles/Components Reference

The Data Table includes several reusable tiles/components:

### 1. Header Tile
Contains the table title and action buttons.

### 2. Filter Tile
Houses the search input and filter controls.

### 3. Category Filter Tile
Displays filter buttons for data categories.

### 4. Table Header Tile
Shows column headers with sort indicators and resize handles.

### 5. Table Body Tile
Displays the data rows with support for scrolling.

### 6. Pagination Tile
Provides navigation between pages.

### 7. Detail Modal Tile
Shows detailed information about a selected item.

Each tile can be extracted and reused independently in other components if needed.
