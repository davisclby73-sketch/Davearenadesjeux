import React from 'react';
import { X, User, Award, ShieldAlert, BarChart3, Radio, HelpCircle, ExternalLink } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0e1320] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#121828] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              D
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Compte VIP Predictor</h3>
              <p className="text-xs text-emerald-400 font-semibold">● Session Cryptée Sécurisée</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 bg-[#141b2d] border border-slate-800 rounded-xl p-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Prédictions</div>
              <div className="text-sm font-extrabold text-white mt-0.5">1 482</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Taux Succès</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-0.5">96.4%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Série Max</div>
              <div className="text-sm font-extrabold text-amber-400 mt-0.5">14 W</div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Statistiques en Direct</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">LIVE</span>
            </div>

            <a
              href="https://t.me/davecapital07"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="p-3 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300 hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-rose-400" />
                <span>Signaux Télégram Officiels (@davecapital07)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <div className="p-3 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Guide Anti-Ban & Sécurité</span>
              </div>
              <Award className="w-4 h-4 text-amber-400" />
            </div>

            <a
              href="https://t.me/davecapitale"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="p-3 rounded-xl bg-[#141b2d] border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300 hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Support & Admin (@davecapitale)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* App Info Footer */}
          <div className="pt-2 text-center text-[10px] text-slate-500">
            DAVE PREDICT v4.2.0 • Architecture orientée services
          </div>
        </div>
      </div>
    </div>
  );
};
