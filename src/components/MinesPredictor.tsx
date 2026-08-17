import React, { useState } from 'react';
import { ArrowLeft, BarChart3, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MathModelType, MinesBombCount, MinesSignal } from '../types';
import { minesPredictionEngine } from '../services/minesPredictionEngine';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface MinesPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

// Chubby 3D Rounded Blue Star SVG matching 1WIN Mines exact style
const OneWinBlueStarSVG = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full p-0.5 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-scale-in"
  >
    <defs>
      <linearGradient id="starBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="starFacetTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Outer 3D Star Shape with smooth rounded joints */}
    <path
      d="M50 10 
         C52 10, 58 22, 63 29 
         C70 30, 85 33, 88 38 
         C91 43, 82 54, 80 65 
         C82 75, 87 87, 82 91 
         C77 95, 63 86, 50 80 
         C37 86, 23 95, 18 91 
         C13 87, 18 75, 20 65 
         C18 54, 9 43, 12 38 
         C15 33, 30 30, 37 29 
         C42 22, 48 10, 50 10 Z"
      fill="url(#starBodyGrad)"
    />
    {/* Inner Glossy Facet Highlight */}
    <path
      d="M50 16 
         C51 16, 56 26, 60 32 
         C66 33, 78 35, 80 39 
         C82 43, 75 51, 73 60 
         C75 68, 78 77, 74 79 
         C70 81, 60 74, 50 69 
         C40 74, 30 81, 26 79 
         C22 77, 25 68, 27 60 
         C25 51, 18 43, 20 39 
         C22 35, 34 33, 40 32 
         C44 26, 49 16, 50 16 Z"
      fill="url(#starFacetTop)"
    />
  </svg>
);

export const MinesPredictor: React.FC<MinesPredictorProps> = ({
  onBack,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [bombCount, setBombCount] = useState<MinesBombCount>(3);
  const [signal, setSignal] = useState<MinesSignal | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null);

  const handleGetSignal = () => {
    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsGenerating(true);
    setSignal(null);

    // Simulate scanning/analyzing sequence
    let flashCount = 0;
    const interval = setInterval(() => {
      setActiveTileIndex(Math.floor(Math.random() * 25));
      flashCount++;
      if (flashCount >= 8) {
        clearInterval(interval);
        setActiveTileIndex(null);

        const newSignal = minesPredictionEngine.generateSignal(bombCount);
        setSignal(newSignal);
        setIsGenerating(false);
        sounds.playAppleReveal();
      }
    }, 90);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0a0d14] text-white flex flex-col font-sans relative pb-10 selection:bg-blue-500 selection:text-white">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#0a0d14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full shadow-inner">
            MINES 1WIN
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenMathPanel();
          }}
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow"
          title="Panneau Modèles Mathematiques"
        >
          <BarChart3 className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between z-10">
        {/* Info Header Banner */}
        <div className="bg-[#121622] border border-blue-900/40 rounded-2xl p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300/70">
                MOTEUR DE PRÉDICTION V4
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <span>1WIN MINES PRO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[11px] font-bold font-mono text-blue-200">
              {signal ? `x${signal.oddsMultiplier}` : 'RTP 98%'}
            </span>
          </div>
        </div>

        {/* 5x5 Grid Container */}
        <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-3.5 sm:p-4 shadow-2xl relative overflow-hidden">
          {/* Grid Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* 5x5 Grid Tiles */}
          <div className="grid grid-cols-5 gap-2.5 relative z-10">
            {Array.from({ length: 25 }, (_, idx) => {
              const isRevealedStar = signal?.starIndices.includes(idx);
              const isFlashing = activeTileIndex === idx;

              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                    isRevealedStar
                      ? 'bg-gradient-to-b from-[#103d7c] to-[#0a2348] border-2 border-blue-400/80 shadow-[0_0_18px_rgba(59,130,246,0.7)] scale-102'
                      : isFlashing
                      ? 'bg-blue-600/30 border border-blue-400/60 scale-98'
                      : 'bg-[#1a202c] border border-slate-700/40 hover:border-slate-600'
                  }`}
                >
                  {isRevealedStar ? (
                    <div className="w-full h-full p-1.5 flex items-center justify-center">
                      <OneWinBlueStarSVG />
                    </div>
                  ) : (
                    <span className="text-sm font-black italic tracking-tighter text-slate-500/40 select-none font-mono">
                      1W
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-4 space-y-3.5 shadow-xl">
          <div className="text-sm font-bold text-slate-200 tracking-wide">
            Number of bombs
          </div>

          {/* Bomb Selector Pills */}
          <div className="bg-[#171d2a] p-1.5 rounded-2xl grid grid-cols-4 gap-1.5 border border-slate-800">
            {([2, 3, 5, 7] as MinesBombCount[]).map((num) => {
              const isSelected = bombCount === num;
              return (
                <button
                  key={num}
                  onClick={() => {
                    sounds.playClick();
                    setBombCount(num);
                    if (signal) setSignal(null);
                  }}
                  className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    isSelected
                      ? 'bg-[#232c3d] text-white shadow-md border border-slate-600/50 scale-102'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c2332]'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Get Signal Action Button */}
          <button
            onClick={handleGetSignal}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-black text-base uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 border border-blue-400/30"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>ANALYSE DES MINES...</span>
              </>
            ) : (
              <>
                <span>Get Signal ★</span>
              </>
            )}
          </button>

          {/* Footer Text Row */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400/80 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Provably fair <strong className="text-white">protected</strong></span>
            </div>
            <div>
              RTP <strong className="text-blue-400 font-mono">98%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
