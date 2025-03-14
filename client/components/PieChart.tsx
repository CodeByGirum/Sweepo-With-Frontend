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

const COLORS = {INVALID_VALUE:"#FF5733",TYPE_MISMATCH:"#FFC300",NULL_VALUE:"#36A2EB",DUPLICATE_VALUE:"#4CAF50",INVALID_FORMAT:"#9C27B0",INVALID_SEPARATOR:"#FF9800",INVALID_DATE: "#E53935"}

type IssueType = keyof typeof COLORS;

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

  // Custom legend
  const renderLegend = (props: DefaultLegendContentProps) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
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
            <Pie data={IssueDistribution} dataKey="value" nameKey="name" className="w-full">
              <LabelList
                dataKey="value"
                position="inside"
                fill="black"
                stroke="white"
                strokeWidth={0}
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
