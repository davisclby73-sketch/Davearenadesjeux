import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Cpu,
  Flame,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Wifi,
  WifiOff,
  CheckCircle2,
  Send,
  Zap,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AviatorSignal, ApiSessionConfig } from '../types';
import { aviatorPredictionEngine } from '../services/aviatorPredictionEngine';
import { cooldownManager } from '../utils/cooldownManager';
import { quotaManager } from '../utils/quotaManager';
import aviatorCover from '../assets/images/aviator_cover_1786524754859.jpg';
import { sounds } from '../utils/audio';

interface AviatorPredictorProps {
  onBack: () => void;
  selectedModel: string;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

export const AviatorPredictor: React.FC<AviatorPredictorProps> = ({
  onBack,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const savedInitialSignal = cooldownManager.getSavedSignal<AviatorSignal>('aviator');
  const [hasGenerated, setHasGenerated] = useState<boolean>(() => !!savedInitialSignal);
  const [timingMode, setTimingMode] = useState<'instant' | 'standard' | 'strategic'>('standard');
  const [signal, setSignal] = useState<AviatorSignal>(() =>
    savedInitialSignal || aviatorPredictionEngine.generateSignal('standard')
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() =>
    cooldownManager.getRemainingCooldown('aviator')
  );
  const [apiConfig, setApiConfig] = useState<ApiSessionConfig>(() => aviatorPredictionEngine.getConfig());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Custom round push input & batch history in config modal
  const [customPushVal, setCustomPushVal] = useState<string>('2.15');
  const [batchInputVal, setBatchInputVal] = useState<string>('');
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);
  const [isForceSyncing, setIsForceSyncing] = useState<boolean>(false);

  // Auto update clock seconds ticker & live backend polling
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString('fr-FR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR'));
      // Sync latest live rounds from express server
      aviatorPredictionEngine.syncFromLiveServer().then(() => {
        setApiConfig(aviatorPredictionEngine.getConfig());
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Cooldown timer management (persistent across navigation)
  useEffect(() => {
    const checkCooldown = () => {
      const remaining = cooldownManager.getRemainingCooldown('aviator');
      setCooldownRemaining(remaining);
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    checkCooldown();
    timerRef.current = setInterval(checkCooldown, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleForceNetworkSync = async () => {
    sounds.playClick();
    setIsForceSyncing(true);
    setPushStatusMessage('🔄 Interrogation directe de l\'API 1WIN en cours...');
    const success = await aviatorPredictionEngine.syncFromLiveServer(true);
    setIsForceSyncing(false);
    setApiConfig(aviatorPredictionEngine.getConfig());
    if (success) {
      setSignal(aviatorPredictionEngine.generateSignal());
      setPushStatusMessage('✅ Connexion API 1WIN réussie ! Tours synchronisés.');
    } else {
      setPushStatusMessage('⚠️ Réseau 1WIN instable. Utilisation du canal de secours.');
    }
    setTimeout(() => setPushStatusMessage(null), 4000);
  };

  const handleBatchInject = async () => {
    if (!batchInputVal.trim()) {
      setPushStatusMessage('Veuillez coller des côtes (ex: 1.85, 2.40, 1.15, 10.79)');
      return;
    }

    const count = await aviatorPredictionEngine.injectBatchHistory(batchInputVal);
    if (count > 0) {
      const updatedSig = aviatorPredictionEngine.generateSignal();
      setSignal(updatedSig);
      cooldownManager.saveSignal('aviator', updatedSig);
      setApiConfig(aviatorPredictionEngine.getConfig());
      setPushStatusMessage(`✅ ${count} tours injectés et synchronisés !`);
      setBatchInputVal('');
      sounds.playAppleReveal();
    } else {
      setPushStatusMessage('⚠️ Aucun chiffre valide détecté.');
    }

    setTimeout(() => setPushStatusMessage(null), 4000);
  };

  const handleGetSignal = (modeOverride?: 'instant' | 'standard' | 'strategic') => {
    if (isGenerating || cooldownRemaining > 0) return;

    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsGenerating(true);
    const activeMode = modeOverride || timingMode;

    setTimeout(() => {
      const newSig = aviatorPredictionEngine.generateSignal(activeMode);
      setSignal(newSig);
      setHasGenerated(true);
      setIsGenerating(false);
      cooldownManager.startCooldown('aviator', 60);
      cooldownManager.saveSignal('aviator', newSig);
      setCooldownRemaining(60);
      sounds.playAppleReveal();
    }, 600);
  };

  const handleSimulatePushRound = () => {
    const val = parseFloat(customPushVal);
    if (isNaN(val) || val <= 0) {
      setPushStatusMessage('Veuillez entrer une côte valide (ex: 2.15)');
      return;
    }

    const updatedSig = aviatorPredictionEngine.pushNewRound(val, new Date().toISOString(), 'manual_test_push');
    setSignal(updatedSig);
    setApiConfig(aviatorPredictionEngine.getConfig());
    setPushStatusMessage(`✅ Côte ${val.toFixed(2)}x synchronisée avec succès !`);
    sounds.playAppleReveal();

    setTimeout(() => {
      setPushStatusMessage(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#0a0406] text-white flex flex-col justify-between p-3 sm:p-4 max-w-md mx-auto relative select-none font-sans overflow-hidden">
      {/* Background Red Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Outer Container Frame */}
      <div className="relative z-10 border border-red-900/40 rounded-3xl bg-[#110507]/90 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl flex flex-col gap-3">
        
        {/* Top Bar Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
            <span>RETOUR</span>
          </button>

          {/* Top Center / Right Mode Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenMathPanel();
              }}
              className="flex items-center gap-1 text-[11px] font-semibold text-red-300 bg-red-950/80 border border-red-700/60 px-2.5 py-1 rounded-full shadow transition-all active:scale-95"
            >
              <Cpu className="w-3 h-3 text-red-400 animate-pulse" />
              <span>ALGO V4</span>
            </button>

            <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-600/50 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider text-red-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{apiConfig.status === 'connected' ? 'API LIVE' : 'MODE LOCAL'}</span>
            </div>
          </div>
        </div>

        {/* 1Win Logo & Aviator Logo Row */}
        <div className="flex items-center justify-between px-1 pt-1">
          {/* 1win Logo Badge */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-1.5 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
            <span className="text-white font-black italic tracking-tighter text-sm px-1.5 drop-shadow">
              1win
            </span>
          </div>

          {/* Aviator Logo Image */}
          <div className="flex items-center gap-1">
            <img
              src={aviatorCover}
              alt="Aviator Spribe"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(239,68,68,0.9)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Hero Signal Box */}
        <div className="relative rounded-2xl border border-red-600/50 bg-gradient-to-b from-[#1c080c] via-[#140508] to-[#0d0305] overflow-hidden p-5 text-center shadow-2xl flex flex-col items-center justify-center min-h-[160px]">
          {/* Airplane Background Graphic Artwork */}
          <div
            className="absolute inset-0 opacity-35 bg-cover bg-center pointer-events-none filter contrast-125 saturate-150 mix-blend-screen"
            style={{ backgroundImage: `url(${aviatorCover})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0305] via-transparent to-red-950/30 pointer-events-none" />

          {/* Header Title */}
          <div className="relative z-10 flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-red-500 drop-shadow">
              SIGNAL PREDICTION
            </span>
            <span className="text-red-400 font-bold text-xs">✕</span>
          </div>

          {/* Main Big Display Odds */}
          <AnimatePresence mode="wait">
            <motion.div
              key={hasGenerated ? signal.targetRange : 'initial'}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="relative z-10 text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(239,68,68,0.6)] font-mono"
            >
              {isGenerating ? (
                <span className="text-red-400 animate-pulse">CALCUL...</span>
              ) : hasGenerated ? (
                signal.targetRange
              ) : (
                '--.-X'
              )}
            </motion.div>
          </AnimatePresence>

          {hasGenerated && (
            <div className="relative z-10 text-[10px] text-red-400/80 font-semibold mt-1">
              GÉNÉRÉ À {signal.generatedAt}
            </div>
          )}
        </div>

        {/* Red Glowing Separator Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-red-800 via-red-500 to-red-800 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

        {/* Dual Cards: JOUER ENTRE & FIABILITÉ */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: JOUER ENTRE */}
          <div className="bg-[#17070a] border border-red-900/50 rounded-2xl p-3 text-center shadow-lg relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-red-500 mb-1">
              JOUER ENTRE
            </div>
            <div className="text-lg sm:text-xl font-black text-white tracking-wide font-mono drop-shadow">
              {hasGenerated ? signal.timeWindow : '--:-- - --:--'}
            </div>
            <div className="text-[9px] text-red-300/60 mt-0.5 font-medium">
              Horaires exacts (1min window)
            </div>
          </div>

          {/* Card 2: FIABILITÉ */}
          <div className="bg-[#17070a] border border-red-900/50 rounded-2xl p-3 text-center shadow-lg relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-wider text-red-500 mb-1">
              FIABILITÉ
            </div>
            <div className="text-lg sm:text-xl font-black text-red-500 tracking-wide font-mono drop-shadow">
              {hasGenerated ? `${signal.reliabilityPercent}%` : '--%'}
            </div>
            <div className="text-[9px] text-red-300/60 mt-0.5 font-medium">
              Confiance modèle V4
            </div>
          </div>
        </div>

        {/* Insight Alert Banner (only when signal is active) */}
        {hasGenerated && (
          <div className="bg-[#150608] border border-red-900/40 rounded-xl p-2.5 flex items-center gap-2.5 shadow-md">
            <div className="w-7 h-7 rounded-lg bg-red-950 border border-red-600/40 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xs font-medium text-red-200/90 leading-tight">
              {signal.analysisComment}
            </div>
          </div>
        )}

        {/* ANALYSE STATISTIQUE Box (when signal is active) */}
        {hasGenerated && (
          <div className="bg-[#140608] border border-red-900/40 rounded-2xl p-3 shadow-inner flex flex-col gap-2.5">
            <div className="text-[11px] font-black uppercase tracking-wider text-red-500">
              ANALYSE STATISTIQUE
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className={`px-2 py-0.5 rounded-md border ${signal.trend === 'baisse' ? 'bg-red-950/80 text-red-400 border-red-800' : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'}`}>
                {signal.trend}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-950/60 text-red-300 border border-red-900/60">
                Vol: {signal.volatility}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                {signal.sampleSize} pts
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-400 border border-red-800">
                {apiConfig.status === 'connected' ? 'LIVE' : 'LOCAL'}
              </span>
            </div>

            {/* Technical Indicators Line */}
            <div className="text-[10px] font-mono text-red-200/80 tracking-tight bg-black/40 p-1.5 rounded-lg border border-red-950">
              MA5:{signal.ma5}x | MA10:{signal.ma10}x | EMA5:{signal.ema5}x | Med:{signal.median}x | σ:{signal.stdDev} | RSI:{signal.rsi}
            </div>

            {/* Multiplier Recent History Bubbles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {signal.recentHistory.map((mult, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-black font-mono px-2 py-1 rounded-md border shrink-0 ${
                    mult >= 10.0
                      ? 'bg-purple-950 text-purple-300 border-purple-500 shadow'
                      : mult >= 2.0
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                      : mult < 1.20
                      ? 'bg-slate-900 text-slate-400 border-slate-700'
                      : 'bg-red-950/80 text-red-300 border-red-800/80'
                  }`}
                >
                  {mult.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timing Window Selector Pills */}
        <div className="bg-[#140608] border border-red-900/40 rounded-2xl p-2 flex flex-col gap-1.5">
          <div className="text-[10px] font-black uppercase tracking-wider text-red-400 px-1 flex items-center justify-between">
            <span>DÉLAI D'ANTICIPATION DU SIGNAL</span>
            <span className="text-[9px] text-red-300/60 font-mono">
              {timingMode === 'instant' ? '~1 MIN' : timingMode === 'standard' ? '~2 MIN' : '~3 MIN'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                sounds.playClick();
                setTimingMode('instant');
                if (hasGenerated) handleGetSignal('instant');
              }}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                timingMode === 'instant'
                  ? 'bg-red-600 text-white border-red-400 shadow-md scale-102'
                  : 'bg-black/40 text-red-300/70 border-red-950 hover:text-white'
              }`}
            >
              ⚡ Rapide (1 min)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setTimingMode('standard');
                if (hasGenerated) handleGetSignal('standard');
              }}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                timingMode === 'standard'
                  ? 'bg-red-600 text-white border-red-400 shadow-md scale-102'
                  : 'bg-black/40 text-red-300/70 border-red-950 hover:text-white'
              }`}
            >
              🎯 Standard (2 min)
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setTimingMode('strategic');
                if (hasGenerated) handleGetSignal('strategic');
              }}
              className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                timingMode === 'strategic'
                  ? 'bg-red-600 text-white border-red-400 shadow-md scale-102'
                  : 'bg-black/40 text-red-300/70 border-red-950 hover:text-white'
              }`}
            >
              🛡️ Stratégique (3 min)
            </button>
          </div>
        </div>

        {/* Signal Status Pill */}
        <div className="bg-[#18070b] border border-red-800/40 rounded-xl py-2 px-3 text-center text-xs font-black tracking-wider text-red-400 uppercase flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>
            {hasGenerated ? (
              `SIGNAL ACTIF - JOUER À ${signal.exactPlayTime}`
            ) : (
              <span className="flex items-center gap-1.5 justify-center">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                PRET POUR ANALYSE
              </span>
            )}
          </span>
        </div>

        {/* Main Glowing Red Action Button / Cooldown Button */}
        {cooldownRemaining > 0 ? (
          <button
            disabled
            className="w-full py-4 px-4 rounded-2xl bg-[#280c10] text-[#a88288] font-bold text-base tracking-wide border border-[#48161e] flex items-center justify-center gap-2 shadow-inner cursor-not-allowed"
          >
            <Clock className="w-5 h-5 text-red-400 animate-spin" />
            <span className="font-mono font-bold text-red-200 text-base">
              Nouveau signal : {formatCooldown(cooldownRemaining)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => handleGetSignal()}
            disabled={isGenerating}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-98 transition-all flex items-center justify-center gap-2 border border-red-400/40 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-white text-red-200" />
            <span>{isGenerating ? 'ANALYSE DU SIGNAL...' : 'OBTENIR SIGNAL'}</span>
          </button>
        )}

        {/* Bottom Gear Link: Configurer Session API */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsConfigModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 text-xs text-red-300/80 hover:text-white font-semibold pt-1 pb-0.5 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-red-400" />
          <span>Configurer Session API</span>
        </button>
      </div>

      {/* API Session Config Modal */}
      <AnimatePresence>
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#140608] border border-red-800/60 rounded-3xl p-5 max-w-sm w-full text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-3 border-b border-red-900/40 pb-2">
                <div className="flex items-center gap-2 font-black text-sm text-red-400">
                  <Settings className="w-4 h-4 text-red-500" />
                  <span>SESSION API & HISTORIQUE</span>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="text-xs text-red-400 hover:text-white font-bold bg-red-950/60 px-2 py-1 rounded-full border border-red-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Status Indicator & Force Sync */}
                <div className="bg-[#1c080c] p-2.5 rounded-xl border border-red-900/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Statut Synchro:</span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>API Live / Auto-Polling</span>
                    </span>
                  </div>
                  <button
                    onClick={handleForceNetworkSync}
                    disabled={isForceSyncing}
                    className="w-full bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/60 rounded-lg py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isForceSyncing ? 'animate-spin text-red-400' : ''}`} />
                    <span>{isForceSyncing ? 'Recherche en cours...' : 'FORCER RÉCUPÉRATION RÉSEAU 1WIN'}</span>
                  </button>
                </div>

                {/* API Endpoint Input */}
                <div>
                  <label className="block font-bold text-red-300 mb-1">
                    Endpoint API Produite (Push Webhook):
                  </label>
                  <input
                    type="text"
                    value={apiConfig.endpointUrl}
                    onChange={(e) => setApiConfig({ ...apiConfig, endpointUrl: e.target.value })}
                    className="w-full bg-black/60 border border-red-900 rounded-xl px-3 py-2 text-xs font-mono text-red-200 focus:outline-none focus:border-red-500"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Recevez en direct l'historique de votre bot Playwright 1win.
                  </div>
                </div>

                {/* Batch Multipliers Recovery Section for Network/Technician Issues */}
                <div className="bg-black/40 p-3 rounded-2xl border border-red-900/40 space-y-2">
                  <label className="block font-bold text-red-300 text-[11px]">
                    Rattrapage Réseau / Injection de Masse :
                  </label>
                  <div className="text-[10px] text-slate-400">
                    Collez plusieurs côtes séparées par des virgules si le réseau est instable (ex: 1.85, 2.40, 1.15, 10.79) :
                  </div>
                  <div className="flex flex-col gap-2">
                    <textarea
                      rows={2}
                      value={batchInputVal}
                      onChange={(e) => setBatchInputVal(e.target.value)}
                      placeholder="Coller les derniers tours : 1.85, 2.40, 1.15, 10.79"
                      className="w-full bg-black border border-red-800 rounded-xl p-2 text-xs font-mono text-white resize-none focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={handleBatchInject}
                      className="bg-red-600 hover:bg-red-500 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-white shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>Injecter Masse Historique</span>
                    </button>
                  </div>

                  {/* Single Push Test */}
                  <div className="pt-2 border-t border-red-900/40 flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={customPushVal}
                      onChange={(e) => setCustomPushVal(e.target.value)}
                      placeholder="Ex: 2.15"
                      className="w-24 bg-black border border-red-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white"
                    />
                    <button
                      onClick={handleSimulatePushRound}
                      className="flex-1 bg-red-900/80 hover:bg-red-800 text-red-200 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-red-700/50"
                    >
                      <Send className="w-3 h-3" />
                      <span>Tour Unique</span>
                    </button>
                  </div>

                  {pushStatusMessage && (
                    <div className="text-[10px] font-semibold text-amber-300 animate-fade-in pt-1">
                      {pushStatusMessage}
                    </div>
                  )}
                </div>

                {/* Python Bot Integration Snippet Info */}
                <div className="bg-black/60 p-2.5 rounded-xl border border-red-950 text-[10px] text-slate-300 space-y-1">
                  <div className="font-bold text-red-400">💡 Intégration Bot Playwright :</div>
                  <div>Chaque nouveau tour capturé en direct par votre script est analysé pour recalculer le RSI, les EMA et la plage horaire optimale.</div>
                </div>

                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-white font-bold text-xs transition-all border border-red-700"
                >
                  FERMER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
