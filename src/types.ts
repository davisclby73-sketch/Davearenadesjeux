export type GameCategory = 'all' | 'wingame' | 'autres' | 'favorites';

export interface GameItem {
  id: string;
  name: string;
  category: 'wingame' | 'autres';
  provider: string;
  badgeTag?: string;
  badgeType?: '1win' | 'autres' | 'mega1x' | 'hybrid';
  coverImage: string;
  fallbackCoverImage?: string;
  multiplierText?: string;
  isFavorite?: boolean;
  isAvailable: boolean;
  minOdds: number;
  maxOdds: number;
  description: string;
}

export interface PredictionStep {
  rowNumber: number;
  safeColumnIndex: number; // 0 to 4 for 5 columns
  confidencePercent: number;
  oddsMultiplier: number;
  isStopPoint?: boolean;
  note?: string;
}

export type MathModelType = 'monte_carlo' | 'pattern_v4' | 'volatility' | 'markov';

export interface MathModel {
  id: MathModelType;
  name: string;
  description: string;
  accuracyPercent: number;
  riskLevel: 'Faible' | 'Moyen' | 'Elevé';
  recommendedStopRow: number;
}

export interface SeedData {
  clientSeed: string;
  serverHash: string;
  nonce: number;
  generatedAt: string;
}

export interface AviatorSignal {
  targetRange: string; // e.g., "1.85X - 2.47X"
  minTarget: number;
  maxTarget: number;
  timeWindow: string; // e.g., "10:53 - 10:54"
  exactPlayTime: string; // e.g., "10:53"
  reliabilityPercent: number; // e.g., 93
  analysisComment: string; // e.g., "Rebond attendu après 4 crashs bas consécutifs"
  trend: 'hausse' | 'baisse' | 'neutre';
  volatility: 'faible' | 'moyenne' | 'forte';
  sampleSize: number;
  ma5: number;
  ma10: number;
  ema5: number;
  median: number;
  stdDev: number;
  rsi: number;
  recentHistory: number[];
  generatedAt: string;
}

export interface ApiSessionConfig {
  endpointUrl: string;
  autoSync: boolean;
  intervalSeconds: number;
  lastSyncTime?: string;
  status: 'connected' | 'local_fallback' | 'syncing' | 'error';
}

export type MinesBombCount = 2 | 3 | 5 | 7;

export interface MinesSignal {
  bombCount: MinesBombCount;
  starIndices: number[]; // 0 to 24 for 5x5 grid
  starCount: number;
  confidencePercent: number;
  oddsMultiplier: number;
  analysisComment: string;
  generatedAt: string;
}

export type ThimblesBallCount = 1 | 2;

export interface ThimblesSignal {
  ballCount: ThimblesBallCount;
  winningSlots: number[]; // 0, 1, or 2
  confidencePercent: number;
  oddsMultiplier: number;
  serverHash: string;
  clientSeed: string;
  nonce: number;
  entropyScore: number;
  analysisComment: string;
  generatedAt: string;
}

export interface CrashSignal {
  targetMultiplier: number; // between 1.30 and 3.15
  multiplierDisplay: string; // e.g. "1.59X" or "2.63X"
  predictedTime: string; // e.g. "19:02" or "11:14"
  timeWindow: string; // e.g. "11:12 - 11:17"
  targetTimestamp: number;
  reliabilityPercent: number; // 80 to 100
  cooldownSeconds: number; // 60 to 120 (1 to 2 min)
  serverHash: string;
  clientSeed: string;
  nonce: number;
  analysisComment: string;
  generatedAt: string;
}

export interface LuckyJetSignal {
  targetMultiplier: number;
  multiplierDisplay: string;
  predictedTime: string;
  timeWindow: string;
  reliabilityPercent: number;
  cooldownSeconds: number;
  serverHash: string;
  clientSeed: string;
  nonce: number;
  analysisComment: string;
  generatedAt: string;
}

export interface RocketQueenSignal {
  targetMultiplier: number; // 1.50 to 20.00
  multiplierDisplay: string; // e.g. "4.25X"
  safeCashout: number; // e.g. 2.10X
  predictedTime: string; // e.g. "17:54"
  timeWindow: string; // e.g. "17:54 - 17:57"
  targetTimestamp: number;
  reliabilityPercent: number; // 91 to 98%
  cooldownSeconds: number; // 120s
  pattern: string;
  trend: 'Hausse Forte' | 'Opportunité Haute' | 'Stabilisation' | 'Ascendant';
  recentHistory: number[];
  serverHash: string;
  clientSeed: string;
  nonce: number;
  analysisComment: string;
  apiLive: boolean;
  generatedAt: string;
}

