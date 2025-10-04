import { Card as UICard, CardContent, CardHeader } from '@/components/ui/card'
import { Handle, Position } from 'reactflow'

export function Card() {
  return (
    <UICard className="w-[200px]">
      <CardHeader>Card</CardHeader>
      <CardContent>Card Content</CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </UICard>
  )
}