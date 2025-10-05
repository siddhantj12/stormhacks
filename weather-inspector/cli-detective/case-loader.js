import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CaseLoader {
  constructor() {
    this.casesPath = path.join(__dirname, '..', 'src', 'cases');
  }

  async loadCase(caseId) {
    try {
      const casePath = path.join(this.casesPath, `${caseId}.client.json`);
      const caseData = JSON.parse(fs.readFileSync(casePath, 'utf8'));
      
      // Add computed properties
      caseData.scenes.forEach(scene => {
        scene.status = this.determineSceneStatus(scene);
        scene.hotspots.forEach(hotspot => {
          hotspot.accessible = this.isHotspotAccessible(hotspot, caseData);
        });
      });

      caseData.clues.forEach(clue => {
        clue.status = 'hidden'; // Will be updated as game progresses
      });

      return caseData;
    } catch (error) {
      throw new Error(`Failed to load case ${caseId}: ${error.message}`);
    }
  }

  determineSceneStatus(scene) {
    if (!scene.lockedUntil) {
      return 'unlocked';
    }
    // For now, assume all scenes are unlocked
    // In a real game, this would check against found clues
    return 'unlocked';
  }

  isHotspotAccessible(hotspot, caseData) {
    // For now, assume all hotspots are accessible
    // In a real game, this would check prerequisites
    return true;
  }

  async loadCaseAnswer(caseId) {
    try {
      const answerPath = path.join(this.casesPath, `${caseId}.answer.json`);
      return JSON.parse(fs.readFileSync(answerPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load case answer ${caseId}: ${error.message}`);
    }
  }

  listAvailableCases() {
    try {
      const files = fs.readdirSync(this.casesPath);
      return files
        .filter(file => file.endsWith('.client.json'))
        .map(file => file.replace('.client.json', ''));
    } catch (error) {
      return [];
    }
  }
}

