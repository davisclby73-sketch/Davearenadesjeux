import React from 'react';
import { X, CheckCircle, ShieldCheck, HelpCircle, Layers, Award, Crown, KeyRound, Sparkles, Send } from 'lucide-react';
import { sounds } from '../utils/audio';
import { quotaManager } from '../utils/quotaManager';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVipGuide?: () => void;
  onOpenSecretSas?: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenVipGuide,
  onOpenSecretSas,
}) => {
  if (!isOpen) return null;

  const isVip = quotaManager.isVip();
  const remaining = quotaManager.getRemainingAnalyses();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-[#0f1422] border-l border-slate-800 text-white h-full p-5 flex flex-col justify-between shadow-2xl overflow-y-auto no-scrollbar">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-black text-sm">
                D
              </div>
              <span className="font-extrabold text-base tracking-tight">DAVE CAPITAL</span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 rounded-2xl bg-[#151c2e] border border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-1">
                  <span>Membre Predictor</span>
                  {isVip && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/40">
                      VIP
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-semibold flex items-center gap-1 mt-0.5">
                  {isVip ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Signaux Illimités Activés
                    </span>
                  ) : (
                    <span className="text-indigo-300">
                      {remaining}/3 analyses restantes
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* VIP Access Guide Button */}
          {onOpenVipGuide && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                onOpenVipGuide();
              }}
              className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-left">Guide VIP Illimité Gratuit</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-black uppercase">
                Aide
              </span>
            </button>
          )}

          {/* Enter PIN Secret SAS Button */}
          {onOpenSecretSas && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                onOpenSecretSas();
              }}
              className="w-full mb-4 p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Entrer Code SAS Secret</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">PIN</span>
            </button>
          )}

          {/* General Platform Items */}
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Moteurs Dédiés Multi-Jeux</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chaque jeu dispose d'un algorithme mathématique indépendant et de son propre SAS.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Sécurité & Algorithme Certifié</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Synchronisation horaire et fenêtres de jeu fiables basées sur les cycles statistiques.
              </p>
            </div>
          </div>

          {/* Telegram Channel & Support Box */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#142035] border border-cyan-500/30 space-y-2">
            <div className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
              <span>Canal Officiel & Support</span>
              <span className="text-[10px] text-slate-400 font-mono">@davecapitale</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <a
                href="https://t.me/davecapital07"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] text-center shadow-md active:scale-95 transition-all"
              >
                Canal Telegram
              </a>
              <a
                href="https://t.me/davecapitale"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-500/30 font-bold text-[10px] text-center active:scale-95 transition-all"
              >
                Contact Admin
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 text-center font-mono">
            DAVE CAPITAL • Plateforme Officielle
          </div>
        </div>
      </div>
    </div>
  );
};
