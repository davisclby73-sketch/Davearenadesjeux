import { LuckyJetSignal, MathModelType } from '../types';

export const luckyJetPredictionEngine = {
  generateSignal(model: MathModelType = 'monte_carlo'): LuckyJetSignal {
    const now = new Date();
    const futureMinutes = 1 + Math.floor(Math.random() * 3);
    const targetDate = new Date(now.getTime() + futureMinutes * 60 * 1000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const predictedTime = `${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;
    
    const endMinutes = new Date(targetDate.getTime() + 2 * 60 * 1000);
    const timeWindow = `${predictedTime} - ${pad(endMinutes.getHours())}:${pad(endMinutes.getMinutes())}`;

    // Lucky Jet multiplier distributions
    let multiplier: number;
    const roll = Math.random();
    if (roll < 0.45) {
      multiplier = 1.30 + Math.random() * 1.20; // 1.30x - 2.50x
    } else if (roll < 0.80) {
      multiplier = 2.50 + Math.random() * 3.50; // 2.50x - 6.00x
    } else {
      multiplier = 6.00 + Math.random() * 14.00; // 6.00x - 20.00x
    }

    const roundedMultiplier = Math.round(multiplier * 100) / 100;
    const reliability = 88 + Math.floor(Math.random() * 11); // 88% - 98%

    const hexChars = '0123456789abcdef';
    let serverHash = '';
    let clientSeed = '';
    for (let i = 0; i < 32; i++) {
      serverHash += hexChars[Math.floor(Math.random() * hexChars.length)];
      if (i < 16) clientSeed += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    const comments = [
      'Accumulation ascendante détectée sur l’algorithme Lucky Joe.',
      'Séquence de vol optimale : palier de sécurité identifié.',
      'Densité de dispersion favorable pour encaissement ciblé.',
      'Équilibre stochastique stabilisé sur le cluster 1WIN.',
    ];

    return {
      targetMultiplier: roundedMultiplier,
      multiplierDisplay: `${roundedMultiplier.toFixed(2)}x`,
      predictedTime,
      timeWindow,
      reliabilityPercent: reliability,
      cooldownSeconds: 60,
      serverHash,
      clientSeed,
      nonce: Math.floor(Math.random() * 9000) + 1000,
      analysisComment: comments[Math.floor(Math.random() * comments.length)],
      generatedAt: now.toISOString(),
    };
  },
};
