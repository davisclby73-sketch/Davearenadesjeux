import React from 'react';
import { Gamepad2, Tag } from 'lucide-react';
import { sounds } from '../utils/audio';

export type MainTabType = 'games' | 'promo';

interface BottomNavProps {
  activeTab: MainTabType;
  onTabChange?: (tab: MainTabType) => void;
  onChangeTab?: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onChangeTab }) => {
  const handleSelect = (tab: MainTabType) => {
    sounds.playClick();
    if (onTabChange) onTabChange(tab);
    if (onChangeTab) onChangeTab(tab);
  };

  return (
    <div className="fixed bottom-2.5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center gap-3 bg-[#080d19]/90 backdrop-blur-xl border border-slate-700/60 rounded-full px-3 py-1 shadow-[0_6px_25px_rgba(0,0,0,0.8)]">
        {/* Button 1: JEUX (Ultra compact round button) */}
        <button
          onClick={() => handleSelect('games')}
          className="flex flex-col items-center justify-center gap-0.5 group cursor-pointer active:scale-90 transition-transform"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'games'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/50 ring-2 ring-indigo-400/40'
                : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700/80'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
          </div>
          <span
            className={`text-[9px] tracking-tight font-bold transition-colors ${
              activeTab === 'games' ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            Jeux
          </span>
        </button>

        {/* Subtle Separator */}
        <div className="w-[1px] h-5 bg-slate-800" />

        {/* Button 2: PROMO (Ultra compact round button with micro badge) */}
        <button
          onClick={() => handleSelect('promo')}
          className="flex flex-col items-center justify-center gap-0.5 relative group cursor-pointer active:scale-90 transition-transform"
        >
          {/* Badge PAGA26 */}
          <span className="absolute -top-1.5 -right-2 px-1 py-0.1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[7.5px] tracking-tighter shadow-md z-10 leading-none">
            PAGA26
          </span>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'promo'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/50 ring-2 ring-amber-400/40'
                : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700/80'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
          </div>
          <span
            className={`text-[9px] tracking-tight font-bold transition-colors ${
              activeTab === 'promo' ? 'text-amber-300' : 'text-slate-400'
            }`}
          >
            Promo
          </span>
        </button>
      </div>
    </div>
  );
};
