/**
 * Pie Chart Component
 * Purpose: Visualizes data quality issues distribution
 * Used in: Data quality dashboard, issue analysis
 * Features:
 * - Interactive pie chart
 * - Custom legend
 * - Value labels
 * - Tooltip support
 */

"use client";

import { DefaultLegendContentProps, LabelList, Legend, Pie, PieChart } from "recharts";
import { IssueCountType } from "@/utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * Color mapping for different issue types (now in grayscale)
 */
const COLORS = {
  INVALID_VALUE: "#ffffff",      // White
  TYPE_MISMATCH: "#e0e0e0",      // Light gray
  NULL_VALUE: "#c0c0c0",         // Silver
  DUPLICATE_VALUE: "#a0a0a0",    // Medium gray
  INVALID_FORMAT: "#808080",     // Gray
  INVALID_SEPARATOR: "#606060",  // Dark gray
  INVALID_DATE: "#404040"        // Very dark gray
}

type IssueType = keyof typeof COLORS;

/**
 * Pie chart component for displaying issue distribution
 * @param issueTypeCounts - Array of issue counts by type
 */
function PieChartComponent({ issueTypeCounts }: { issueTypeCounts: IssueCountType[] }) {
  // Map data correctly for recharts
  const IssueDistribution = issueTypeCounts.map((issue) => ({
    name: issue.issueType, 
    value: issue.totalCount, 
    fill: COLORS[issue.issueType as IssueType], 
  }));

  const chartConfig = IssueDistribution.reduce((config, issue) => {
    config[issue.name] = {
      label: issue.name,
      color: issue.fill,
    };
    return config;
  }, {} as ChartConfig);

  /**
   * Custom legend renderer
   * @param props - Legend properties from recharts
   */
  const renderLegend = (props: DefaultLegendContentProps) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block border border-black"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-white">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Issue Distribution</CardTitle>
        <CardDescription>Current data quality issues by type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] [&_.recharts-text]:fill-background"
        >
          <PieChart className="w-full">
            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
            <Pie 
              data={IssueDistribution} 
              dataKey="value" 
              nameKey="name" 
              className="w-full"
              stroke="#000000"
              strokeWidth={1}
              cornerRadius={4}
            >
              <LabelList
                dataKey="value"
                position="inside"
                fill="black"
                stroke="white"
                strokeWidth={0.5}
                fontSize={12}
                fontWeight="bold"
              />
            </Pie>
            <Legend content={renderLegend} verticalAlign="bottom" align="center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PieChartComponent;
