import { Board } from '@/components/board/Board'
import { BoardShell } from '@/components/board/BoardShell'
import { getCaseServer } from '@/lib/cases.server'

type BoardPageProps = {
  params: {
    caseId: string
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { caseId } = params
  const c = await getCaseServer(caseId)

  return (
    <BoardShell caseId={caseId}>
      <Board case={c} />
    </BoardShell>
  )
}
