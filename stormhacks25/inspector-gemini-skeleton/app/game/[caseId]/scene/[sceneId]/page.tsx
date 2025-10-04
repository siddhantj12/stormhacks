import { SceneShell } from '@/components/scene/SceneShell'
import { getCase } from '@/lib/cases.server'

type ScenePageProps = {
  params: {
    caseId: string
    sceneId: string
  }
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { caseId, sceneId } = params
  const c = await getCase(caseId)

  return <SceneShell case={c} sceneId={sceneId} />
}
