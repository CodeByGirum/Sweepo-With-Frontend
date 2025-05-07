'use client'

import { CleaningDashboard } from '@/components/cleaning-dashboard'
import { Suspense } from 'react'
import Loading from '../loading'

export default function CleanDataPage({ params }: { params: { fileid: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <CleaningDashboard fileId={params.fileid} />
    </Suspense>
  )
} 