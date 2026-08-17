import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Info, Flame, Cpu, ShieldCheck } from 'lucide-react';

import { MathModelType, PredictionStep } from '../types';
import { predictionEngine, MATH_MODELS } from '../services/predictionEngine';
import { appleIconCell, woodenCellToken, appleTitleLogo } from '../services/gameService';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface AppleOfFortuneProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

export const AppleOfFortunePredictor: React.FC<AppleOfFortuneProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [steps, setSteps] = useState<PredictionStep[]>([]);
  const [isStopped, setIsStopped] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  // Automatic safe stop row threshold determined by algorithm (e.g. 2 or 3 rows max per round)
  const [targetStopRow] = useState<number>(() => Math.floor(Math.random() * 2) + 2); // 2 or 3

  const currentModelObj = MATH_MODELS.find((m) => m.id === selectedModel) || MATH_MODELS[0];

  const handlePredict = () => {
    if (isStopped || isPredicting) return;

    // Only consume quota on round start (step 0)
    if (steps.length === 0) {
      if (!quotaManager.canPerformAnalysis()) {
        if (onQuotaBlocked) onQuotaBlocked();
        return;
      }
      quotaManager.consumeAnalysis();
    }

    sounds.playClick();
    setIsPredicting(true);

    setTimeout(() => {
      const currentRowsCount = steps.length;
      const nextStep = predictionEngine.getNextStep(currentRowsCount, selectedModel, targetStopRow);

      const updatedSteps = [...steps, nextStep];
      setSteps(updatedSteps);
      sounds.playAppleReveal();

      // Trigger stop notification if max safe row reached
      if (nextStep.rowNumber >= targetStopRow) {
        setIsStopped(true);
        sounds.playWarning();
      }

      setIsPredicting(false);
    }, 300);
  };

  const handleReset = () => {
    sounds.playReset();
    setSteps([]);
    setIsStopped(false);
  };

  // Determine which rows to display
  const displayRowsCount = Math.max(1, steps.length + (isStopped ? 1 : 1));
  const rowNumbers = Array.from({ length: displayRowsCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#090b10] text-white flex flex-col justify-between p-4 max-w-sm mx-auto relative select-none font-sans">
      {/* Top Header Title & Internal SAS Model Selector */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222733] text-slate-300 text-xs font-bold hover:bg-[#2e3444] transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETOUR</span>
          </button>

          {/* Internal Game SAS Model Selector Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMathPanel();
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 hover:border-emerald-500 px-3 py-1 rounded-full shadow-sm transition-all active:scale-95"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate max-w-[120px] font-bold">{currentModelObj.name}</span>
            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-900/60 px-1 rounded">
              {currentModelObj.accuracyPercent}%
            </span>
          </button>
        </div>

        {/* Algorithm SAS Recommendation Banner */}
        <div className="mb-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-indigo-300">Algorithme SAS :</span> {currentModelObj.name}
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMathPanel();
            }}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline shrink-0"
          >
            Changer
          </button>
        </div>

        {/* Warning Card (Shown when stopped/safety threshold reached) */}
        <AnimatePresence>
          {isStopped && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className="my-3 p-4 rounded-xl bg-[#1b0a0e] border-2 border-[#ef4444] text-white text-center shadow-lg shadow-rose-950/60"
            >
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-100">
                Pour éviter les risques, veuillez vous arrêter ici ou ramasser l'argent et réinitialiser.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Apple of Fortune Official Script Logo */}
        <div className="flex justify-center my-3">
          <img
            src={appleTitleLogo}
            alt="Apple of Fortune"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-12 sm:h-14 object-contain drop-shadow-md"
          />
        </div>

        {/* The Game Grid Container */}
        <div className="bg-[#131620] border border-slate-800/80 rounded-2xl p-4 my-2 shadow-2xl relative">
          {/* Rows stacked vertically (top row is highest number, bottom row is line 1) */}
          <div className="flex flex-col-reverse gap-3.5">
            {rowNumbers.map((rNum) => {
              const stepForThisRow = steps.find((s) => s.rowNumber === rNum);
              const isRevealed = Boolean(stepForThisRow);

              return (
                <div key={rNum} className="flex items-center justify-between gap-2">
                  {/* 5 Column Circles */}
                  <div className="flex-1 grid grid-cols-5 gap-2.5">
                    {[0, 1, 2, 3, 4].map((colIdx) => {
                      const isApple = isRevealed && stepForThisRow?.safeColumnIndex === colIdx;

                      return (
                        <div
                          key={colIdx}
                          className="aspect-square rounded-full flex items-center justify-center relative transition-all duration-300"
                        >
                          {isApple ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-full h-full rounded-full shadow-md shadow-emerald-950 flex items-center justify-center overflow-hidden"
                            >
                              <img
                                src={appleIconCell}
                                alt="Pomme"
                                loading="eager"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full"
                              />
                            </motion.div>
                          ) : (
                            <div className="w-full h-full rounded-full bg-[#242936] border border-slate-700/40 overflow-hidden flex items-center justify-center shadow-inner">
                              <img
                                src={woodenCellToken}
                                alt="Token"
                                loading="eager"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full opacity-60"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Row Index Number in Red on Right */}
                  <div className="w-5 flex items-center justify-end text-[#ef4444] font-extrabold text-base">
                    {rNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {/* PRÉDICTIONS BUTTON */}
          <button
            disabled={isStopped || isPredicting}
            onClick={handlePredict}
            className={`py-3.5 px-3 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              isStopped
                ? 'bg-[#5c3538] text-rose-300/40 border border-rose-900/40 cursor-not-allowed shadow-none'
                : 'bg-[#ef5350] hover:bg-[#e53935] text-white shadow-lg shadow-rose-950/50'
            }`}
          >
            {isPredicting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ANALYSE...</span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4" />
                <span>PRÉDICTIONS</span>
              </>
            )}
          </button>

          {/* RÉINITIALISER BUTTON */}
          <button
            onClick={handleReset}
            className="py-3.5 px-3 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 bg-[#ef5350] hover:bg-[#e53935] text-white shadow-lg shadow-rose-950/50 transition-all duration-200 active:scale-95"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>RÉINITIALISER</span>
          </button>
        </div>

        {/* RETOUR BUTTON */}
        <div>
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="w-28 py-2.5 px-3 rounded-xl bg-[#282d3a] hover:bg-[#323849] text-slate-200 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>RETOUR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

