import BoardShell from '@/components/board/BoardShell'
import { getCaseServer } from '@/lib/cases.server'

type BoardPageProps = {
  params: Promise<{
    caseId: string
  }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { caseId } = await params
  const c = await getCaseServer(caseId)

  return <BoardShell caseId={caseId} />
}
