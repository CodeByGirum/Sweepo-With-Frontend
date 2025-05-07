// TablePage.tsx
"use client";

import { Props } from "@/utils/types";
import ResizableEditableTable from "@/components/resizableTableUi/ResizableEditableTable";

export default function TablePage({ params }: Props) {
  return (
      <ResizableEditableTable params={params} />
    
  );
}