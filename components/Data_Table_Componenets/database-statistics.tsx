import { ArrowLeft } from "lucide-react"

export default function DatabaseStatistics() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="h-5 w-5" />
        <h1 className="text-sm font-medium">Statistics</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] text-xs">
              <th className="py-2 px-4 text-left font-normal">Column Name</th>
              <th className="py-2 px-4 text-left font-normal">Type</th>
              <th className="py-2 px-4 text-left font-normal">Null Count</th>
              <th className="py-2 px-4 text-left font-normal">Unique Values</th>
              <th className="py-2 px-4 text-left font-normal">Min</th>
              <th className="py-2 px-4 text-left font-normal">Max</th>
              <th className="py-2 px-4 text-left font-normal">Mean</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">timestamp</td>
              <td className="py-2 px-4">integer</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">1024</td>
              <td className="py-2 px-4">1230984800</td>
              <td className="py-2 px-4">1230986807</td>
              <td className="py-2 px-4">1230985801</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">duration</td>
              <td className="py-2 px-4">integer</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">0</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">position_type</td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">service</td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">flag</td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">1</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">src_bytes</td>
              <td className="py-2 px-4">integer</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">29</td>
              <td className="py-2 px-4">102</td>
              <td className="py-2 px-4">339</td>
              <td className="py-2 px-4">214.5</td>
            </tr>
            <tr className="border-b border-[#2a2a2a]">
              <td className="py-2 px-4">dst_bytes</td>
              <td className="py-2 px-4">integer</td>
              <td className="py-2 px-4">0</td>
              <td className="py-2 px-4">10</td>
              <td className="py-2 px-4">486</td>
              <td className="py-2 px-4">42678</td>
              <td className="py-2 px-4">8467.5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
