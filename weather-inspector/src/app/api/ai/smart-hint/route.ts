import { NextResponse } from 'next/server';
import { WebAIDetective, GameState } from '@/lib/ai-detective';
import { getCaseServer } from '@/lib/cases.server';

export async function POST(request: Request) {
  try {
    const { caseId, gameState, userMessage } = await request.json();
    
    if (!caseId || !gameState) {
      return NextResponse.json({ error: 'Case ID and game state are required' }, { status: 400 });
    }

    const caseData = await getCaseServer(caseId);
    const aiDetective = new WebAIDetective();
    
    const hint = await aiDetective.generateSmartHint(gameState, userMessage || '', caseData);
    
    return NextResponse.json(hint);
  } catch (error) {
    console.error('Smart hint error:', error);
    return NextResponse.json(
      { error: 'Failed to generate smart hint' },
      { status: 500 }
    );
  }
}
