import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sparkles,
  Zap,
  Gauge,
  Flame,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { MathModelType, CrashSignal } from '../types';
import { crashPredictionEngine } from '../services/crashPredictionEngine';
import { cooldownManager } from '../utils/cooldownManager';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface CrashPredictorProps {
  onBack: () => void;
  selectedModel: MathModelType;
  onOpenMathPanel: () => void;
  onQuotaBlocked?: () => void;
}

export const CrashPredictor: React.FC<CrashPredictorProps> = ({
  onBack,
  selectedModel,
  onOpenMathPanel,
  onQuotaBlocked,
}) => {
  const [signal, setSignal] = useState<CrashSignal | null>(() =>
    cooldownManager.getSavedSignal<CrashSignal>('crash')
  );
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(() =>
    cooldownManager.getRemainingCooldown('crash')
  );
  const [currentLiveOdds, setCurrentLiveOdds] = useState<number>(1.00);
  const [radarAngle, setRadarAngle] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const flightAnimRef = useRef<NodeJS.Timeout | null>(null);
  const radarAnimRef = useRef<number | null>(null);

  // Radar continuous ambient scan
  useEffect(() => {
    let angle = 0;
    const loop = () => {
      angle = (angle + 1.5) % 360;
      setRadarAngle(angle);
      radarAnimRef.current = requestAnimationFrame(loop);
    };
    radarAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (radarAnimRef.current) cancelAnimationFrame(radarAnimRef.current);
    };
  }, []);

  // Cooldown timer management (persistent across navigation)
  useEffect(() => {
    const checkCooldown = () => {
      const remaining = cooldownManager.getRemainingCooldown('crash');
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

  // Handle Signal Generation with Live Flight Climb Simulation
  const handleGetSignal = async () => {
    if (isCalculating || cooldownRemaining > 0) return;

    if (!quotaManager.canPerformAnalysis()) {
      if (onQuotaBlocked) onQuotaBlocked();
      return;
    }

    quotaManager.consumeAnalysis();

    sounds.playClick();
    setIsCalculating(true);
    setCurrentLiveOdds(1.00);

    // Dynamic flight simulation to reach the target multiplier
    const newSignal = crashPredictionEngine.generateSignal(selectedModel);
    sounds.playShuffleSwoosh();

    const targetVal = newSignal.targetMultiplier;
    const duration = 1400; // ms
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    flightAnimRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      // Exponential curve for airplane flight feeling
      const current = 1.00 + (targetVal - 1.00) * Math.pow(progress, 1.6);
      setCurrentLiveOdds(Math.round(current * 100) / 100);

      if (step >= steps) {
        if (flightAnimRef.current) clearInterval(flightAnimRef.current);
        setCurrentLiveOdds(targetVal);
        setSignal(newSignal);
        setIsCalculating(false);
        cooldownManager.startCooldown('crash', newSignal.cooldownSeconds);
        cooldownManager.saveSignal('crash', newSignal);
        setCooldownRemaining(newSignal.cooldownSeconds);
        sounds.playAppleReveal();
      }
    }, stepDuration);
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#100806] text-white flex flex-col font-sans relative pb-8 selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(220,38,38,0.1),_transparent_60%)] pointer-events-none" />

      {/* 1. Header Telegram Bar */}
      <div className="sticky top-0 z-30 bg-[#190d08]/95 backdrop-blur-md border-b border-[#2e170e] px-4 py-2.5 flex items-center justify-between shadow-md">
        <button
          id="btn-crash-back-header"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-300 hover:text-white active:scale-95 transition-all"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          id="btn-crash-math-title"
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={onOpenMathPanel}
        >
          <span className="font-extrabold text-sm tracking-wide text-white uppercase">
            PREDICTOR SIGNALS
          </span>
          <span className="w-4 h-4 rounded-full bg-[#2aabee] flex items-center justify-center text-white text-[10px] font-black">
            ✓
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <button
          id="btn-crash-menu-dots"
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

      {/* 2. Main Body Container */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between z-10">
        <div className="space-y-4 flex flex-col items-center">
          {/* Top Badge & Model Indicator */}
          <div className="w-full flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-black tracking-wider text-orange-400 uppercase">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>CRASH 1WIN AIRPLANE</span>
            </div>
            <div className="flex items-center gap-1 bg-[#23120b] border border-[#3e2013] px-2.5 py-0.5 rounded-full text-[11px] font-mono text-amber-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Range: 1.30X - 3.15X</span>
            </div>
          </div>

          {/* Central 3D Vector Flight Radar Stage */}
          <div className="relative w-full max-w-[340px] h-[280px] rounded-3xl bg-gradient-to-b from-[#1f0f09] via-[#160a06] to-[#0c0503] border border-[#4a2414] shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center justify-between p-5 overflow-hidden">
            {/* Grid & Radar Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <div className="absolute inset-x-0 top-1/4 border-b border-orange-500/40 border-dashed" />
              <div className="absolute inset-x-0 top-2/4 border-b border-orange-500/40 border-dashed" />
              <div className="absolute inset-x-0 top-3/4 border-b border-orange-500/40 border-dashed" />
              <div className="absolute inset-y-0 left-1/4 border-r border-orange-500/40 border-dashed" />
              <div className="absolute inset-y-0 left-2/4 border-r border-orange-500/40 border-dashed" />
              <div className="absolute inset-y-0 left-3/4 border-r border-orange-500/40 border-dashed" />
            </div>

            {/* Ambient Conic Radar Scan */}
            <div
              className="absolute w-[360px] h-[360px] -top-10 rounded-full pointer-events-none opacity-25"
              style={{
                transform: `rotate(${radarAngle}deg)`,
                background:
                  'conic-gradient(from 0deg, rgba(249,115,22,0.6) 0deg, rgba(249,115,22,0.08) 60deg, transparent 120deg)',
              }}
            />

            {/* Glowing Flight Trajectory Curve */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 340 280"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                  <stop offset="60%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Parabolic flight path */}
              <path
                d="M 30 230 Q 140 210 300 70"
                fill="none"
                stroke="url(#flightGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                filter="url(#glow)"
              />
            </svg>

            {/* Animated Modern Airplane Craft (SVG Vector) */}
            <div className="relative z-10 w-full flex justify-center items-center h-28 mt-2">
              <div
                className={`relative transition-all duration-500 transform ${
                  isCalculating ? 'scale-110 -translate-y-2 translate-x-2' : 'scale-100'
                }`}
              >
                {/* Propulsion Jet Flare */}
                <div className="absolute -left-6 top-6 w-10 h-3 bg-gradient-to-l from-orange-400 via-amber-300 to-transparent rounded-full blur-[2px] animate-pulse" />

                {/* Sleek Supersonic Airplane Vector */}
                <svg
                  className="w-24 h-24 text-amber-400 drop-shadow-[0_0_18px_rgba(245,158,11,0.8)] transform -rotate-[18deg]"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Fuselage */}
                  <path
                    d="M85 50 L25 28 L35 46 L10 48 L15 50 L10 52 L35 54 L25 72 Z"
                    fill="url(#planeBodyGrad)"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                  />
                  {/* Cockpit Canopy */}
                  <polygon points="60,47 75,50 60,53 50,50" fill="#38bdf8" opacity="0.9" />
                  {/* Wing Trim */}
                  <line x1="35" y1="46" x2="25" y2="28" stroke="#fb923c" strokeWidth="2" />
                  <line x1="35" y1="54" x2="25" y2="72" stroke="#fb923c" strokeWidth="2" />

                  <defs>
                    <linearGradient id="planeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Live Multiplier Display */}
            <div className="relative z-10 text-center w-full flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#fff6b0] via-[#fbbf24] to-[#f97316] drop-shadow-[0_4px_16px_rgba(249,115,22,0.6)]">
                {isCalculating ? (
                  `${currentLiveOdds.toFixed(2)}X`
                ) : signal ? (
                  signal.multiplierDisplay
                ) : (
                  '---'
                )}
              </div>
              <span className="text-[11px] font-bold text-orange-300/80 uppercase tracking-widest mt-0.5">
                {isCalculating ? 'Calcul de trajectoire...' : signal ? 'Point d\'encaissement cible' : 'En attente de signal'}
              </span>
            </div>
          </div>

          {/* Yellow/Gold "Temps : HH:MM" Box (Direct & Modernized) */}
          <div className="w-full max-w-[340px]">
            <div className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d6a500] via-[#ffcc00] to-[#d6a500] text-black font-black text-lg shadow-[0_6px_18px_rgba(214,165,0,0.35)] border border-yellow-200/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-black stroke-[2.5]" />
                <span className="tracking-wide">
                  Temps : {signal ? signal.predictedTime : isCalculating ? 'Calcul...' : '--:--'}
                </span>
              </div>
              {signal && (
                <div className="bg-black text-amber-300 text-xs font-mono font-black px-2.5 py-1 rounded-lg border border-black/20">
                  {signal.reliabilityPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Prediction Time Window & Analysis Insights Card */}
          {signal && (
            <div className="w-full max-w-[340px] bg-[#1a0e08] border border-[#3b1f12] rounded-2xl p-3.5 text-xs space-y-2 shadow-md animate-scale-in">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Fenêtre de vol optimale :</span>
                <span className="font-mono font-bold text-amber-300 bg-[#27150d] px-2 py-0.5 rounded border border-amber-500/20">
                  {signal.timeWindow}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Fiabilité algorithmique :</span>
                <span className="font-mono font-bold text-emerald-400">
                  {signal.reliabilityPercent}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1.5 border-t border-[#2e170e] leading-relaxed">
                {signal.analysisComment}
              </div>
            </div>
          )}

          {/* Action / Cooldown Button (Exact Cooldown 1-2 min) */}
          <div className="w-full max-w-[340px] pt-1">
            {cooldownRemaining > 0 ? (
              <button
                id="btn-crash-cooldown-active"
                disabled
                className="w-full py-4 rounded-2xl bg-[#2b1f1b] text-[#9c8e88] font-bold text-base tracking-wide border border-[#3f2e28] flex items-center justify-center gap-2 shadow-inner cursor-not-allowed"
              >
                <Clock className="w-5 h-5 text-orange-400 animate-spin" />
                <span className="font-mono font-bold text-slate-200 text-base">
                  Nouveau signal : {formatCooldown(cooldownRemaining)}
                </span>
              </button>
            ) : (
              <button
                id="btn-crash-get-signal"
                onClick={handleGetSignal}
                disabled={isCalculating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:brightness-110 active:scale-98 text-white font-black text-base uppercase tracking-wider shadow-[0_6px_22px_rgba(234,88,12,0.45)] transition-all flex items-center justify-center gap-2 border border-orange-300/40 cursor-pointer"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>CALCUL DE LA TRAJECTOIRE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>Nouveau signal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Retour Button */}
        <div className="w-full max-w-[340px] mx-auto pt-2">
          <button
            id="btn-crash-back-footer"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="w-full py-3.5 rounded-xl bg-[#170c07] hover:bg-[#20110a] text-slate-300 hover:text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-[#31170d] active:scale-98 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
