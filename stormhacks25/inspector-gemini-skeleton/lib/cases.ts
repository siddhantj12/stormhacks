import { CaseClient } from './types';

// This function is safe to use in client components.
export async function getCaseClient(id: string): Promise<CaseClient> {
  // In a real app, you'd fetch this from your API at /api/cases/[id]/client
  // We use a direct import here for simplicity in the skeleton.
  const caseData = await import(`@/cases/${id}.client.json`);
  return caseData.default as CaseClient;
}
