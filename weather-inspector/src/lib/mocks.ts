import { MockAskResponse, SuggestEdgesResponse, SuggestEdgesRequest } from './types';

const mockAnswers: MockAskResponse[] = [
  {
    answer: "I see a hairline crack on one key near the lower-left of the piano.",
    confidence: 0.68,
    highlights: [{ x: 0.42, y: 0.64, w: 0.08, h: 0.03, label: "possible crack" }],
    next_step: "Zoom closer or check for mechanical parts beneath that key."
  },
  {
    answer: "The symbol on the sheet music doesn't seem to be a standard musical notation. It might be a code or a personal mark.",
    confidence: 0.85,
    next_step: "Let's cross-reference this symbol with the conductor's personal effects."
  },
  {
    answer: "The CCTV feed shows a brief moment of static at 8:59 PM, exactly when the conductor was reported to have vanished.",
    confidence: 0.95,
    highlights: [{ x: 0.7, y: 0.1, w: 0.2, h: 0.1, label: "Timestamp" }],
    next_step: "This confirms the time of the event. The static suggests deliberate tampering."
  }
];

export function getMockAskResponse(question: string): MockAskResponse {
  // Simple logic to rotate through mock answers
  const index = question.length % mockAnswers.length;
  return mockAnswers[index];
}

export function getMockSuggestedLinks(req: SuggestEdgesRequest): SuggestEdgesResponse {
  const { clues } = req;
  const response: SuggestEdgesResponse = { edges: [] };

  const hasTampered = clues.some(c => c.id === 'clue_cctv_tampered');
  const hasNote = clues.some(c => c.id === 'clue_threatening_note');

  if (hasTampered && hasNote) {
    response.edges.push({
      from: 'clue_cctv_tampered',
      to: 'clue_threatening_note',
      reason: 'A threat could explain why someone would tamper with security.',
      suggested: true
    });
  }

  return response;
}
