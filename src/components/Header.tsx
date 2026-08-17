import React, { useRef, useState, useEffect } from 'react';
import { Menu, Volume2, VolumeX, ShieldCheck, Crown } from 'lucide-react';
import { sounds } from '../utils/audio';
import { quotaManager, FREE_QUOTA_LIMIT } from '../utils/quotaManager';
import daveCapitalLogo from '../assets/images/dave_capital_logo_1786726316213.jpg';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSecretSas: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, onOpenSecretSas }) => {
  const [muted, setMuted] = useState(sounds.getMuted());
  const [isVip, setIsVip] = useState(quotaManager.isVip());
  const [remaining, setRemaining] = useState(quotaManager.getRemainingAnalyses());

  const clickTimesRef = useRef<number[]>([]);

  useEffect(() => {
    const unsubscribe = quotaManager.subscribe(() => {
      setIsVip(quotaManager.isVip());
      setRemaining(quotaManager.getRemainingAnalyses());
    });
    return unsubscribe;
  }, []);

  const handleToggleSound = () => {
    const isM = sounds.toggleMute();
    setMuted(isM);
  };

  const handleLogoClick = () => {
    sounds.playClick();
    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter((t) => now - t < 1500);
    clickTimesRef.current.push(now);

    if (clickTimesRef.current.length >= 3) {
      clickTimesRef.current = [];
      onOpenSecretSas();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 text-white transition-all shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left Branding with Official Dave Capital Logo (Triple-click secret trigger) */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-left active:scale-98 transition-transform group cursor-pointer"
          title="Dave Capital"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 shadow-md bg-[#0a1128] shrink-0">
            <img
              src={daveCapitalLogo}
              alt="DAVE CAPITAL"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1">
                DAVE CAPITAL
              </h1>
              {isVip ? (
                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black tracking-wider border border-amber-500/40 flex items-center gap-0.5">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  VIP
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {remaining}/{FREE_QUOTA_LIMIT} gratuit
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Intelligence Prédictive Officielle
            </p>
          </div>
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Mute button */}
          <button
            onClick={handleToggleSound}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 transition-all active:scale-95 cursor-pointer"
            title="Activer/Désactiver le son"
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Profile / Menu Drawer Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMenu();
            }}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 transition-all active:scale-95 cursor-pointer"
            title="Menu Principal"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
