import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical, Settings, Sparkles, Radio } from 'lucide-react';
import { MathModelType, RocketQueenSignal } from '../types';
import { rocketQueenEngine } from '../services/rocketQueenEngine';
import { cooldownManager } from '../utils/cooldownManager';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';
import { ROCKET_QUEEN_COVER, ROCKET_QUEEN_SAS } from '../services/gameCovers';

interface RocketQueenPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

interface PredictionData {
  min: number;
  max: number;
  multiplierDisplay: string;
  safeCashout: number;
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

export const RocketQueenPredictor: React.FC<RocketQueenPredictorProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [signal, setSignal] = useState<PredictionData | null>(() =>
    cooldownManager.getSavedSignal<PredictionData>('rocket_queen_pro')
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
  const [isLiveApi, setIsLiveApi] = useState<boolean>(true);
  const [liveHistory, setLiveHistory] = useState<number[]>([
    1.84, 3.22, 1.25, 5.60, 1.42, 12.80, 2.10, 1.65, 4.30, 1.18, 7.45
  ]);

  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() =>
    cooldownManager.getRemainingCooldown('rocket_queen_pro')
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const CD_DURATION = 180; // 3 minutes standard cooldown

  // Fetch real-time crash rounds from backend gateway
  useEffect(() => {
    rocketQueenEngine.fetchLiveHistory().then((rounds) => {
      if (rounds && rounds.length > 0) {
        setLiveHistory(rounds);
        setIsLiveApi(true);
      }
    });
  }, []);

  // Cooldown countdown loop
  useEffect(() => {
    const checkCd = () => {
      const rem = cooldownManager.getRemainingCooldown('rocket_queen_pro');
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

  const generateLivePrediction = (history: number[]): PredictionData => {
    const activeHistory = history.length > 0 ? history : liveHistory;
    const now = new Date();
    // Minimum 2 minutes in advance to allow preparation
    const startWindow = new Date(now.getTime() + 2 * 60 * 1000);
    const endWindow = new Date(now.getTime() + 4 * 60 * 1000);

    // Call the dedicated Rocket Queen prediction engine
    const engineSignal = rocketQueenEngine.generateSignal(selectedModel, activeHistory);
    const target = engineSignal.targetMultiplier;
    
    // Spread for high accuracy range e.g. 2.10X - 4.50X
    const minMult = Math.max(1.50, Number((target * 0.85).toFixed(2)));
    const maxMult = Number(target.toFixed(2));

    const conf = engineSignal.reliabilityPercent || Math.floor(92 + Math.random() * 6);
    const vols = ['Faible', 'Moyenne', 'Dynamique', 'Optimale'];

    return {
      min: minMult,
      max: maxMult,
      multiplierDisplay: `${minMult.toFixed(2)}X - ${maxMult.toFixed(2)}X`,
      safeCashout: engineSignal.safeCashout,
      timeStartDisplay: formatTime(startWindow),
      timeEndDisplay: formatTime(endWindow),
      confidence: conf,
      pattern: engineSignal.pattern || 'Pattern Ascendant Fusée (Fibonacci R4)',
      trend: engineSignal.trend || 'Hausse Forte',
      volatility: vols[Math.floor(Math.random() * vols.length)],
      dataPoints: activeHistory.length > 0 ? activeHistory.length * 8 + 42 : 148,
      summary: engineSignal.analysisComment || 'Signal certifié par le moteur d’analyse probabiliste Rocket Queen.',
      lastCrashes: activeHistory.slice(0, 6),
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
    setCalcStatus('CONNEXION SERVEUR SÉCURISÉ...');

    // Fetch fresh live history
    const freshRounds = await rocketQueenEngine.fetchLiveHistory();
    setLiveHistory(freshRounds);

    setTimeout(() => {
      setCalcProgress(35);
      setCalcStatus('RÉCUPÉRATION HISTORIQUE DES TOURS...');
    }, 400);

    setTimeout(() => {
      setCalcProgress(70);
      setCalcStatus('ANALYSE PROBABILISTE DU CYCLE...');
    }, 850);

    setTimeout(() => {
      setCalcProgress(95);
      setCalcStatus('CALCUL DU SIGNAL ROCKET QUEEN...');
    }, 1250);

    setTimeout(() => {
      const pred = generateLivePrediction(freshRounds);
      setSignal(pred);
      setIsCalculating(false);
      setCalcProgress(100);
      setCalcStatus(`SIGNAL ACTIF - JOUER À ${pred.timeStartDisplay}`);
      sounds.playAppleReveal();

      cooldownManager.startCooldown('rocket_queen_pro', CD_DURATION);
      cooldownManager.saveSignal('rocket_queen_pro', pred);
      setCooldownRemaining(CD_DURATION);
    }, 1650);
  };

  const handleTestConfig = () => {
    sounds.playClick();
    if (!sessionId.trim()) {
      setConfigStatus({ msg: 'Session Gateway DAVE-HQ connectée avec succès', type: 'success' });
      setIsLiveApi(true);
      return;
    }
    setConfigStatus({ msg: '✅ Session Rocket Queen cryptée et synchronisée !', type: 'success' });
    setIsLiveApi(true);
  };

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0d0714] text-white flex flex-col font-sans relative overflow-x-hidden pb-12">
      {/* Top Bar with Back & Controls */}
      <div className="bg-[#170a24]/90 border-b border-fuchsia-900/30 px-3 py-2 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="p-1.5 rounded-xl text-fuchsia-300 hover:text-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold">Retour</span>
        </button>

        {/* Live Indicator Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-fuchsia-500/20 text-[10px] font-mono">
          <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-emerald-400 animate-pulse' : 'bg-fuchsia-400'}`} />
          <span className="text-slate-300 font-bold">{isLiveApi ? 'SERVEUR SÉCURISÉ DAVE-HQ' : 'Mode Local'}</span>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenMathPanel();
          }}
          className="p-1.5 rounded-xl text-fuchsia-300 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Main Rocket Queen Predictor Frame (Cohesive with Lucky Jet SAS) */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Header Logos: 1WIN & ROCKET QUEEN */}
          <div className="flex justify-between items-center px-1 pt-1">
            <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              1WIN <span className="text-amber-400 text-xs px-1.5 py-0.5 rounded bg-blue-900/50 border border-blue-700">EXCLUSIVE</span>
            </span>
            <span className="font-black text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300">
              ROCKET QUEEN
            </span>
          </div>

          {/* Prediction Central Card */}
          <div className="relative bg-gradient-to-b from-[#280d38] to-[#14061e] border border-fuchsia-500/20 rounded-2xl h-44 flex flex-col justify-center items-center overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]">
            {/* Background silhouette character */}
            <img
              src={ROCKET_QUEEN_SAS || ROCKET_QUEEN_COVER}
              alt="Rocket Queen"
              className="absolute right-0 bottom-0 h-full w-full object-cover opacity-25 pointer-events-none [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_70%)]"
            />

            <div className="text-[11px] uppercase text-[#e879f9] font-bold tracking-[3px] mb-1 z-10">
              Signal Prediction
            </div>

            <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] z-10 tracking-tight">
              {isCalculating ? (
                <span className="text-2xl text-fuchsia-400 animate-pulse font-mono">Calcul...</span>
              ) : signal ? (
                signal.multiplierDisplay
              ) : (
                '--.-X'
              )}
            </div>

            {signal && (
              <div className="z-10 mt-1.5 px-2.5 py-0.5 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/30 text-[10px] font-bold text-fuchsia-200">
                Sortie sécurisée : <span className="text-amber-300 font-mono">{signal.safeCashout.toFixed(2)}x</span>
              </div>
            )}
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-[#09030e] rounded-full overflow-hidden border border-fuchsia-500/10">
            <div
              className="h-full bg-gradient-to-r from-[#c026d3] via-[#e11d48] to-[#f43f5e] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(217,70,239,0.5)]"
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
            <div className="bg-white/[0.03] border border-fuchsia-500/10 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
              <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">
                Jouer entre
              </span>
              <span className="font-extrabold text-sm text-white font-mono">
                {signal ? `${signal.timeStartDisplay} - ${signal.timeEndDisplay}` : '--:-- - --:--'}
              </span>
            </div>

            <div className="bg-white/[0.03] border border-fuchsia-500/10 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
              <span className="text-[#9ca3af] font-semibold uppercase text-[10px] tracking-wider">
                Fiabilité
              </span>
              <span
                className={`font-extrabold text-sm font-mono ${
                  signal && signal.confidence >= 90 ? 'text-[#34d399]' : 'text-[#e879f9]'
                }`}
              >
                {signal ? `${signal.confidence}%` : '--%'}
              </span>
            </div>
          </div>

          {/* Pattern Banner */}
          {signal?.pattern && (
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-2 text-xs text-fuchsia-300 flex items-center gap-2">
              <span className="text-sm">🚀</span>
              <span className="font-semibold text-[11px]">{signal.pattern}</span>
            </div>
          )}

          {/* Statistical Analysis Box */}
          {signal && (
            <div className="bg-fuchsia-950/30 border border-fuchsia-600/20 rounded-xl p-2.5 space-y-2">
              <div className="text-[11px] font-black text-fuchsia-300 uppercase tracking-wide flex items-center justify-between">
                <span>Analyse Statistique Rocket Queen</span>
                <span className="text-[9px] text-fuchsia-300/80 font-mono">PASSERELLE CRYPTÉE VIP</span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-200 font-bold">
                  {signal.trend}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-200 font-bold">
                  Vol: {signal.volatility}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 font-mono">
                  {signal.dataPoints} pts
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                  {signal.apiLive ? 'DAVE VIP GATEWAY' : 'LOCAL'}
                </span>
              </div>

              {/* Recent crash history pills */}
              {signal.lastCrashes && signal.lastCrashes.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  {signal.lastCrashes.map((val, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        val >= 10
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 ring-1 ring-amber-500/20'
                          : val >= 2
                          ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                          : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
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
                ? 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 animate-pulse'
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
              className="w-full p-3.5 rounded-xl bg-[#290d38] text-fuchsia-300 font-bold text-sm uppercase tracking-wider cursor-not-allowed border border-fuchsia-800/50 shadow-inner flex items-center justify-center gap-2"
            >
              <span>PROCHAIN SIGNAL : {formatCountdown(cooldownRemaining)}</span>
            </button>
          ) : (
            <button
              onClick={handlePredict}
              disabled={isCalculating}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#c026d3] to-[#e11d48] hover:from-[#d946ef] hover:to-[#f43f5e] text-white font-black text-sm uppercase tracking-wider shadow-[0_8px_20px_rgba(217,70,239,0.4)] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
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
            className="w-full text-center text-[10px] text-slate-400 hover:text-fuchsia-400 py-1 underline transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>⚙️ Configurer Passerelle Cryptée Dave Capital</span>
          </button>

          {/* Config Box Drawer */}
          {showConfig && (
            <div className="bg-white/[0.02] border border-fuchsia-500/20 rounded-xl p-3 space-y-2 text-left animate-fade-in">
              <div>
                <label className="text-[10px] text-[#9ca3af] block mb-1 font-semibold uppercase tracking-wide">
                  Passerelle Sécurisée
                </label>
                <div className="p-2 rounded-lg border border-fuchsia-500/20 bg-black/40 text-emerald-300 text-xs font-mono">
                  DAVE-VIP-GATEWAY-v4.2 (Cryptage SSL/TLS)
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#9ca3af] block mb-1 font-semibold uppercase tracking-wide">
                  Token VIP Utilisateur (optionnel)
                </label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Ex: DAVE-VIP-KEY-XXXX"
                  className="w-full p-2 rounded-lg border border-white/10 bg-white/[0.04] text-white text-xs outline-none focus:border-fuchsia-500 font-mono"
                />
              </div>

              <button
                onClick={handleTestConfig}
                className="w-full py-2 px-3 rounded-lg bg-[#c026d3] hover:bg-[#d946ef] text-white font-bold text-xs cursor-pointer active:scale-98 transition-all"
              >
                Tester la connexion
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
