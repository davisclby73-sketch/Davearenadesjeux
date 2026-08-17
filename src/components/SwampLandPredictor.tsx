import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Flame, Cpu, ShieldCheck } from 'lucide-react';

import { MathModelType, PredictionStep } from '../types';
import { predictionEngine, MATH_MODELS } from '../services/predictionEngine';
import { lilyPadToken, frogOnLilyPad } from '../services/gameService';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface SwampLandPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

export const SwampLandPredictor: React.FC<SwampLandPredictorProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [steps, setSteps] = useState<PredictionStep[]>([]);
  const [isStopped, setIsStopped] = useState(false);

  const currentModelObj = MATH_MODELS.find((m) => m.id === selectedModel) || MATH_MODELS[0];

  const handlePredictNextStep = () => {
    if (isStopped || steps.length >= 4) return;

    if (steps.length === 0) {
      if (!quotaManager.canPerformAnalysis()) {
        if (onQuotaBlocked) onQuotaBlocked();
        return;
      }
      quotaManager.consumeAnalysis();
    }

    sounds.playClick();
    const nextStep = predictionEngine.getSwampLandNextStep(
      steps.length,
      selectedModel,
      currentModelObj.recommendedStopRow
    );

    setSteps((prev) => [...prev, nextStep]);

    if (nextStep.isStopPoint || nextStep.rowNumber >= 4) {
      setIsStopped(true);
      sounds.playWarning();
    } else {
      sounds.playAppleReveal();
    }
  };

  const handleReset = () => {
    sounds.playReset();
    setSteps([]);
    setIsStopped(false);
  };

  // Swamp Land Multipliers for 4 rows
  const rowMultipliers = [
    { row: 4, label: 'x 27.16' },
    { row: 3, label: 'x 5.43' },
    { row: 2, label: 'x 2.17' },
    { row: 1, label: 'x 1.3' },
  ];

  const activeRow = steps.length;
  const currentMultiplier = activeRow > 0 ? rowMultipliers.find((r) => r.row === activeRow)?.label : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1391e8] via-[#0172c9] to-[#01589c] text-white flex flex-col justify-between p-3 sm:p-4 max-w-sm mx-auto relative select-none font-sans overflow-hidden">
      {/* Top Bar Header */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-black/30 hover:bg-black/40 border border-white/20 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETOUR</span>
          </button>

          {/* Model Selector Button inside Game SAS */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMathPanel();
            }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/60 hover:border-emerald-400 px-3 py-1 rounded-full shadow-lg transition-all active:scale-95"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate max-w-[120px] font-bold">{currentModelObj.name}</span>
            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-900/80 px-1 rounded">
              {currentModelObj.accuracyPercent}%
            </span>
          </button>
        </div>

        {/* Algorithm SAS Banner */}
        <div className="mb-3 p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/15 text-xs flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="text-[11px] text-white/90">
              <span className="font-bold text-emerald-300">SAS Swampland :</span> {currentModelObj.name}
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMathPanel();
            }}
            className="text-[10px] font-bold text-emerald-300 hover:text-emerald-200 underline shrink-0"
          >
            Changer
          </button>
        </div>

        {/* Stop Warning Banner */}
        <AnimatePresence>
          {isStopped && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-3 p-2.5 rounded-xl bg-amber-500/95 border border-amber-300 text-slate-950 text-xs font-bold text-center shadow-lg"
            >
              ⚠️ SEUIL CRITIQUE DE SÉCURITÉ ATTEINT !
              <div className="text-[11px] font-medium text-slate-900 mt-0.5">
                Encaissez maintenant pour sécuriser le multiplicateur <span className="font-extrabold">{currentMultiplier || 'élevé'}</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wooden Sign Header */}
        <div className="flex justify-center my-1.5">
          <div className="bg-[#8b4513] border-2 border-[#5c2d0c] rounded-lg px-6 py-1.5 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/20 to-transparent pointer-events-none" />
            <span className="text-amber-100 font-black text-sm tracking-wide uppercase font-serif drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Choisissez un nénuphare
            </span>
          </div>
        </div>

        {/* Pond Water Game Grid */}
        <div className="bg-[#026cb1]/60 border-2 border-cyan-300/40 rounded-3xl p-3 shadow-2xl relative my-2 backdrop-blur-sm">
          {/* Grid Rows (Row 4 down to Row 1) */}
          <div className="space-y-3.5">
            {rowMultipliers.map(({ row, label }) => {
              const rowStep = steps.find((s) => s.rowNumber === row);
              const isCurrentRow = activeRow === row;

              return (
                <div key={row} className="flex items-center justify-between gap-1">
                  {/* 5 Lily Pads per Row */}
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {Array.from({ length: 5 }).map((_, colIdx) => {
                      const isSafe = rowStep && rowStep.safeColumnIndex === colIdx;

                      return (
                        <div key={colIdx} className="aspect-square relative flex items-center justify-center p-0.5">
                          {isSafe ? (
                            /* Revealed Safe Lily Pad with Frog */
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-full h-full rounded-full bg-lime-400/90 p-0.5 shadow-lg shadow-lime-900/60 ring-2 ring-lime-300 overflow-hidden flex items-center justify-center"
                            >
                              <img
                                src={frogOnLilyPad}
                                alt="Grenouille"
                                loading="eager"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full"
                              />
                            </motion.div>
                          ) : (
                            /* Unrevealed Lily Pad */
                            <div className={`w-full h-full rounded-full transition-all duration-300 overflow-hidden shadow-inner flex items-center justify-center ${isCurrentRow ? 'ring-2 ring-cyan-300/60 animate-pulse' : 'opacity-85'}`}>
                              <img
                                src={lilyPadToken}
                                alt="Nénuphar"
                                loading="eager"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Multiplier Tag on the Right */}
                  <div className={`min-w-[58px] text-right text-xs font-black tracking-tight font-mono transition-all ${rowStep ? 'text-lime-300 scale-105 drop-shadow' : 'text-white/80'}`}>
                    {label}
                  </div>
                </div>
              );
            })}

            {/* Bottom Row 0: Initial Frog Pad */}
            <div className="pt-2 flex justify-center border-t border-cyan-400/20">
              <div className="w-12 h-12 relative flex items-center justify-center">
                {activeRow === 0 ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-full h-full rounded-full bg-lime-400/80 p-0.5 shadow-lg shadow-lime-950/80 ring-2 ring-lime-300 overflow-hidden"
                  >
                    <img
                      src={frogOnLilyPad}
                      alt="Grenouille Départ"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                ) : (
                  <div className="w-full h-full rounded-full opacity-60 overflow-hidden shadow-inner">
                    <img
                      src={lilyPadToken}
                      alt="Nénuphar Départ"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Info Footer */}
        <div className="flex items-center justify-between text-xs bg-black/40 px-3 py-2 rounded-xl border border-white/10 mt-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white/90">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Étape {steps.length} / 4</span>
          </div>
          <div className="font-mono text-emerald-300 font-extrabold text-sm">
            {currentMultiplier ? `Gain: ${currentMultiplier}` : 'Départ x1.0'}
          </div>
        </div>
      </div>

      {/* Action Controls Footer */}
      <div className="pt-3 pb-2 space-y-2">
        <button
          onClick={handlePredictNextStep}
          disabled={isStopped || steps.length >= 4}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
            isStopped || steps.length >= 4
              ? 'bg-slate-700/80 text-slate-400 border border-slate-600/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 border border-lime-300 active:scale-98 shadow-emerald-950/50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-950 fill-amber-400" />
          <span>{steps.length === 0 ? 'PRÉDIRE (PRÉDICTIONS)' : `PRÉDIRE LIGNE ${steps.length + 1}`}</span>
        </button>

        <button
          onClick={handleReset}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white/90 bg-black/40 hover:bg-black/60 border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
          <span>RÉINITIALISER L'ÉTANG</span>
        </button>
      </div>
    </div>
  );
};

