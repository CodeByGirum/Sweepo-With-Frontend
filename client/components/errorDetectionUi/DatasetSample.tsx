'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { CardHeader, CardTitle, CardDescription } from "../ui/card";

const DatasetSample = ({records}:{records:Record<string,number | string | null | boolean>[]}) => {
    
    return <>
        <CardHeader>
          <CardTitle>Dataset Sample</CardTitle>
          <CardDescription>The first 5 rows of the dataset</CardDescription>
        </CardHeader>
        <Table className="custom-scrollbar">
        <TableHeader>
            <TableRow>
            {
                Object.keys(records[0]).map((key,index) => (
                    <TableHead key={index}>{key}</TableHead>
                ))
            }
            </TableRow>
        </TableHeader>
        <TableBody>
            {records
            .map((record,index) => (
            <TableRow key={index}>
                {
                    Object.values(record).map((value, recordIndex) => (
                        <TableCell key={recordIndex}>{value || <i className="text-red-700">Null</i>}</TableCell>
                    ))
                }
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </>
}

export default DatasetSample