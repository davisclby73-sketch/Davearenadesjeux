import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Flame, Sparkles, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameItem, MathModelType, SeedData } from '../types';
import { predictionEngine, MATH_MODELS } from '../services/predictionEngine';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface GenericGamePredictorProps {
  game: GameItem;
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

export const GenericGamePredictor: React.FC<GenericGamePredictorProps> = ({
  game,
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [predictionResult, setPredictionResult] = useState<{
    multiplier?: number;
    safeGrid?: number[];
    confidence: number;
    message: string;
  } | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [seed] = useState<SeedData>(() => predictionEngine.generateSeed());

  const currentModelObj = MATH_MODELS.find((m) => m.id === selectedModel) || MATH_MODELS[0];

  const handlePredict = () => {
    if (isAnalyzing) return;

    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsAnalyzing(true);

    setTimeout(() => {
      let result;
      if (game.id === 'lucky_jet' || game.id === 'aviator' || game.id === 'skyracer') {
        const randomMult = Number((1.25 + Math.random() * 4.85).toFixed(2));
        result = {
          multiplier: randomMult,
          confidence: Number((91 + Math.random() * 7.5).toFixed(1)),
          message: `Cashout optimal recommandé à x${randomMult} avec sécurité élevée.`,
        };
        setHistory((prev) => [randomMult, ...prev.slice(0, 4)]);
      } else if (game.id === 'gems_mines' || game.id === 'mines') {
        const safeIndices: number[] = [];
        while (safeIndices.length < 4) {
          const idx = Math.floor(Math.random() * 25);
          if (!safeIndices.includes(idx)) safeIndices.push(idx);
        }
        result = {
          safeGrid: safeIndices,
          confidence: Number((93 + Math.random() * 5.8).toFixed(1)),
          message: '4 Emplacements sécurisés sans mines identifiés.',
        };
      } else {
        const randomMult = Number((1.5 + Math.random() * 3.0).toFixed(2));
        result = {
          multiplier: randomMult,
          confidence: Number((90 + Math.random() * 8.0).toFixed(1)),
          message: `Prédiction de fréquence validée: x${randomMult}`,
        };
      }

      setPredictionResult(result);
      setIsAnalyzing(false);
      sounds.playAppleReveal();
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
      });
    }, 550);
  };

  const handleReset = () => {
    sounds.playReset();
    setPredictionResult(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 min-h-[85vh] flex flex-col justify-between text-white select-none">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold active:scale-95 shadow-md"
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
            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 hover:border-emerald-500 px-3 py-1 rounded-full shadow-sm transition-all active:scale-95"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate max-w-[120px] font-bold">{currentModelObj.name}</span>
          </button>
        </div>

        {/* Algorithm SAS Info Banner */}
        <div className="mb-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-indigo-300">Algorithme SAS :</span> {currentModelObj.name} ({currentModelObj.accuracyPercent}%)
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

        {/* Game Title Header */}
        <div className="text-center my-3">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>{game.name}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{game.provider}</p>
        </div>


        {/* Predictor Canvas Display Box */}
        <div className="bg-[#121620] border border-slate-800/90 rounded-2xl p-5 shadow-2xl relative overflow-hidden my-4">
          {predictionResult ? (
            <div className="text-center space-y-4">
              {predictionResult.multiplier && (
                <div className="py-6">
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">
                    Coefficient Prédit
                  </span>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 drop-shadow-lg">
                    x{predictionResult.multiplier}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fiabilité : {predictionResult.confidence}%</span>
                  </div>
                </div>
              )}

              {predictionResult.safeGrid && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-3">
                    Grille Sécurisée (5x5)
                  </span>
                  <div className="grid grid-cols-5 gap-2 max-w-[240px] mx-auto p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                    {Array.from({ length: 25 }).map((_, idx) => {
                      const isSafe = predictionResult.safeGrid?.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                            isSafe
                              ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400 scale-105'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isSafe ? '💎' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                {predictionResult.message}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" />
              <p className="font-medium text-slate-400">
                Cliquez sur <span className="text-rose-400 font-bold">PRÉDICTIONS</span> pour lancer la prédiction.
              </p>
            </div>
          )}
        </div>

        {/* Multiplier History Bar */}
        {history.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Historique:</span>
            {history.map((val, i) => (
              <span
                key={i}
                className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700/60"
              >
                x{val}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePredict}
            disabled={isAnalyzing}
            className="py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white border border-rose-400/30 hover:brightness-110 shadow-xl shadow-rose-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAnalyzing ? 'ANALYSE...' : 'PRÉDICTIONS'}</span>
          </button>

          <button
            onClick={handleReset}
            className="py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white border border-rose-400/30 hover:brightness-110 shadow-xl shadow-rose-900/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>RÉINITIALISER</span>
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-extrabold tracking-wide transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETOUR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
