import { NextResponse } from 'next/server';
import { WebAIDetective } from '@/lib/ai-detective';
import { getCaseServer } from '@/lib/cases.server';

export async function POST(request: Request) {
  try {
    const { caseId } = await request.json();
    
    if (!caseId) {
      return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
    }

    const caseData = await getCaseServer(caseId);
    const aiDetective = new WebAIDetective();
    
    const analysis = await aiDetective.analyzeAllEvidence(caseData);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch analysis' },
      { status: 500 }
    );
  }
}
