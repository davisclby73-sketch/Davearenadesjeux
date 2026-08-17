import { GameItem } from '../types';

import appleIconCell from '../assets/images/apple_green_badge_1786527278298.jpg';
import woodenCellToken from '../assets/images/wooden_cell_token_1786527300884.jpg';
import appleTitleLogo from '../assets/images/apple_of_fortune_title_1786527316319.jpg';

import lilyPadToken from '../assets/images/lily_pad_token_1786609286879.jpg';
import frogOnLilyPad from '../assets/images/frog_on_lily_pad_1786609299578.jpg';
import swampTitleLogo from '../assets/images/swamp_land_title_1786609310558.jpg';
import crashSasBg from '../assets/images/crash_signal_sas1.jpg';

// Robust permanent covers for ALL games
import {
  LUCKY_JET_COVER,
  MINES_COVER,
  MINES_CLASSIC_COVER,
  CRASH_COVER,
  THIMBLES_COVER,
  APPLE_COVER,
  SWAMP_COVER,
  AVIATOR_COVER,
  ROCKET_QUEEN_COVER,
  ROCKET_QUEEN_SAS,
} from './gameCovers';

export const OFFICIAL_SWAMP_ASSETS = {
  waterBg: 'https://gamscdn.com/web-v3/mfs/game-swampland/sw-water-portrait@1x.3d7f81d2c2eb.png',
  frog: 'https://gamscdn.com/web-v3/mfs/game-swampland/frog@1x.32770476659e.png',
  landBg: 'https://gamscdn.com/web-v3/mfs/game-swampland/land@1x.b195a300f0f1.jpg',
  lillies: 'https://gamscdn.com/web-v3/mfs/game-swampland/lillies@1x.9462604d9714.png',
};

// Preload all assets in memory for zero-latency image rendering
export const ALL_IMAGE_ASSETS = [
  APPLE_COVER,
  appleIconCell,
  woodenCellToken,
  appleTitleLogo,
  SWAMP_COVER,
  lilyPadToken,
  frogOnLilyPad,
  swampTitleLogo,
  AVIATOR_COVER,
  LUCKY_JET_COVER,
  MINES_COVER,
  MINES_CLASSIC_COVER,
  THIMBLES_COVER,
  CRASH_COVER,
  ROCKET_QUEEN_COVER,
  ROCKET_QUEEN_SAS,
  crashSasBg,
  OFFICIAL_SWAMP_ASSETS.waterBg,
  OFFICIAL_SWAMP_ASSETS.frog,
  OFFICIAL_SWAMP_ASSETS.landBg,
  OFFICIAL_SWAMP_ASSETS.lillies,
];

export function preloadAllAssets() {
  if (typeof window === 'undefined') return;
  ALL_IMAGE_ASSETS.forEach((src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
}

// Auto-run preloader on module import
preloadAllAssets();

export {
  appleIconCell,
  woodenCellToken,
  appleTitleLogo,
  lilyPadToken,
  frogOnLilyPad,
  swampTitleLogo,
};

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'rocket_queen',
    name: 'ROCKET QUEEN 1WIN',
    category: 'wingame',
    provider: '1WIN',
    badgeTag: '1WIN',
    badgeType: '1win',
    coverImage: ROCKET_QUEEN_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.50,
    maxOdds: 20.00,
    description: 'Mini-jeu crash Rocket Queen 1WIN. Algorithme de prédiction haute précision synchronisé avec l\'historique des tours de vol (cotes fiables 1.5x à 20x).',
  },
  {
    id: 'lucky_jet',
    name: 'Lucky Jet 1WIN',
    category: 'wingame',
    provider: '1WIN',
    badgeTag: '1WIN',
    badgeType: '1win',
    coverImage: LUCKY_JET_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.10,
    maxOdds: 50.00,
    description: 'Mini-jeu crash Lucky Jet 1WIN. Envolez-vous avec Lucky Joe et encaissez avant l\'envol définitif grâce aux signaux de prédiction horaire en temps réel.',
  },
  {
    id: 'apple_of_fortune',
    name: 'Apple of Fortune',
    category: 'autres',
    provider: 'MEGA / 1X',
    badgeTag: 'MEGA / 1X',
    badgeType: 'mega1x',
    coverImage: APPLE_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.23,
    maxOdds: 349.68,
    description: 'Mini-jeu mythique 1XBET / Megapari. Prédisez la position exacte des pommes fraîches ligne par ligne sans tomber sur les pommes empoisonnées.',
  },
  {
    id: 'swamp_land',
    name: 'Swamp Land',
    category: 'autres',
    provider: 'MEGA / 1X',
    badgeTag: 'MEGA / 1X',
    badgeType: 'mega1x',
    coverImage: SWAMP_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.3,
    maxOdds: 27.16,
    description: 'Mini-jeu de la grenouille et des nénuphars 1X / Megapari (Sandland). Traversez le marais ligne par ligne avec des coefficients exceptionnels jusqu\'à x27.16.',
  },
  {
    id: 'aviator',
    name: 'Aviator',
    category: 'wingame',
    provider: '1WIN / MEGA / 1X',
    badgeTag: '1WIN / MEGA / 1X',
    badgeType: 'hybrid',
    coverImage: AVIATOR_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.40,
    maxOdds: 15.00,
    description: 'Mini-jeu Aviator Spribe multi-plateforme. Analyse de l\'historique des tours en temps réel avec prédictions horaires ultra précises.',
  },
  {
    id: 'mines',
    name: 'MINES 1WIN',
    category: 'wingame',
    provider: '1WIN',
    badgeTag: '1WIN',
    badgeType: '1win',
    coverImage: MINES_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.15,
    maxOdds: 24.50,
    description: 'Mini-jeu Mines 1WIN. Prédisez l\'emplacement exact des étoiles de sécurité sur la grille 5x5 selon le nombre de bombes sélectionné.',
  },
  {
    id: 'mines_classic',
    name: 'MINES CLASSIC',
    category: 'autres',
    provider: 'MEGA / 1X',
    badgeTag: 'MEGA / 1X',
    badgeType: 'mega1x',
    coverImage: MINES_CLASSIC_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.15,
    maxOdds: 24.50,
    description: 'Mini-jeu Mines Classic Mega/1X. Grille classique bleue cyan et étoiles dorées brillantes 3D.',
  },
  {
    id: 'thimbles',
    name: 'THIMBLES',
    category: 'autres',
    provider: 'MEGA / 1X',
    badgeTag: 'MEGA / 1X',
    badgeType: 'mega1x',
    coverImage: THIMBLES_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.44,
    maxOdds: 2.88,
    description: 'Mini-jeu Thimbles (Gobelets) 1X / Megapari. Prédisez sous quelle boule ou gobelet la bille dorée est cachée.',
  },
  {
    id: 'crash',
    name: 'CRASH GOLD 1WIN',
    category: 'wingame',
    provider: '1WIN',
    badgeTag: '1WIN',
    badgeType: '1win',
    coverImage: CRASH_COVER,
    isFavorite: false,
    isAvailable: true,
    minOdds: 1.05,
    maxOdds: 100.00,
    description: 'Mini-jeu Crash Avion Doré 1WIN. Suivez l\'ascension de l\'avion et encaissez le multiplicateur avant le crash.',
  },
];
