import React, { useState } from 'react';
import { ArrowLeft, BarChart3, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { MathModelType, MinesBombCount, MinesSignal } from '../types';
import { minesPredictionEngine } from '../services/minesPredictionEngine';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface MinesClassicPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

// Glossy Golden-Orange 3D Star SVG matching Mines Classic exact screenshot
const ClassicGoldenStarSVG = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full p-0.5 filter drop-shadow-[0_0_12px_rgba(255,160,0,0.85)] animate-scale-in"
  >
    <defs>
      {/* Outer Golden Orange Body Gradient */}
      <linearGradient id="goldOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffb74d" />
        <stop offset="40%" stopColor="#ff9800" />
        <stop offset="100%" stopColor="#e65100" />
      </linearGradient>
      {/* Inner Bright Yellow Core Gradient */}
      <linearGradient id="goldInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#fff176" />
        <stop offset="100%" stopColor="#ffa726" />
      </linearGradient>
      {/* White Gloss Highlight Gradient */}
      <linearGradient id="whiteShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    {/* Main 3D Star Shape */}
    <path
      d="M50 8 
         C52 8, 58 21, 63 28 
         C70 29, 85 32, 88 37 
         C91 42, 82 53, 80 64 
         C82 74, 87 86, 82 90 
         C77 94, 63 85, 50 79 
         C37 85, 23 94, 18 90 
         C13 86, 18 74, 20 64 
         C18 53, 9 42, 12 37 
         C15 32, 30 29, 37 28 
         C42 21, 48 8, 50 8 Z"
      fill="url(#goldOuterGrad)"
      stroke="#ffcc80"
      strokeWidth="1.5"
    />

    {/* Inner Yellow Core Star */}
    <path
      d="M50 22 
         C51 22, 55 31, 59 36 
         C64 37, 74 39, 76 43 
         C78 47, 72 54, 70 61 
         C72 68, 75 75, 71 78 
         C67 80, 58 74, 50 70 
         C42 74, 33 80, 29 78 
         C25 75, 28 68, 30 61 
         C28 54, 22 47, 24 43 
         C26 39, 36 37, 41 36 
         C45 31, 49 22, 50 22 Z"
      fill="url(#goldInnerGrad)"
    />

    {/* Top Left Facet White Gloss Highlight Pill */}
    <path
      d="M45 16 C47 16, 52 24, 54 28 C50 29, 44 26, 42 22 C43 19, 44 16, 45 16 Z"
      fill="url(#whiteShineGrad)"
    />
  </svg>
);

export const MinesClassicPredictor: React.FC<MinesClassicPredictorProps> = ({
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
    <div className="max-w-md mx-auto min-h-screen bg-[#070d18] text-white flex flex-col font-sans relative pb-10 selection:bg-amber-500 selection:text-white">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#070d18]/90 backdrop-blur-md border-b border-cyan-900/40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="w-9 h-9 rounded-xl bg-[#0e1726] border border-cyan-800/50 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-full shadow-inner">
            MINES CLASSIC 1WIN
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenMathPanel();
          }}
          className="w-9 h-9 rounded-xl bg-[#0e1726] border border-cyan-800/50 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow"
          title="Panneau Modèles Mathematiques"
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between z-10">
        {/* Info Header Banner */}
        <div className="bg-[#0b1626] border border-cyan-800/50 rounded-2xl p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300/70">
                MOTEUR DE PRÉDICTION CLASSIC
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <span>1WIN MINES CLASSIC</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold font-mono text-amber-200">
              {signal ? `x${signal.oddsMultiplier}` : 'RTP 98%'}
            </span>
          </div>
        </div>

        {/* 5x5 Grid Container - Cyan Metallic Tiles */}
        <div className="bg-[#09111e] border-2 border-[#122c42] rounded-3xl p-3.5 sm:p-4 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

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
                      ? 'bg-[#060c15] border-2 border-amber-500/80 shadow-[0_0_18px_rgba(255,152,0,0.6)] scale-102'
                      : isFlashing
                      ? 'bg-cyan-400/40 border-2 border-cyan-300 scale-98'
                      : 'bg-gradient-to-b from-[#1892b5] via-[#147a98] to-[#0f5e75] border-2 border-[#125164] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] hover:brightness-110'
                  }`}
                >
                  {isRevealedStar ? (
                    <div className="w-full h-full p-1 flex items-center justify-center">
                      <ClassicGoldenStarSVG />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-[#0b1626] border border-cyan-800/50 rounded-3xl p-4 space-y-3.5 shadow-xl">
          <div className="text-sm font-bold text-slate-200 tracking-wide">
            Number of bombs
          </div>

          {/* Bomb Selector Pills */}
          <div className="bg-[#0e1d32] p-1.5 rounded-2xl grid grid-cols-4 gap-1.5 border border-cyan-900/60">
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
                      ? 'bg-[#1a3152] text-white shadow-md border border-cyan-600/50 scale-102'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#12243d]'
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
                <span>ANALYSE EN COURS...</span>
              </>
            ) : (
              <>
                <span>Get Signal ★</span>
              </>
            )}
          </button>

          {/* Footer Text Row */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400/80 pt-1 border-t border-cyan-900/60">
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
