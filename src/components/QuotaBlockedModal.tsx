import React, { useState } from 'react';
import { Lock, Copy, Check, ExternalLink, Sparkles, X, Gift, KeyRound, Crown, Send, AlertTriangle, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/audio';
import { VipGuideModal } from './VipGuideModal';

interface QuotaBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPromo?: () => void;
  onOpenSecretSas?: () => void;
}

export const QuotaBlockedModal: React.FC<QuotaBlockedModalProps> = ({
  isOpen,
  onClose,
  onGoToPromo,
  onOpenSecretSas,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText('PAGA26');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showFullGuide) {
    return (
      <VipGuideModal
        isOpen={true}
        onClose={() => {
          setShowFullGuide(false);
          onClose();
        }}
        onOpenSecretSas={() => {
          setShowFullGuide(false);
          onClose();
          if (onOpenSecretSas) onOpenSecretSas();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-b from-[#18132b] via-[#100d1f] to-[#0a0714] border border-amber-500/40 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative text-center text-white my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock / VIP Icon */}
        <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Crown className="w-7 h-7 text-black stroke-[2.5]" />
        </div>

        <h3 className="text-lg font-black tracking-tight text-white mb-1 uppercase">
          Quota Gratuit Atteint (3/3)
        </h3>

        <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[11.5px] text-slate-200 leading-snug mb-3 text-left">
          <p>
            L'application est <strong className="text-emerald-400 uppercase">totalement gratuite</strong> !
            Inscrivez-vous sur <strong>Megapari</strong> avec le code promo{' '}
            <strong className="text-amber-300 font-mono">PAGA26</strong>, faites un dépôt de{' '}
            <strong className="text-amber-300">3 000 FCFA</strong> et contactez{' '}
            <strong className="text-cyan-300">@davecapitale</strong> pour recevoir votre code secret VIP illimité !
          </p>
        </div>

        {/* Promo Code Box */}
        <div className="bg-[#23173d] border border-purple-500/40 rounded-2xl p-2.5 mb-3 flex items-center justify-between">
          <div className="text-left pl-1">
            <span className="text-[9.5px] text-purple-300 font-bold uppercase block tracking-wider">
              Code Promo Officiel
            </span>
            <span className="text-base font-black text-amber-300 font-mono tracking-wider">
              PAGA26
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Quick Step Cards */}
        <div className="space-y-1.5 text-left text-[11px] mb-3">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
            <span className="text-slate-300">Inscrivez-vous sur <strong>Megapari</strong> (dépôt min. 3 000 F)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-cyan-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
            <span className="text-slate-300">Contactez <strong className="text-cyan-300">@davecapitale</strong> pour le code secret</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-amber-600 text-black font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
            <span className="text-slate-300">Tapotez <strong>3 fois le logo DAVE CAPITAL</strong></span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
            <span className="text-slate-300">Entrez le code secret & profitez en illimité</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              sounds.playClick();
              setShowFullGuide(true);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
          >
            <span>Voir le Guide Détaillé en Images</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <a
            href="https://paga26.megapari-737270.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>S'inscrire sur MEGAPARI</span>
          </a>

          <a
            href="https://t.me/davecapitale"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="w-full py-2 px-3 rounded-xl bg-[#142238] hover:bg-[#1a2d4a] border border-cyan-500/40 text-cyan-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contacter Admin @davecapitale</span>
          </a>

          {onOpenSecretSas && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                onOpenSecretSas();
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>J'ai déjà mon code secret</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
