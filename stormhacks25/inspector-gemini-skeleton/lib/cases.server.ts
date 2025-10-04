import { CaseAnswer } from './types';
import fs from 'fs/promises';
import path from 'path';

// This function is SERVER-SIDE ONLY. It uses `fs` to read the answer key.
export async function getCaseAnswer(id: string): Promise<CaseAnswer> {
  const filePath = path.join(process.cwd(), 'cases', `${id}.answer.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as CaseAnswer;
  } catch (error) {
    console.error("Could not read or parse the answer key:", error);
    throw new Error("Answer key not found or invalid.");
  }
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
