/**
 * Hallow Pie Chart Component
 * Purpose: Displays overall data quality score in a donut chart format
 * Used in: Data quality dashboard, quality metrics
 * Features:
 * - Donut chart visualization
 * - Central quality score display
 * - Interactive tooltips
 * - Responsive design
 */

"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * Hallow pie chart component for displaying overall data quality score
 * @param overallQualityPercentage - Overall data quality percentage (0-100)
 */
function HallowPieChartComponent({ overallQualityPercentage }: { overallQualityPercentage: number }) {
  
  // Prepare chart data
  const chartData = [
    { browser: "quality", visitors: overallQualityPercentage, fill: "#FFFFFF" }, // White for quality
    { browser: "problem", visitors: (100 - overallQualityPercentage), fill: "#444444" }, // Dark gray for problems
  ];
  
  // Chart configuration
  const chartConfig = {
    quality: {
      label: "quality",
      color: "#FFFFFF", // White
    },
    problem: {
      label: "problem",
      color: "#444444", // Dark gray
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-0">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
              stroke="#000000"
              cornerRadius={8}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {parseFloat(overallQualityPercentage.toFixed(2))}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Quality Score
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default HallowPieChartComponent;
