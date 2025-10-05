import { NextResponse } from 'next/server';
import { WebAIDetective, GameState } from '@/lib/ai-detective';
import { getCaseServer } from '@/lib/cases.server';

export async function POST(request: Request) {
  try {
    const { caseId, gameState } = await request.json();
    
    if (!caseId || !gameState) {
      return NextResponse.json({ error: 'Case ID and game state are required' }, { status: 400 });
    }

    const caseData = await getCaseServer(caseId);
    const aiDetective = new WebAIDetective();
    
    const reasoningMap = await aiDetective.generateReasoningMap(gameState, caseData);
    
    return NextResponse.json(reasoningMap);
  } catch (error) {
    console.error('Reasoning map error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reasoning map' },
      { status: 500 }
    );
  }
}
