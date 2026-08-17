import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Gift,
  Zap,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface VipGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSecretSas?: () => void;
}

export const VipGuideModal: React.FC<VipGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSecretSas,
}) => {
  const [copiedMegapari, setCopiedMegapari] = useState(false);
  const [copied1win, setCopied1win] = useState(false);

  if (!isOpen) return null;

  const handleCopyMegapari = () => {
    sounds.playClick();
    navigator.clipboard.writeText('PAGA26');
    setCopiedMegapari(true);
    setTimeout(() => setCopiedMegapari(false), 2000);
  };

  const handleCopy1win = () => {
    sounds.playClick();
    navigator.clipboard.writeText('PAGA26');
    setCopied1win(true);
    setTimeout(() => setCopied1win(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-b from-[#131b2e] via-[#0d1322] to-[#070a14] border border-amber-500/40 rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl relative text-white my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Crown className="w-7 h-7 text-black stroke-[2.5]" />
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            Accès VIP Illimité Gratuit
          </h2>
          <p className="text-xs text-amber-300/90 font-semibold mt-1">
            Profitez de signaux 100% gratuits et illimités sans payer d'abonnement !
          </p>
        </div>

        {/* Main Banner Message */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-500/30 text-xs text-slate-200 leading-relaxed mb-4 text-center">
          <p className="font-medium">
            L'application <strong className="text-amber-300">DAVE CAPITAL</strong> est{' '}
            <strong className="text-emerald-400 uppercase font-black">totalement gratuite</strong> !
            Inscris-toi sur <strong>Megapari</strong>, fais un dépôt de{' '}
            <strong className="text-amber-300 font-bold">3 000 FCFA</strong> et contacte l'admin{' '}
            <span className="text-cyan-300 font-bold">@davecapitale</span> qui te donnera ton code secret
            pour avoir les <strong className="text-emerald-400">signaux illimités à vie</strong> — plus
            besoin de payer quoi que ce soit !
          </p>
        </div>

        {/* 4 Illustrated Steps */}
        <div className="space-y-2.5 mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 text-left flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Procédure en 4 Étapes Simples :</span>
          </h3>

          {/* Step 1 */}
          <div className="p-3 rounded-2xl bg-[#162035]/90 border border-slate-800 flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
              1
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white mb-0.5">Inscription & Recharge Megapari</h4>
              <p className="text-slate-300 text-[11px] leading-snug">
                Inscrivez-vous correctement sur <strong>MEGAPARI</strong> avec le code promo{' '}
                <span className="text-amber-300 font-black font-mono">PAGA26</span> et effectuez un
                premier dépôt minimum de <strong className="text-emerald-400">3 000 FCFA</strong>.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href="https://paga26.megapari-737270.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>S'inscrire sur Megapari</span>
                </a>
                <button
                  onClick={handleCopyMegapari}
                  className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold inline-flex items-center gap-1 border border-amber-500/30 active:scale-95 transition-all"
                >
                  {copiedMegapari ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMegapari ? 'Copié' : 'Code PAGA26'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-2xl bg-[#162035]/90 border border-slate-800 flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
              2
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white mb-0.5">Contactez l'Admin pour le Code</h4>
              <p className="text-slate-300 text-[11px] leading-snug">
                Une fois inscrit et votre compte rechargé, contactez l'admin sur Telegram{' '}
                <strong className="text-cyan-300 font-bold">@davecapitale</strong> en lui envoyant la
                capture d'écran de votre ID joueur et de votre dépôt pour recevoir le code secret.
              </p>
              <div className="mt-2">
                <a
                  href="https://t.me/davecapitale"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="py-1 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Contacter @davecapitale sur Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-2xl bg-[#162035]/90 border border-slate-800 flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-md">
              3
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white mb-0.5">Ouvrez le SAS Secret</h4>
              <p className="text-slate-300 text-[11px] leading-snug">
                Sur la page principale de l'application, <strong>tapotez 3 fois rapidement sur le logo DAVE CAPITAL</strong> (en haut à gauche) pour faire apparaître le clavier du SAS secret à 4 chiffres.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-2xl bg-[#162035]/90 border border-slate-800 flex items-start gap-3 text-left">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
              4
            </div>
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white mb-0.5">Entrez le Code Secret & Profitez</h4>
              <p className="text-slate-300 text-[11px] leading-snug">
                Saisissez le code secret à 4 chiffres fourni par l'admin. Le mode <strong className="text-amber-300">VIP ILLIMITÉ</strong> s'active instantanément pour tous les jeux !
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Notes (1WIN & Direct Buy) */}
        <div className="p-3 rounded-2xl bg-[#1a1426] border border-fuchsia-900/40 text-left space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Remarques importantes & Alternatives</span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
            <p>
              • <strong>Alternative 1WIN :</strong> Si vous ne souhaitez pas ou n'arrivez pas à vous inscrire sur Megapari (qui reste essentielle pour bien gagner), inscrivez-vous ou rechargez votre compte sur <strong>1WIN</strong> avec le code promo <strong className="text-amber-300 font-mono">PAGA26</strong> avec un dépôt obligatoire d'au moins <strong className="text-amber-300">5 000 XOF</strong> avant de contacter l'admin.
            </p>
            <p>
              • <strong>Achat Direct du Bot à Vie :</strong> Si vous ne souhaitez effectuer aucune inscription bookmaker, vous pouvez acheter le bot directement au prix fixe de <strong className="text-emerald-400 font-bold">10 000 FCFA</strong> auprès de l'admin <span className="text-cyan-300 font-bold">@davecapitale</span>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2">
          {onOpenSecretSas && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
                onOpenSecretSas();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-black" />
              <span>Ouvrir le SAS Secret (Entrer Code)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
