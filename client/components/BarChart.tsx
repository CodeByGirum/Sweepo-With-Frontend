"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ColumnIssueType } from "@/utils/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {} satisfies ChartConfig

function BarChartComponent({ columnIssueCounts }: { columnIssueCounts: ColumnIssueType[] }) {

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Most Problematic Columns</CardTitle>
          <CardDescription>
            Top columns with quality issues
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={columnIssueCounts}
            margin={{
              left: 12,
              right: 12,
            }}
            barSize={30}
          >
            <CartesianGrid vertical={false} stroke="#333333" strokeDasharray="3 3" />
            <XAxis
              dataKey="column"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              stroke="#ffffff"
            />
            <YAxis 
              stroke="#ffffff"
              tickLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="totalIssues"
                  labelFormatter={(value) => value}
                />
              }
            />
          
            <Bar 
              dataKey="totalIssues" 
              fill="#ffffff" 
              stroke="#000000"
              strokeWidth={1}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default BarChartComponent
