// 'use client'

// import BarChartComponent from '@/components/BarChart'
// import IssueTable from '@/components/IssueTable'
// import PieChartComponent from '@/components/PieChart'
// import { Props, IssueCountType, ColumnIssueType} from '@/utils/types'
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'
// import { BsStars } from "react-icons/bs";
// import Link from 'next/link'
// import ExportDropdown from '@/components/ExportDropDown'
// import { useEffect, useState } from 'react'
// import Loading from '../loading'
// import Summary from '@/components/errorDetectionUi/Summary'
// import Status from '@/components/errorDetectionUi/Status'
// import SchemaDefinitionTable from '@/components/errorDetectionUi/SchemaDefinitionTable'
// import { GetIssues } from '@/utils/errorDetectionActions'

// const ErrorDetection = ({params}:Props) => {
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [fileId, setFileId] = useState<string>("");
//   const [qualityScore, setQualityScore] = useState<number>(0);
//   const [highImpactIssues, setHighImpactIssues] = useState<number>(0);
//   const [totalAffectedColumns, setTotalAffectedColumns] = useState<number>(0);
//   const [columnIssueCounts, setColumnIssueCounts] = useState<ColumnIssueType[]>([]);
//   const [issueTypeCounts, setIssueTypeCounts] = useState<IssueCountType[]>([]);
//   const [originalName, setOriginalName] = useState<string>("");
//   const [description, setDescription] = useState<string>("");

//   useEffect(() => {
    
//     const fetchErrorReport = async () => {
//         const fileId = await params;
//         const { fileid } = fileId;
//         setIsLoading(true);

//         if (fileid) {
//             setFileId(fileid);
//             try {
//                 const resp = await GetIssues(fileid);
//                 setTotalAffectedColumns(resp.totalAffectedColumns)
//                 setQualityScore(resp.qualityScore);
//                 setHighImpactIssues(resp.highImpactIssues)
//                 setColumnIssueCounts(resp.columnIssueCounts)
//                 setColumnIssueCounts(resp.columnIssueCounts)
//                 setIssueTypeCounts(resp.issueTypeCounts);
//                 setOriginalName(resp.original_name);
//                 setDescription(resp.description)
                
//             } catch (error) {
//                 console.error('Unexpected error:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     };

//     fetchErrorReport();
// }, [params]);

//   if (fileId && isLoading) {
//     return <Loading/>
//   }


//   return (
//     <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
//         <h1 className="text-2xl font-bold mb-3">Error Detection Dashboard</h1>
//         <div id="reportContent" className='flex flex-col gap-5'>  
//           <Summary totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} originalName={originalName} description={description} overallQuality={qualityScore}/>
         
//           <Status totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} />

//           <div className='flex flex-col xl:flex-col gap-5'>
          
//             <PieChartComponent issueTypeCounts={issueTypeCounts}/>
            
//             <BarChartComponent columnIssueCounts={columnIssueCounts}/>
//           </div>

//           <Card className='w-full'>
//             <SchemaDefinitionTable fileId={fileId}/>
//           </Card>

//           <Card className='w-full'>
//             <CardHeader>
//               <CardTitle>Critical Issues</CardTitle>
//               <CardDescription>Detailed breakdown of data quality issues</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <IssueTable issueTypeCounts={issueTypeCounts} fileId={fileId} />
//             </CardContent>
//           </Card>

//           <div className='flex justify-end gap-5'>
//             <Button
//               asChild
//               className='secondaryBg transition-all duration-300 hover:brightness-110 active:brightness-90'
//               style={{
//                 background: 'linear-gradient(to right, #59C2F7, #4D56C2)',
//                 color: '#FFFFFF',
//               }}
//               data-ignore="true"
//             >
//             <Link href={`/cleandata/${fileId}`} target='_blank'><BsStars />Clean Data</Link>
//             </Button>
//             <ExportDropdown/>
//           </div>
//         </div>        
//     </div>
//   )
// }

// export default ErrorDetection



// 'use client'

// import BarChartComponent from '@/components/BarChart'
// import IssueTable from '@/components/IssueTable'
// import PieChartComponent from '@/components/PieChart'
// import { Props, IssueCountType, ColumnIssueType} from '@/utils/types'
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'
// import { BsStars } from "react-icons/bs";
// import Link from 'next/link'
// import ExportDropdown from '@/components/ExportDropDown'
// import { useEffect, useState } from 'react'
// import Loading from '../loading'
// import Summary from '@/components/errorDetectionUi/Summary'
// import Status from '@/components/errorDetectionUi/Status'
// import SchemaDefinitionTable from '@/components/errorDetectionUi/SchemaDefinitionTable'
// import { GetIssues } from '@/utils/errorDetectionActions'

// const ErrorDetection = ({params}:Props) => {
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [fileId, setFileId] = useState<string>("");
//   const [qualityScore, setQualityScore] = useState<number>(0);
//   const [highImpactIssues, setHighImpactIssues] = useState<number>(0);
//   const [totalAffectedColumns, setTotalAffectedColumns] = useState<number>(0);
//   const [columnIssueCounts, setColumnIssueCounts] = useState<ColumnIssueType[]>([]);
//   const [issueTypeCounts, setIssueTypeCounts] = useState<IssueCountType[]>([]);
//   const [originalName, setOriginalName] = useState<string>("");
//   const [description, setDescription] = useState<string>("");

//   useEffect(() => {
    
//     const fetchErrorReport = async () => {
//         const fileId = await params;
//         const { fileid } = fileId;
//         setIsLoading(true);

//         if (fileid) {
//             setFileId(fileid);
//             try {
//                 const resp = await GetIssues(fileid);
//                 setTotalAffectedColumns(resp.totalAffectedColumns)
//                 setQualityScore(resp.qualityScore);
//                 setHighImpactIssues(resp.highImpactIssues)
//                 setColumnIssueCounts(resp.columnIssueCounts)
//                 setColumnIssueCounts(resp.columnIssueCounts)
//                 setIssueTypeCounts(resp.issueTypeCounts);
//                 setOriginalName(resp.original_name);
//                 setDescription(resp.description)
                
//             } catch (error) {
//                 console.error('Unexpected error:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     };

//     fetchErrorReport();
// }, [params]);

//   if (fileId && isLoading) {
//     return <Loading/>
//   }


//   return (
//     <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
//         <h1 className="text-2xl font-bold mb-3">Error Detection Dashboard</h1>
//         <div id="reportContent" className='flex flex-col gap-5'>  
//           <Summary totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} originalName={originalName} description={description} overallQuality={qualityScore}/>
         
//           <Status totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} />

//           <div className='flex flex-col xl:flex-col gap-5'>
          
//             <PieChartComponent issueTypeCounts={issueTypeCounts}/>
            
//             <BarChartComponent columnIssueCounts={columnIssueCounts}/>
//           </div>

//           <Card className='w-full'>
//             <SchemaDefinitionTable fileId={fileId}/>
//           </Card>

//           <Card className='w-full'>
//             <CardHeader>
//               <CardTitle>Critical Issues</CardTitle>
//               <CardDescription>Detailed breakdown of data quality issues</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <IssueTable issueTypeCounts={issueTypeCounts} fileId={fileId} />
//             </CardContent>
//           </Card>

//           <div className='flex justify-end gap-5'>
//             <Button
//               asChild
//               className='secondaryBg transition-all duration-300 hover:brightness-110 active:brightness-90'
//               style={{
//                 background: 'linear-gradient(to right, #59C2F7, #4D56C2)',
//                 color: '#FFFFFF',
//               }}
//               data-ignore="true"
//             >
//             <Link href={`/cleandata/${fileId}`} target='_blank'><BsStars />Clean Data</Link>
//             </Button>
//             <ExportDropdown/>
//           </div>
//         </div>        
//     </div>
//   )
// }

// export default ErrorDetection




'use client'

import BarChartComponent from '@/components/BarChart'
import IssueTable from '@/components/IssueTable'
import PieChartComponent from '@/components/PieChart'
import { Props, IssueCountType, ColumnIssueType} from '@/utils/types'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import { BsStars } from "react-icons/bs";
import Link from 'next/link'
import ExportDropdown from '@/components/ExportDropDown'
import { useEffect, useState } from 'react'
import Loading from '../loading'
import Summary from '@/components/errorDetectionUi/Summary'
import Status from '@/components/errorDetectionUi/Status'
import SchemaDefinitionTable from '@/components/errorDetectionUi/SchemaDefinitionTable'
import { GetIssues } from '@/utils/errorDetectionActions'
import DatasetSample from '@/components/errorDetectionUi/DatasetSample'

const ErrorDetection = ({params}:Props) => {
  
  const[swithSection, setSwithSection] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fileId, setFileId] = useState<string>("");
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [highImpactIssues, setHighImpactIssues] = useState<number>(0);
  const [totalAffectedColumns, setTotalAffectedColumns] = useState<number>(0);
  const [columnIssueCounts, setColumnIssueCounts] = useState<ColumnIssueType[]>([]);
  const [issueTypeCounts, setIssueTypeCounts] = useState<IssueCountType[]>([]);
  const [originalName, setOriginalName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [records, setRecords] = useState<Record<string,number | string | null | boolean>[]>([]);

  useEffect(() => {
    
    const fetchErrorReport = async () => {
        const fileId = await params;
        const { fileid } = fileId;
        setIsLoading(true);

        if (fileid) {
            setFileId(fileid);
            try {
                const resp = await GetIssues(fileid);
                setTotalAffectedColumns(resp.totalAffectedColumns);
                setQualityScore(resp.qualityScore);
                setHighImpactIssues(resp.highImpactIssues)
                setColumnIssueCounts(resp.columnIssueCounts)
                setColumnIssueCounts(resp.columnIssueCounts)
                setIssueTypeCounts(resp.issueTypeCounts);
                setOriginalName(resp.original_name);
                setDescription(resp.description)
                setRecords(resp.records)
                
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    fetchErrorReport();
}, [params]);

  if (fileId && isLoading) {
    return <Loading/>
  }


  return (
    <div className="background p-10 rounded-lg w-full min-h-screen mb-20 sm:w-full">
        <h1 className="text-2xl font-bold mb-3">Error Detection Dashboard</h1>
        <div id="reportContent" className='flex flex-col gap-5'>  
          <Summary totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} originalName={originalName} description={description} overallQuality={qualityScore}/>
         
          <Status totalAffectedColumns={totalAffectedColumns} highImpactIssues={highImpactIssues} issueTypeCounts={issueTypeCounts} />

          <div className='flex flex-col xl:flex-col gap-5'>
          
            <PieChartComponent issueTypeCounts={issueTypeCounts}/>
            
            <BarChartComponent columnIssueCounts={columnIssueCounts}/>
          </div>

          <Card className='w-full'>
            <div className='p-4 flex gap-2'>
              <Button className={`border border-white hover:bg-transparent hover:text-white ${(swithSection === 1) ? "bg-transparent text-white" : "primaryBtn primaryBtnText"}`} onClick={()=>setSwithSection(1)}>Schema Definition</Button>
              <Button className={`border border-white hover:bg-transparent hover:text-white ${(swithSection === 2) ? "bg-transparent text-white" : "primaryBtn primaryBtnText"}`} onClick={()=>setSwithSection(2)}>Dataset Sample</Button>
            </div>
          <div className="w-full relative max-h-[500px] overflow-auto custom-scrollbar">
            <div className='p-4'>
              {(swithSection === 1) && <SchemaDefinitionTable fileId={fileId}/> }
              {(swithSection === 2) && <DatasetSample records={records}/>}
            </div>
          </div>
          </Card>

          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Critical Issues</CardTitle>
              <CardDescription>Detailed breakdown of data quality issues</CardDescription>
            </CardHeader>
            <CardContent>
              <IssueTable issueTypeCounts={issueTypeCounts} fileId={fileId} />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-5'>
            <Button
              asChild
              className='secondaryBg transition-all duration-300 hover:brightness-110 active:brightness-90'
              style={{
                background: 'linear-gradient(to right, #59C2F7, #4D56C2)',
                color: '#FFFFFF',
              }}
              data-ignore="true"
            >
            <Link href={`/cleandata/${fileId}`} target='_blank'><BsStars />Clean Data</Link>
            </Button>
            <ExportDropdown/>
          </div>
        </div>        
    </div>
  )
}

export default ErrorDetection