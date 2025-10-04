import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Handle, Position } from 'reactflow'

export function Evidence() {
  return (
    <Card className="w-[200px]">
      <CardHeader>Evidence</CardHeader>
      <CardContent>Evidence Content</CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}
