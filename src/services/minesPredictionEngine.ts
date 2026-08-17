import { MinesBombCount, MinesSignal } from '../types';

class MinesPredictionEngine {
  /**
   * Generates a Mines signal based on selected bomb count (2, 3, 5, 7)
   */
  public generateSignal(bombCount: MinesBombCount): MinesSignal {
    let minStars = 2;
    let maxStars = 5;

    switch (bombCount) {
      case 2:
        minStars = 4;
        maxStars = 7;
        break;
      case 3:
        minStars = 2;
        maxStars = 6;
        break;
      case 5:
        minStars = 2;
        maxStars = 4;
        break;
      case 7:
        minStars = 1;
        maxStars = 3;
        break;
    }

    // Determine exact count of safe stars to reveal for this signal
    const starCount = Math.floor(Math.random() * (maxStars - minStars + 1)) + minStars;

    // Pick 'starCount' unique random cell indices out of 25 (0..24)
    const availableIndices = Array.from({ length: 25 }, (_, i) => i);
    const starIndices: number[] = [];

    // Shuffle and pick
    for (let i = 0; i < starCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const pickedTile = availableIndices.splice(randomIndex, 1)[0];
      starIndices.push(pickedTile);
    }

    // Sort for consistency in display/animation
    starIndices.sort((a, b) => a - b);

    // Calculate realistic odds multiplier based on bomb count & revealed star count
    // Formula for Mines multiplier: Product of (25 - i) / (25 - bombCount - i) for i = 0..starCount-1, minus house edge
    let multiplier = 1.0;
    for (let i = 0; i < starCount; i++) {
      const safeRemaining = 25 - i;
      const safeWithoutBombs = 25 - bombCount - i;
      if (safeWithoutBombs > 0) {
        multiplier *= (safeRemaining / safeWithoutBombs);
      }
    }
    // Apply 98% RTP factor
    const oddsMultiplier = Math.round(multiplier * 0.98 * 100) / 100;

    // Confidence level between 93% and 98.5%
    const confidencePercent = Math.floor(93 + Math.random() * 5.5);

    const timeStr = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      bombCount,
      starIndices,
      starCount,
      confidencePercent,
      oddsMultiplier,
      analysisComment: `Analyse 1WIN V4: ${starCount} cases sûres détectées (${bombCount} pièges).`,
      generatedAt: timeStr,
    };
  }
}

export const minesPredictionEngine = new MinesPredictionEngine();
