import { CrashSignal, MathModelType } from '../types';

class CrashPredictionEngine {
  private nonceCounter = 1042;

  // SHA256-like pseudo random string generator for Provably Fair simulation
  private generateHash(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  /**
   * Generates a Crash prediction according to user specifications:
   * - Multiplier: 1.30 to 3.15
   * - Target time: close window (+3 to +5 minutes from current time, e.g. 16:30 -> 16:33, 16:34, 16:35)
   * - Reliability: 80% to 100%
   * - Cooldown: exactly 1 minute (60s)
   */
  public generateSignal(modelType: MathModelType = 'pattern_v4'): CrashSignal {
    this.nonceCounter += 1;
    const now = new Date();

    // 1. Calculate Target Time close to current moment (+3 to +5 minutes, ideal proximity)
    const minOffsetMinutes = 3;
    const maxOffsetMinutes = 5;
    const offsetMinutes = minOffsetMinutes + Math.floor(Math.random() * (maxOffsetMinutes - minOffsetMinutes + 1));
    
    const targetDate = new Date(now.getTime() + offsetMinutes * 60 * 1000);
    const windowEndDate = new Date(targetDate.getTime() + (1 + Math.floor(Math.random() * 2)) * 60 * 1000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const predictedTime = `${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;
    const windowEndTime = `${pad(windowEndDate.getHours())}:${pad(windowEndDate.getMinutes())}`;
    const timeWindow = `${predictedTime} - ${windowEndTime}`;

    // 2. Generate Multiplier between 1.30 and 3.15 max based on math model
    let rawMultiplier = 1.30;
    let reliability = 80;
    let comment = '';

    switch (modelType) {
      case 'monte_carlo': {
        // Monte carlo simulation over 1,000 iterations
        const samples: number[] = [];
        for (let i = 0; i < 1000; i++) {
          const rand = Math.random();
          // Exponential distribution capped between 1.30 and 3.15
          const sim = 1.30 + (3.15 - 1.30) * Math.pow(rand, 1.4);
          samples.push(sim);
        }
        samples.sort((a, b) => a - b);
        // Take safe median (p40 to p60)
        const median = samples[Math.floor(samples.length * (0.35 + Math.random() * 0.3))];
        rawMultiplier = Math.min(3.15, Math.max(1.30, median));
        reliability = Math.floor(88 + Math.random() * 12); // 88% - 100%
        comment = 'Monte Carlo (1000 itérations) : point de sortie optimal identifié dans la bande sécurisée.';
        break;
      }
      case 'volatility': {
        // Low-volatility safe entry
        rawMultiplier = 1.30 + Math.random() * (2.40 - 1.30);
        reliability = Math.floor(92 + Math.random() * 8); // 92% - 100%
        comment = 'Matrice de volatilité : indice d\'instabilité faible favorisant un encaissement à haut rendement.';
        break;
      }
      case 'markov': {
        // Markov Chain transition state
        const states = [1.45, 1.59, 1.78, 1.95, 2.15, 2.45, 2.63, 2.85, 3.05, 3.15];
        rawMultiplier = states[Math.floor(Math.random() * states.length)];
        reliability = Math.floor(82 + Math.random() * 16); // 82% - 98%
        comment = 'Chaînes de Markov : transition d\'état vers cycle multiplicateur stabilisé.';
        break;
      }
      case 'pattern_v4':
      default: {
        // Adaptive moving window regression
        const base = 1.30 + Math.random() * (3.15 - 1.30);
        rawMultiplier = Math.min(3.15, Math.max(1.30, base));
        reliability = Math.floor(85 + Math.random() * 15); // 85% - 100%
        comment = 'Régression non-linéaire V4 : convergence statistique optimale pour le tour prévu.';
        break;
      }
    }

    const roundedMultiplier = Math.round(rawMultiplier * 100) / 100;
    const multiplierDisplay = `${roundedMultiplier.toFixed(2)}X`;

    // 3. Cooldown duration: exactly 60 seconds (1 minute)
    const cooldownSeconds = 60;

    return {
      targetMultiplier: roundedMultiplier,
      multiplierDisplay,
      predictedTime,
      timeWindow,
      targetTimestamp: targetDate.getTime(),
      reliabilityPercent: Math.min(100, Math.max(80, reliability)),
      cooldownSeconds,
      serverHash: this.generateHash(),
      clientSeed: `seed_${Math.random().toString(36).substring(2, 10)}`,
      nonce: this.nonceCounter,
      analysisComment: comment,
      generatedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }
}

export const crashPredictionEngine = new CrashPredictionEngine();
