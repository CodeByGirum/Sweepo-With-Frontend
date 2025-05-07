import React from 'react'
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from '../ui/card'
import {IssueCountType} from '@/utils/types'
import { CiWarning } from "react-icons/ci";
import { PiWarningCircleLight } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";

const Status = ({totalAffectedColumns, highImpactIssues, issueTypeCounts}:{totalAffectedColumns:number, highImpactIssues:number, issueTypeCounts:IssueCountType[]}) => {
  return (
        <div className='flex flex-col gap-3 sm:flex-row'>
            <Card className='w-full sectionBg border-0'>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Total Issues</CardTitle>
                <CardDescription><CiWarning className='text-[#E8920E] text-base' /></CardDescription>
            </CardHeader>
            <CardContent>
                <b>{issueTypeCounts.reduce((acc, curr) => acc + curr.totalCount, 0)}</b>
            </CardContent>
            <CardFooter>
            {/* {errorDetection.length} */}
                <CardDescription>Across 5 categories</CardDescription>
            </CardFooter>
            </Card>

        <Card className='w-full sectionBg border-0'>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>High Impact</CardTitle>
            <CardDescription><PiWarningCircleLight className='text-[#F54439] text-base' /></CardDescription>
        </CardHeader>
        <CardContent>
            <b>{highImpactIssues}</b>
        </CardContent>
        <CardFooter>
            <CardDescription>Requiring immediate attention</CardDescription>
        </CardFooter>
        </Card>

        <Card className='w-full sectionBg border-0'>
        <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Affected Columns</CardTitle>
            <CardDescription><IoCloseCircleOutline className='text-[#56BCEA] text-base' /></CardDescription>
        </CardHeader>
        <CardContent>
            <b>{totalAffectedColumns}</b>
        </CardContent>
        <CardFooter>
            <CardDescription>With quality issues</CardDescription>
        </CardFooter>
        </Card>
    </div>
  )
}

export default Status