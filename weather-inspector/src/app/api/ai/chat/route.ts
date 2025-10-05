import { NextResponse } from 'next/server';
import { WebAIDetective, GameState } from '@/lib/ai-detective';
import { getCaseServer } from '@/lib/cases.server';

export async function POST(request: Request) {
  try {
    const { caseId, gameState, message } = await request.json();
    
    if (!caseId || !gameState || !message) {
      return NextResponse.json({ error: 'Case ID, game state, and message are required' }, { status: 400 });
    }

    const caseData = await getCaseServer(caseId);
    const aiDetective = new WebAIDetective();
    
    const response = await aiDetective.chatWithDetective(message, gameState, caseData);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
