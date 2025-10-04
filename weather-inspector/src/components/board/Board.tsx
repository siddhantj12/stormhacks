/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useEffect, useRef } from 'react'
import ReactFlow, { addEdge, useEdgesState, useNodesState, Connection } from 'reactflow' // Import Connection
import 'reactflow/dist/style.css'

import { CaseClient } from '@/lib/types' // Changed Case to CaseClient
import { Card } from './Card'
import { Clue } from './Clue'
import { Evidence } from './Evidence'
import { Node } from './Node'

const nodeTypes = {
  card: Card,
  clue: Clue,
  evidence: Evidence,
  node: Node,
}

type BoardProps = {
  case: CaseClient // Changed Case to CaseClient
}

export function Board({ case: c }: BoardProps) {
  const flowRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(c.board.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(c.board.edges)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)), // Changed any to Connection
    [setEdges]
  )

  useEffect(() => {
    if (flowRef.current) {
      const { clientWidth, clientHeight } = flowRef.current
      setNodes((nds) =>
        nds.map((node) => {
          if (node.position.x === -1 && node.position.y === -1) {
            node.position = {
              x: clientWidth / 2 - 100,
              y: clientHeight / 2 - 50,
            }
          }

          return node
        })
      )
    }
  }, [setNodes])

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-neutral-950"
      />
    </div>
  )
}