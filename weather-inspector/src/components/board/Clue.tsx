import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Handle, Position } from 'reactflow'

export function Clue() {
  return (
    <Card className="w-[200px]">
      <CardHeader>Clue</CardHeader>
      <CardContent>Clue Content</CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}
