import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Download,
  Send,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { MEGAPARI_BANNER, ONEWIN_BANNER } from '../services/promoAssets';

export const PromoView: React.FC = () => {
  const [activePromo, setActivePromo] = useState<'megapari' | '1win'>('megapari');
  const [copied, setCopied] = useState<boolean>(false);

  const promoCode = 'PAGA26';

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const megapariRegisterUrl = 'https://paga26.megapari-737270.com';
  const megapariApkUrl = 'https://refpazitag.top/L?tag=d_5876218m_54987c_&site=5876218&ad=54987';
  const onewinRegisterUrl = 'https://1wrrzr.com/?p=mm2g';
  const telegramChannelUrl = 'https://t.me/davecapital07';
  const telegramAdminUrl = 'https://t.me/davecapitale';

  const currentBanner = activePromo === 'megapari' ? MEGAPARI_BANNER : ONEWIN_BANNER;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070a13] text-white flex flex-col font-sans pb-28 px-3.5 pt-2 space-y-3 animate-fade-in">
      {/* 1. Header Promo Switcher Tabs: MEGAPARI FIRST */}
      <div className="bg-[#0e1422] p-1 rounded-xl flex items-center border border-slate-800/80 shadow-md">
        <button
          onClick={() => {
            sounds.playClick();
            setActivePromo('megapari');
          }}
          className={`flex-1 py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activePromo === 'megapari'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs">💎</span>
          <span>MEGAPARI</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActivePromo('1win');
          }}
          className={`flex-1 py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activePromo === '1win'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xs">🎯</span>
          <span>1WIN</span>
        </button>
      </div>

      {/* 2. Official Promo Poster Banner (Embedded Base64 Data URL) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-xl bg-[#0a0e1a]">
        <img
          src={currentBanner}
          alt={activePromo === 'megapari' ? 'MEGAPARI PROMO PAGA26' : '1WIN PROMO PAGA26'}
          className="w-full h-auto object-contain max-h-[360px] mx-auto block transition-all duration-300"
          loading="eager"
        />
      </div>

      {/* 3. Offre Exclusive Highlight Box */}
      <div className="rounded-xl bg-[#0e1424] border border-blue-900/30 p-3 shadow-md flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-base shrink-0 shadow-sm">
          🎁
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
            OFFRE EXCLUSIVE DAVE ARENA
          </span>
          <span className="font-extrabold text-xs text-white">
            {activePromo === 'megapari'
              ? '200% bonus · jusqu’à 161 000 XOF'
              : '+500% bonus sur vos 1ers dépôts'}
          </span>
        </div>
      </div>

      {/* 4. Code Promo Obligatoire Card with 1-Click Copy */}
      <div className="rounded-xl bg-gradient-to-b from-[#101628] to-[#0a0f1c] border border-indigo-500/30 p-3 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>CODE PROMO OFFICIEL</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">100% Validé</span>
        </div>

        <div className="flex items-center justify-between bg-[#151d33] border border-indigo-500/40 rounded-xl p-2.5">
          <span className="font-mono text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 pl-2">
            {promoCode}
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-950/40 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>COPIÉ !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPIER</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Money Icons */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-0.5">
          <div className="flex items-center gap-1">
            <span>📱</span>
            <span>Wave, MTN, Orange, Moov</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💳</span>
            <span>Dépôt min : <strong className="text-emerald-300 font-bold">3 000 XOF</strong></span>
          </div>
        </div>
      </div>

      {/* 5. Étapes d'inscription Compact */}
      <div className="rounded-xl bg-[#0c1220] border border-slate-800/80 p-3 space-y-2">
        <div className="flex items-center gap-1 text-[11px] font-black text-slate-200 uppercase tracking-wide">
          <span>📋</span>
          <span>ÉTAPES D’INSCRIPTION</span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <p className="text-[11px]">
              Copiez le code promo <strong className="text-amber-300 font-mono">PAGA26</strong>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <p className="text-[11px]">
              Cliquez sur <strong className="text-white">S’inscrire sur {activePromo === 'megapari' ? 'MEGAPARI' : '1WIN'}</strong>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <p className="text-[11px]">
              Collez <strong className="text-amber-300 font-mono">PAGA26</strong> dans la case code promo
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <p className="text-[11px]">
              Dépôt min. <strong className="text-emerald-300 font-bold">3 000 XOF</strong> pour activer vos bonus & sas
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1.5">
          <a
            href={activePromo === 'megapari' ? megapariRegisterUrl : onewinRegisterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className={`w-full py-2.5 px-3 rounded-lg font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all ${
              activePromo === 'megapari'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-950/40'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/40'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>S’inscrire sur {activePromo === 'megapari' ? 'MEGAPARI' : '1WIN'}</span>
          </a>

          {activePromo === 'megapari' && (
            <a
              href={megapariApkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="w-full py-2 px-3 rounded-lg bg-[#13192c] hover:bg-[#182038] border border-blue-600/30 text-blue-200 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Télécharger APK MEGAPARI</span>
            </a>
          )}
        </div>
      </div>

      {/* 6. Dave Telegram Channel & Admin Contact Card */}
      <div className="rounded-xl bg-gradient-to-b from-[#0b1626] to-[#060e1a] border border-cyan-500/30 p-3 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-white">
            <span>📲</span>
            <span>Canal Telegram & Support DAVE</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-medium">@davecapitale</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="py-2 px-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-cyan-950/30 active:scale-98 transition-all"
          >
            <Send className="w-3 h-3" />
            <span>Canal Officiel →</span>
          </a>

          <a
            href={telegramAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="py-2 px-2.5 rounded-lg bg-[#142238] hover:bg-[#1a2d4a] border border-cyan-500/40 text-cyan-200 font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-98 transition-all"
          >
            <span>💬</span>
            <span>Admin @davecapitale</span>
          </a>
        </div>
      </div>
    </div>
  );
};
