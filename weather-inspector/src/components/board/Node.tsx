import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Handle, Position } from 'reactflow'

export function Node() {
  return (
    <Card className="w-[200px]">
      <CardHeader>Node</CardHeader>
      <CardContent>Node Content</CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}
