import SceneShell from '@/components/scene/SceneShell'
import { getCaseServer } from '@/lib/cases.server'

type ScenePageProps = {
  params: Promise<{
    caseId: string
    sceneId: string
  }>
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { caseId, sceneId } = await params
  const c = await getCaseServer(caseId)

  return <SceneShell initialCaseData={c} caseId={caseId} sceneId={sceneId} />
}