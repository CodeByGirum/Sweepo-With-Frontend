'use client'

import { useEffect } from "react"
import { CleaningDashboard } from "@/components/cleaning-dashboard"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function ClientWorkstation({ fileId }: { fileId: string }) {
  // Add analytics or any client-side only code here
  useEffect(() => {
    console.log(`Loaded workstation for file: ${fileId}`);
  }, [fileId]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-[#121212] px-6 py-2 border-b border-[#2a2a2a]">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      <main className="flex-grow">
        <CleaningDashboard fileId={fileId} hideHeader={true} hideFooter={true} />
      </main>
      <Footer />
    </div>
  )
} 