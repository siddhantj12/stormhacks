'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap,
  Node, Edge, Connection, EdgeChange, NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useGameStore } from '@/lib/store';
import { getCaseClient } from '@/lib/cases';

// TODO(design): Style the board, nodes, edges, and modal.

export default function BoardShell({ caseId }: { caseId: string }) {
  const router = useRouter();
  const { caseData, loadCase, foundClues, canAccessBoard } = useGameStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [theory, setTheory] = useState('');
  const [result, setResult] = useState<{ rank: string, ending: string } | null>(null);

  useEffect(() => {
    if (!caseData) {
      getCaseClient(caseId).then(loadCase);
    }
  }, [caseId, caseData, loadCase]);

  useEffect(() => {
    if (caseData) {
      const initialNodes: Node[] = caseData.clues
        .filter(clue => foundClues.has(clue.id))
        .map((clue, i) => ({
          id: clue.id,
          position: { x: (i % 5) * 150, y: Math.floor(i / 5) * 100 },
          data: { label: clue.label },
        }));
      setNodes(initialNodes);
    }
  }, [caseData, foundClues]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const handleSuggestLinks = async () => {
    const cluesForApi = nodes.map(n => ({ id: n.id, label: n.data.label }));
    const res = await fetch('/api/board/suggest-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clues: cluesForApi }),
    });
    const data = await res.json();
    const suggestedEdges = data.edges.map((edge: any) => ({
      ...edge,
      id: `${edge.from}-${edge.to}`,
      animated: true,
      style: { stroke: '#999', strokeDasharray: '5,5' },
    }));
    setEdges(eds => [...eds, ...suggestedEdges]);
  };

  const handleSubmitTheory = async () => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, theory }),
    });
    const data = await res.json();
    setResult(data);
  };

  if (!caseData) return <div>Loading Board...</div>;
  if (!canAccessBoard()) return <div>Board is locked. Discover more scenes first.</div>;

  return (
    <div className="w-screen h-screen">
      {/* TODO(design): Header for board */}
      <header className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Detective Board</h1>
        <div>
          <button onClick={() => router.back()} className="mr-4">Back to Scene</button>
          <button onClick={handleSuggestLinks} className="mr-4">Suggest Links (Mock)</button>
          <button onClick={() => setSubmitModalOpen(true)}>Submit Theory</button>
        </div>
      </header>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {isSubmitModalOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            {!result ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Submit Your Theory</h2>
                <textarea
                  className="w-full h-48 p-2 border"
                  value={theory}
                  onChange={(e) => setTheory(e.target.value)}
                  placeholder="Lay out your theory of the case..."
                />
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setSubmitModalOpen(false)} className="mr-2">Cancel</button>
                  <button onClick={handleSubmitTheory} className="bg-blue-500 text-white px-4 py-2">Submit</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Case Result: Rank {result.rank}</h2>
                <p>{result.ending}</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => { setSubmitModalOpen(false); setResult(null); }}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
