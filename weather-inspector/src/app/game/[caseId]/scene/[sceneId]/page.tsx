import SceneShell from '@/components/scene/SceneShell'
import { getCaseServer } from '@/lib/cases.server'

type ScenePageProps = {
  params: {
    caseId: string
    sceneId: string
  }
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { caseId, sceneId } = { ...params } // Create a new object
  const c = await getCaseServer(caseId)

  return <SceneShell initialCaseData={c} caseId={caseId} sceneId={sceneId} />
}