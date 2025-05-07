"use client";

import { useGlobalContext } from "@/context/context";
import { useState, useEffect, useRef } from "react";
import ResizableTableHeader from "./ResizableTableHeader";
import ResizableTableRow from "./ResizableTableRow";
import { Props } from "@/utils/types";
import { LoadingOverlay } from "../workstationUi/LoadingOverlay";
import CleanDataTableHeader from "../CleanDataTableHeader";

export default function ResizableEditableTable({ params }:Props) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const {expand, setExpand, records, setCleanDataFileId, selectedRow, isCleanDataLoading} = useGlobalContext();

  const tableContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedRow !== null && tableContainerRef.current) {
            const rowElement = document.getElementById(`row-${selectedRow}`);
            if (rowElement && tableContainerRef.current) {
            const container = tableContainerRef.current;
            const rowOffset = rowElement.offsetTop;
            const containerHeight = container.clientHeight;
            const rowHeight = rowElement.clientHeight;

            container.scrollTo({
                top: rowOffset - containerHeight / 2 + rowHeight / 2,
                behavior: "smooth",
            });
            }
        }
    }, [selectedRow]);

  // Initialize column widths and row heights
  useEffect(() => {
    if (records.length > 0) {
      const initialWidths: Record<string, number> = {};
      const initialHeights: Record<number, number> = {};
      Object.keys(records[0]).forEach((key) => (initialWidths[key] = 150));
      records.forEach((_, index) => (initialHeights[index] = 40));
      setColumnWidths(initialWidths);
      setRowHeights(initialHeights);
    }
  }, [records]);

  // Handle column resizing from any cell border
  const handleColumnResize = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[key];

    const handleMouseMove = (event: MouseEvent) => {
      setColumnWidths((prev) => ({ ...prev, [key]: Math.max(startWidth + (event.clientX - startX), 50) }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  // Handle row resizing (same as before)
  const handleRowResize = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = rowHeights[index];

    const handleMouseMove = (event: MouseEvent) => {
      setRowHeights((prev) => ({ ...prev, [index]: Math.max(startHeight + (event.clientY - startY), 30) }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  useEffect(() => {
    const fetchErrorReport = async () => {
      const fileId = await params;
      const { fileid } = fileId;
      if (fileid) setCleanDataFileId(fileid);
    };
  
    fetchErrorReport();
  }, [params, setCleanDataFileId]);

  return (
            <div ref={tableContainerRef} className="w-full relative h-[calc(100vh - 40px)] overflow-auto border border-gray-800 custom-scrollbar">
              <CleanDataTableHeader setExpand={setExpand} expand={expand} />
            {/* Inner container with min-width set to table's content width */}
            <div className="min-w-max">
            {/* Table Header */}
            <LoadingOverlay isLoading={isCleanDataLoading} />

            {records.length > 0 ? <>
            
                <ResizableTableHeader 
                    handleColumnResize={handleColumnResize} 
                    columnWidths={columnWidths} 
                    records={records} 
                    />
        
                {/* Table Body */}
                {records.map((row, rowIndex) => (
                    <ResizableTableRow
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        columnWidths={columnWidths}
                        rowHeights={rowHeights}
                        handleColumnResize={handleColumnResize}
                        handleRowResize={handleRowResize}
                        containerRef={tableContainerRef}
                    />
                ))}
            </>: (
            <div className="p-2 rounded-lg text-wrap text-sm w-full mr-auto bg-secondary text-secondary-foreground">
                  {isCleanDataLoading || "No records available."}
                </div>
            )}
            
            </div>
        </div>
);
}
