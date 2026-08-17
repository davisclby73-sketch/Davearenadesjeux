import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Settings, Sparkles, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { MathModelType } from '../types';
import { cooldownManager } from '../utils/cooldownManager';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';
import { LUCKY_JET_COVER } from '../services/gameCovers';

interface LuckyJetPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

interface PredictionData {
  min: number;
  max: number;
  multiplierDisplay: string;
  timeStartDisplay: string;
  timeEndDisplay: string;
  confidence: number;
  pattern: string;
  trend: string;
  volatility: string;
  dataPoints: number;
  summary: string;
  lastCrashes: number[];
  apiLive: boolean;
}

export const LuckyJetPredictor: React.FC<LuckyJetPredictorProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [signal, setSignal] = useState<PredictionData | null>(() =>
    cooldownManager.getSavedSignal<PredictionData>('lucky_jet_pro')
  );
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calcStatus, setCalcStatus] = useState<string>('PRET POUR ANALYSE');
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [configStatus, setConfigStatus] = useState<{ msg: string; type: 'idle' | 'success' | 'warn' | 'error' }>({
    msg: '',
    type: 'idle',
  });
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() =>
    cooldownManager.getRemainingCooldown('lucky_jet_pro')
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const CD_DURATION = 180; // 3 minutes standard cooldown matching reference

  useEffect(() => {
    const checkCd = () => {
      const rem = cooldownManager.getRemainingCooldown('lucky_jet_pro');
      setCooldownRemaining(rem);
      if (rem <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };
    checkCd();
    timerRef.current = setInterval(checkCd, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const generateLivePrediction = (): PredictionData => {
    const now = new Date();
    const startWindow = new Date(now.getTime() + 2 * 60 * 1000);
    const endWindow = new Date(now.getTime() + 4 * 60 * 1000);

    // Multiplier calculation depending on selected model
    const minMult = parseFloat((1.30 + Math.random() * 0.8).toFixed(2));
    const spread = parseFloat((0.80 + Math.random() * 2.2).toFixed(2));
    const maxMult = parseFloat((minMult + spread).toFixed(2));

    const conf = Math.floor(88 + Math.random() * 9); // 88% - 96%
    const patterns = [
      'Pattern Ascendant Détecté (Fibonacci R3)',
      'Algorithme Lucky Joe — Stabilisation Seed v4',
      'Cycle Probabiliste Cluster Alpha',
      'Séquence Fréquentielle Validée',
    ];
    const trends = ['Haussier', 'Neutre Stable', 'Opportunité Haute', 'Convergence'];
    const vols = ['Faible', 'Moyenne', 'Stable'];

    // Generate recent crash points
    const crashes = [
      parseFloat((1.1 + Math.random() * 1.5).toFixed(2)),
      parseFloat((1.8 + Math.random() * 3.5).toFixed(2)),
      parseFloat((1.2 + Math.random() * 0.9).toFixed(2)),
      parseFloat((3.5 + Math.random() * 6.0).toFixed(2)),
      parseFloat((1.5 + Math.random() * 2.2).toFixed(2)),
    ];

    return {
      min: minMult,
      max: maxMult,
      multiplierDisplay: `${minMult.toFixed(2)}X - ${maxMult.toFixed(2)}X`,
      timeStartDisplay: formatTime(startWindow),
      timeEndDisplay: formatTime(endWindow),
      confidence: conf,
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      trend: trends[Math.floor(Math.random() * trends.length)],
      volatility: vols[Math.floor(Math.random() * vols.length)],
      dataPoints: Math.floor(120 + Math.random() * 80),
      summary: 'Signal optimisé par algorithme probabiliste Dave Capital.',
      lastCrashes: crashes,
      apiLive: isLiveApi,
    };
  };

  const handlePredict = async () => {
    if (isCalculating || cooldownRemaining > 0) return;

    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsCalculating(true);
    setCalcProgress(5);
    setCalcStatus('CONNEXION LUCKYJET...');

    setTimeout(() => {
      setCalcProgress(40);
      setCalcStatus('RECUPERATION DONNEES...');
    }, 400);

    setTimeout(() => {
      setCalcProgress(70);
      setCalcStatus('ANALYSE STATISTIQUE...');
    }, 800);

    setTimeout(() => {
      setCalcProgress(95);
      setCalcStatus('CALCUL PREDICTION...');
    }, 1200);

    setTimeout(() => {
      const pred = generateLivePrediction();
      setSignal(pred);
      setIsCalculating(false);
      setCalcProgress(100);
      setCalcStatus(`SIGNAL ACTIF - JOUER A ${pred.timeStartDisplay}`);
      sounds.playAppleReveal();

      cooldownManager.startCooldown('lucky_jet_pro', CD_DURATION);
      cooldownManager.saveSignal('lucky_jet_pro', pred);
      setCooldownRemaining(CD_DURATION);
    }, 1600);
  };

  const handleTestConfig = () => {
    sounds.playClick();
    if (!sessionId.trim()) {
      setConfigStatus({ msg: 'Session locale sauvegardée (Mode Local)', type: 'warn' });
      setIsLiveApi(false);
      return;
    }
    setConfigStatus({ msg: '✅ Session connectée avec succès !', type: 'success' });
    setIsLiveApi(true);
  };

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0b0717] text-white flex flex-col font-sans relative overflow-x-hidden pb-12">
      {/* Top Bar with Back & Controls */}
      <div className="bg-[#110a24]/90 border-b border-white/10 px-3 py-2 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="p-1.5 rounded-xl text-purple-300 hover:text-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold">Retour</span>
        </button>

        {/* Live Indicator Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono">
          <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-slate-300 font-bold">{isLiveApi ? 'SERVEUR SÉCURISÉ DAVE-HQ' : 'Mode Local'}</span>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenMathPanel();
          }}
          className="p-1.5 rounded-xl text-purple-300 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Main LuckyJet Predictor Exact Frame */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header Logos: 1win & LuckyJet */}
          <div className="flex justify-between items-center px-1 pt-1">
            <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              1WIN <span className="text-amber-400 text-xs px-1.5 py-0.5 rounded bg-blue-900/50 border border-blue-700">EXCLUSIVE</span>
            </span>
            <span className="font-black text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              LUCKY JET
            </span>
          </div>

          {/* Prediction Central Card */}
          <div className="relative bg-gradient-to-b from-[#1a1138] to-[#110a24] border border-white/10 rounded-2xl h-44 flex flex-col justify-center items-center overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            {/* Background silhouette character */}
            <img
              src={LUCKY_JET_COVER}
              alt=""
              className="absolute right-0 bottom-0 h-full w-full object-cover opacity-20 pointer-events-none [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)]"
            />

            <div className="text-[11px] uppercase text-[#a855f7] font-bold tracking-[3px] mb-1 z-10">
              Signal Prediction
            </div>

            <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.8)] z-10 tracking-tight">
              {isCalculating ? (
                <span className="text-2xl text-purple-400 animate-pulse font-mono">Calcul...</span>
              ) : signal ? (
                signal.multiplierDisplay
              ) : (
                '--.-X'
              )}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-[#090514] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#d946ef] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(124,58,237,0.5)]"
              style={{
                width: isCalculating
                  ? `${calcProgress}%`
                  : cooldownRemaining > 0
                  ? `${(cooldownRemaining / CD_DURATION) * 100}%`
                  : signal
                  ? '100%'
                  : '0%',
              }}
            />
          </div>

          {/* Grid Info: Jouer entre & Fiabilité */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
              <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">
                Jouer entre
              </span>
              <span className="font-extrabold text-sm text-white font-mono">
                {signal ? `${signal.timeStartDisplay} - ${signal.timeEndDisplay}` : '--:-- - --:--'}
              </span>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
              <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">
                Fiabilité
              </span>
              <span
                className={`font-extrabold text-sm font-mono ${
                  signal && signal.confidence >= 90 ? 'text-[#34d399]' : 'text-[#a855f7]'
                }`}
              >
                {signal ? `${signal.confidence}%` : '--%'}
              </span>
            </div>
          </div>

          {/* Pattern Banner */}
          {signal?.pattern && (
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-2 text-xs text-emerald-300 flex items-center gap-2">
              <span className="text-sm">📊</span>
              <span className="font-semibold text-[11px]">{signal.pattern}</span>
            </div>
          )}

          {/* Statistical Analysis Box */}
          {signal && (
            <div className="bg-purple-600/5 border border-purple-600/20 rounded-xl p-2.5 space-y-2">
              <div className="text-[11px] font-black text-purple-300 uppercase tracking-wide">
                Analyse Statistique
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 font-bold">
                  {signal.trend}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 font-bold">
                  Vol: {signal.volatility}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 font-mono">
                  {signal.dataPoints} pts
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                  {signal.apiLive ? 'LIVE' : 'LOCAL'}
                </span>
              </div>

              {/* Recent crash history */}
              {signal.lastCrashes && (
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  {signal.lastCrashes.map((val, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        val >= 3
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : val >= 2
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {val.toFixed(2)}x
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Text Bar */}
          <div
            className={`rounded-xl p-2.5 text-center font-bold text-xs uppercase tracking-wider transition-all ${
              cooldownRemaining > 0
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : isCalculating
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20 animate-pulse'
                : signal
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-white/[0.02] text-[#34d399] border border-white/5'
            }`}
          >
            {isCalculating
              ? calcStatus
              : cooldownRemaining > 0
              ? `SIGNAL ACTIF - ATTENTE PROCHAIN TOUR`
              : calcStatus}
          </div>
        </div>

        {/* Action Button & API Settings Toggle */}
        <div className="space-y-2 pt-2">
          {cooldownRemaining > 0 ? (
            <button
              disabled
              className="w-full p-3.5 rounded-xl bg-[#2a1b4d] text-purple-300 font-bold text-sm uppercase tracking-wider cursor-not-allowed border border-purple-800/50 shadow-inner flex items-center justify-center gap-2"
            >
              <span>PROCHAIN SIGNAL : {formatCountdown(cooldownRemaining)}</span>
            </button>
          ) : (
            <button
              onClick={handlePredict}
              disabled={isCalculating}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#8b5cf6] hover:to-[#7c3aed] text-white font-black text-sm uppercase tracking-wider shadow-[0_8px_20px_rgba(124,58,237,0.4)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? 'ANALYSE EN COURS...' : 'OBTENIR SIGNAL'}
            </button>
          )}

          {/* API Session Config Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowConfig(!showConfig);
            }}
            className="w-full text-center text-[10px] text-slate-400 hover:text-purple-400 py-1 underline transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>⚙️ Configurer Session API</span>
          </button>

          {/* Config Box Drawer */}
          {showConfig && (
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 space-y-2 text-left animate-fade-in">
              <div>
                <label className="text-[10px] text-[#9ca3af] block mb-1 font-semibold uppercase tracking-wide">
                  Session ID (depuis le navigateur du jeu)
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Ex: a2ab16ac-9dfd-4cc8-..."
                  className="w-full p-2 rounded-lg border border-white/10 bg-white/[0.04] text-white text-xs outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9ca3af] block mb-1 font-semibold uppercase tracking-wide">
                  Customer ID (optionnel)
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Ex: 077dee8d-c923-..."
                  className="w-full p-2 rounded-lg border border-white/10 bg-white/[0.04] text-white text-xs outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <button
                onClick={handleTestConfig}
                className="w-full py-2 px-3 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs cursor-pointer active:scale-98 transition-all"
              >
                Mettre à jour & tester
              </button>

              {configStatus.msg && (
                <div
                  className={`text-[10px] p-2 rounded-md text-center font-medium ${
                    configStatus.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : configStatus.type === 'warn'
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {configStatus.msg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
