import { ClientWorkstation } from "./client-workstation"

interface Props {
  params: {
    fileId: string
  }
}

export default async function WorkstationPage({ params }: Props) {
  const fileId = params.fileId
  
  return (
    <div>
      <ClientWorkstation fileId={fileId} />
    </div>
  )
} 