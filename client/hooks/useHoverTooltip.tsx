/**
 * Hover Tooltip Hook
 * Purpose: Manages tooltip positioning and visibility for hover interactions
 * Used in: Tables, lists, and other components requiring hover tooltips
 * Features:
 * - Smart tooltip positioning
 * - Boundary detection
 * - Debounced hover events
 * - Above/below positioning based on available space
 */

import { useState, useRef } from "react";

/**
 * Custom hook for managing hover tooltip behavior
 * @returns Object containing tooltip state and handlers
 * @property hoveredRowIndex - Index of the currently hovered row
 * @property cursorPosition - Current cursor position for tooltip placement
 * @property isTooltipAbove - Whether tooltip should appear above cursor
 * @property handleMouseMove - Handler for mouse move events
 * @property handleMouseLeave - Handler for mouse leave events
 */
export const useHoverTooltip = () => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isTooltipAbove, setIsTooltipAbove] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles mouse movement to position tooltip
   * @param e - Mouse event
   * @param index - Index of the hovered row
   * @param containerRef - Reference to the container element
   */
  const handleMouseMove = (e: React.MouseEvent, index: number, containerRef: React.RefObject<HTMLDivElement | null>) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      const offsetX = 30;
      const offsetY = 30;

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tooltipWidth = 400;
        const tooltipHeight = 100;

        let x = e.clientX + offsetX;
        let y = e.clientY + offsetY;
        let tooltipAbove = false;

        if (x + tooltipWidth > containerRect.right) x = e.clientX - tooltipWidth - offsetX;
        if (y + tooltipHeight > containerRect.bottom) {
          y = e.clientY - tooltipHeight - offsetY;
          tooltipAbove = true;
        }

        setCursorPosition({ x, y });
        setIsTooltipAbove(tooltipAbove);
        setHoveredRowIndex(index);
      }
    }, 500);
  };

  /**
   * Handles mouse leaving the hover area
   */
  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredRowIndex(null);
  };

  return { hoveredRowIndex, cursorPosition, isTooltipAbove, handleMouseMove, handleMouseLeave };
};