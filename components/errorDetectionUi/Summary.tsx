import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import HallowPieChartComponent from '../HallowPieChart'
import {IssueCountType} from '@/utils/types'

const Summary = ({totalAffectedColumns, highImpactIssues, issueTypeCounts, originalName, description, overallQuality}:{totalAffectedColumns:number, highImpactIssues:number, issueTypeCounts:IssueCountType[], originalName:string, description:string, overallQuality:number}) => {
  return (
    <Card className='w-full h-full grid place-content-center gap-4 items-center lg:grid-cols-2'>
    <CardHeader className='col-span-1'>
      <CardTitle className='text-4xl font-bold mb-3'>{originalName || "File Name"}</CardTitle>
      <CardDescription className='mb-48'>{description || "No description available for this file."}</CardDescription>
      <CardDescription className='font-normal para text-sm'><b>Summary:</b> The current data quality score is {parseFloat(overallQuality.toFixed(2))}%, with {issueTypeCounts.length} total issues detected across {totalAffectedColumns} unique columns. Approximately {parseFloat((100 - overallQuality).toFixed(2))}% of the dataset is affected. There are {highImpactIssues} high-impact issues that require immediate attention.</CardDescription>
    </CardHeader>
    <CardContent className='col-span-1'>
      <HallowPieChartComponent overallQualityPercentage={overallQuality}/>
    </CardContent>
  </Card>
  )
}

export default Summary