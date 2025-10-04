'use client';
import { useGameStore } from '@/lib/store';
import Image from 'next/image';
import { useState } from 'react';
import { MockAskResponse } from '@/lib/types';

// TODO(design): Style the drawer, make it a proper overlay.

export default function ClueDrawer({ evidenceId, onClose }: { evidenceId: string, onClose: () => void }) {
  const { caseData } = useGameStore();
  const [query, setQuery] = useState('');
  const [mockResponse, setMockResponse] = useState<MockAskResponse | null>(null);

  const evidence = caseData?.evidence.find(e => e.id === evidenceId);

  const handleAsk = async () => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: query, evidenceId }),
    });
    const data = await res.json();
    setMockResponse(data);
  };

  if (!evidence) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-1/3 bg-white p-4 shadow-lg overflow-y-auto z-20">
      <button onClick={onClose} className="mb-4">Close</button>
      <h3 className="font-bold text-lg">{evidence.title}</h3>
      <div className="relative w-full h-64 my-4">
        <Image src={evidence.src} alt={evidence.alt || evidence.title} layout="fill" objectFit="contain" />
      </div>
      
      {/* TODO(design): Style the chat/ask section */}
      <div>
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask your partner..."
          className="w-full border p-2"
        />
        <button onClick={handleAsk} className="w-full bg-blue-500 text-white p-2 mt-2">Ask</button>
      </div>

      {mockResponse && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p><strong>Answer:</strong> {mockResponse.answer}</p>
          <p className="text-sm">Confidence: {mockResponse.confidence}</p>
          {mockResponse.next_step && <p className="text-sm italic">Next: {mockResponse.next_step}</p>}
        </div>
      )}
    </div>
  );
}
