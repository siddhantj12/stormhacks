import { CaseAnswer, CaseClient, Update } from './types'; // Import CaseClient, Update
import fs from 'fs/promises';
import path from 'path';

// This function is SERVER-SIDE ONLY. It uses `fs` to read the answer key.
export async function getCaseAnswer(id: string): Promise<CaseAnswer> {
  const filePath = path.join(process.cwd(), 'src/cases', `${id}.answer.json`); // Updated path
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as CaseAnswer;
  } catch (error) {
    console.error("Could not read or parse the answer key:", error);
    throw new Error("Answer key not found or invalid.");
  }
}

// This function is SERVER-SIDE ONLY. It uses `fs` to read the client case data.
export async function getCaseServer(id: string): Promise<CaseClient> {
  const filePath = path.join(process.cwd(), 'src/cases', `${id}.client.json`); // Updated path
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as CaseClient;
  } catch (error) {
    console.error("Could not read or parse the client case data:", error);
    throw new Error("Client case data not found or invalid.");
  }
}

// Mock updateCase function for server-side.
export async function updateCase(id: string, data: Partial<CaseClient>): Promise<CaseClient> {
  // TODO: Implement actual case update logic if needed.
  // For now, just return the existing case data.
  const existingCase = await getCaseServer(id);
  return { ...existingCase, ...data };
}

// Mock getUpdates function for server-side.
export async function getUpdates(): Promise<Update[]> { // Changed to Update[]
  // For now, return an empty array or mock data.
  return [];
}

// This function is SERVER-SIDE ONLY for the submit route.
export function gradeTheory(theory: string, answer: CaseAnswer): 'S' | 'A' | 'F' {
  const lowerTheory = theory.toLowerCase();
  const hasAllMustIncludes = answer.grading.mustInclude.every(keyword => lowerTheory.includes(keyword));
  const hasSomeOf = answer.grading.someOf.some(keyword => lowerTheory.includes(keyword));

  if (hasAllMustIncludes && hasSomeOf) {
    return 'S';
  }
  if (hasSomeOf) {
    return 'A';
  }
  return 'F';
}
