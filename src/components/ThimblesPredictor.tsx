import React, { useState } from 'react';
import {
  X,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { MathModelType, ThimblesBallCount, ThimblesSignal } from '../types';
import { thimblesPredictionEngine } from '../services/thimblesPredictionEngine';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';
import thimblesRealCover from '../assets/images/thimbles_official_cover_1786725783053.jpg';

interface ThimblesPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

// Fixed percentages for 3 cup slots on stage
const SLOT_STYLES = [
  'left-[8px]',
  'left-[calc(50%-44px)]',
  'left-[calc(100%-96px)]',
];

export const ThimblesPredictor: React.FC<ThimblesPredictorProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [ballCount, setBallCount] = useState<ThimblesBallCount>(2); // Default to 2 billes as shown in reference
  const [signal, setSignal] = useState<ThimblesSignal | null>(null);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // slotOfCup[i] = which slot (0, 1, 2) cup `i` is currently situated at
  const [slotOfCup, setSlotOfCup] = useState<number[]>([0, 1, 2]);

  // Front cup during shuffle for 3D depth
  const [frontCupIndex, setFrontCupIndex] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle Clean, Structured 3D Mixing and Clear Prediction Selection
  const handleGetSignal = async () => {
    if (isShuffling) return;

    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsShuffling(true);
    setSignal(null);

    // Initial reset of cup positions
    let currentSlots = [0, 1, 2];
    setSlotOfCup([0, 1, 2]);

    // Perform 4 controlled, fluid permutations
    const swapPairs = [
      [0, 1],
      [1, 2],
      [0, 2],
      [0, 1],
    ];

    for (let i = 0; i < swapPairs.length; i++) {
      const [posA, posB] = swapPairs[i];
      const cupA = currentSlots.findIndex((s) => s === posA);
      const cupB = currentSlots.findIndex((s) => s === posB);

      if (cupA !== -1 && cupB !== -1) {
        const nextSlots = [...currentSlots];
        nextSlots[cupA] = posB;
        nextSlots[cupB] = posA;
        currentSlots = nextSlots;

        setFrontCupIndex(cupA);
        setSlotOfCup([...currentSlots]);
        sounds.playShuffleSwoosh();

        await sleep(280);
      }
    }

    setFrontCupIndex(null);
    await sleep(150);

    // Generate accurate prediction signal with exact winning slots
    const newSignal = thimblesPredictionEngine.generateSignal(ballCount, selectedModel);
    setSignal(newSignal);
    setIsShuffling(false);

    sounds.playAppleReveal();
  };

  const handleSelectBallCount = (count: ThimblesBallCount) => {
    if (isShuffling) return;
    sounds.playClick();
    setBallCount(count);
    setSignal(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#18222d] text-white flex flex-col font-sans relative pb-8 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(25,178,148,0.1),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(72,52,87,0.18),_transparent_60%)] pointer-events-none" />

      {/* 1. Exact Telegram Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#1d2733] border-b border-[#243140] px-4 py-2.5 flex items-center justify-between shadow-md">
        {/* Left Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-300 hover:text-white active:scale-95 transition-all"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Title & Verified Badge */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={onOpenMathPanel}>
          <span className="font-bold text-sm tracking-wide text-white uppercase">
            PREDICTOR SIGNALS
          </span>
          <span className="w-4 h-4 rounded-full bg-[#2aabee] flex items-center justify-center text-white text-[10px] font-black">
            ✓
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Right Menu Dots */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenMathPanel();
          }}
          className="p-1.5 -mr-1.5 rounded-lg text-slate-300 hover:text-white active:scale-95 transition-all"
          title="Options & Modèles Mathématiques"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Main Content Container (Telegram Post Frame) */}
      <div className="p-3.5 space-y-3.5 flex-1 flex flex-col justify-between z-10">
        <div className="space-y-3">
          {/* Official Game Cover Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-[#2b3944] shadow-lg bg-[#1b262a]">
            <img
              src={thimblesRealCover}
              alt="THIMBLES"
              className="w-full h-auto object-cover object-center max-h-[190px]"
            />
          </div>

          {/* 3D Stage with Thimbles Cups / Cases */}
          <div className="relative bg-gradient-to-b from-[#211735] via-[#352549] to-[#1a1228] border border-[#43325c] rounded-2xl p-4 pt-6 pb-6 shadow-xl overflow-hidden min-h-[260px] flex flex-col justify-end items-center">
            {/* Ambient Spotlights */}
            <div className="absolute inset-0 pointer-events-none flex justify-around">
              <div className="w-16 h-48 bg-gradient-to-b from-white/10 to-transparent blur-md -rotate-6 transform -translate-y-4" />
              <div className="w-16 h-48 bg-gradient-to-b from-emerald-400/10 to-transparent blur-md transform -translate-y-4" />
              <div className="w-16 h-48 bg-gradient-to-b from-white/10 to-transparent blur-md rotate-6 transform -translate-y-4" />
            </div>

            {/* Platform Floor Ellipse */}
            <div className="absolute bottom-5 w-[88%] h-7 bg-gradient-to-r from-[#110a1d] via-[#483457] to-[#110a1d] rounded-[50%] border-t border-purple-400/20 shadow-[0_12px_24px_rgba(0,0,0,0.8)]" />

            {/* Fixed Slots with Pearls underneath */}
            <div className="relative w-full max-w-[320px] h-[180px] z-10">
              {/* Base Slot Indicators & Pearl Balls */}
              {[0, 1, 2].map((slotIdx) => {
                const isWinningSlot = signal?.winningSlots.includes(slotIdx);

                return (
                  <div
                    key={`slot-base-${slotIdx}`}
                    className={`absolute bottom-0 w-[88px] flex flex-col items-center justify-end ${SLOT_STYLES[slotIdx]}`}
                  >
                    {/* Indicator Arrow above winning cup */}
                    <div
                      className={`absolute top-0 transition-all duration-500 flex flex-col items-center z-30 ${
                        isWinningSlot
                          ? 'opacity-100 transform -translate-y-6'
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                    >
                      <span className="text-emerald-400 font-black text-2xl filter drop-shadow-[0_0_10px_rgba(16,185,129,1)]">
                        ▼
                      </span>
                    </div>

                    {/* 3D Glowing Pearl Ball under the cup */}
                    <div
                      className={`absolute bottom-2 w-7 h-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,_#ffffff,_#f3f3f3_35%,_#d1d5db_60%,_#6b7280_100%)] shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.85)] transition-all duration-500 z-0 ${
                        isWinningSlot ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                    />
                  </div>
                );
              })}

              {/* The 3 Movable Cups */}
              {[0, 1, 2].map((cupIdx) => {
                const currentSlot = slotOfCup[cupIdx];
                const isWinningCup = signal?.winningSlots.includes(currentSlot);
                const isFront = frontCupIndex === cupIdx;

                return (
                  <div
                    key={`cup-${cupIdx}`}
                    className={`absolute bottom-0 w-[88px] h-[110px] transition-all duration-[280ms] ease-in-out cursor-pointer origin-bottom ${
                      SLOT_STYLES[currentSlot]
                    } ${isFront ? 'z-20' : 'z-10'}`}
                    style={{
                      transform: isWinningCup
                        ? 'translateY(-86px) scale(1.04)'
                        : isShuffling
                        ? isFront
                          ? 'translateY(-4px) scale(1.05)'
                          : 'translateY(2px) scale(0.95)'
                        : 'translateY(0) scale(1)',
                    }}
                  >
                    {/* Glowing Aura at Cup Base when winning */}
                    <div
                      className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[110%] h-6 rounded-[50%] bg-gradient-to-r from-emerald-400/80 via-green-300 to-emerald-500/80 blur-sm transition-opacity duration-500 pointer-events-none ${
                        isWinningCup ? 'opacity-100 animate-pulse' : 'opacity-0'
                      }`}
                    />

                    {/* Wooden Barrel Body */}
                    <div className="relative w-full h-full">
                      {/* Wood Texture & Gradient */}
                      <div
                        className="absolute inset-0 rounded-t-2xl rounded-b-[16px] shadow-[inset_-8px_0_14px_rgba(0,0,0,0.4),inset_8px_0_14px_rgba(255,200,140,0.3),0_8px_16px_rgba(0,0,0,0.5)] overflow-hidden border border-amber-950/70"
                        style={{
                          background: `
                            repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 12px),
                            linear-gradient(180deg, #df8740 0%, #c56828 40%, #994c1a 100%)
                          `,
                        }}
                      />

                      {/* Metallic Steel Bands */}
                      <div className="absolute top-[4%] left-[2%] w-[96%] h-[12%] rounded bg-gradient-to-b from-[#a3abbd] to-[#454c5a] shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-2px_2px_rgba(0,0,0,0.4)]" />
                      <div className="absolute top-[44%] left-[2%] w-[96%] h-[12%] rounded bg-gradient-to-b from-[#a3abbd] to-[#454c5a] shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-2px_2px_rgba(0,0,0,0.4)]" />
                      <div className="absolute bottom-[4%] left-[2%] w-[96%] h-[12%] rounded bg-gradient-to-b from-[#a3abbd] to-[#454c5a] shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-2px_2px_rgba(0,0,0,0.4)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prediction Results Banner */}
          {signal && (
            <div className="bg-gradient-to-r from-[#172328] via-[#1c2e35] to-[#172328] border border-emerald-500/40 rounded-xl p-3 shadow-md flex items-center justify-between text-xs animate-scale-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{signal.winningSlots.length === 1 ? '1 Gobelet Gagnant' : '2 Gobelets Gagnants'} Détecté(s)</span>
              </div>
              <div className="bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-md font-mono text-[11px] border border-emerald-500/40">
                {signal.confidencePercent}% FIABILITÉ
              </div>
            </div>
          )}

          {/* Mode Selector Buttons (1 bille x2.91 / 2 billes x1.45) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSelectBallCount(1)}
              disabled={isShuffling}
              className={`py-3.5 px-3 rounded-xl font-bold text-sm tracking-wide transition-all text-center border ${
                ballCount === 1
                  ? 'bg-[#19b294] border-[#22c55e] text-white shadow-[0_0_12px_rgba(25,178,148,0.35)]'
                  : 'bg-[#101518] border-[#222e36] text-slate-300 hover:text-white hover:bg-[#162026]'
              }`}
            >
              1 bille x2.91
            </button>

            <button
              onClick={() => handleSelectBallCount(2)}
              disabled={isShuffling}
              className={`py-3.5 px-3 rounded-xl font-bold text-sm tracking-wide transition-all text-center border ${
                ballCount === 2
                  ? 'bg-[#19b294] border-[#22c55e] text-white shadow-[0_0_12px_rgba(25,178,148,0.35)]'
                  : 'bg-[#101518] border-[#222e36] text-slate-300 hover:text-white hover:bg-[#162026]'
              }`}
            >
              2 billes x1.45
            </button>
          </div>

          {/* Big Green "Prédiction" Button */}
          <button
            onClick={handleGetSignal}
            disabled={isShuffling}
            className="w-full py-4 rounded-xl bg-[#19b294] hover:bg-[#1bc5a4] active:scale-98 text-white font-black text-base uppercase tracking-wider shadow-[0_4px_16px_rgba(25,178,148,0.35)] transition-all flex items-center justify-center gap-2 border border-emerald-300/40"
          >
            {isShuffling ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>MÉLANGE EN COURS...</span>
              </>
            ) : (
              <span>Prédiction</span>
            )}
          </button>
        </div>

        {/* Bottom Menu / Retour Button */}
        <div className="pt-1">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="w-full py-3.5 rounded-xl bg-[#0f1416] hover:bg-[#151c1f] text-slate-300 hover:text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-[#232e36] active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
