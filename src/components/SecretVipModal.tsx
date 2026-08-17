import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, CheckCircle2, AlertCircle, RefreshCw, Crown } from 'lucide-react';
import { quotaManager } from '../utils/quotaManager';
import { sounds } from '../utils/audio';

interface SecretVipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SecretVipModal: React.FC<SecretVipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'vip' | 'reset'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = quotaManager.verifyAndApplyCode(pin);

    if (result === 'vip_unlocked') {
      sounds.playAppleReveal();
      setStatusMessage({
        type: 'vip',
        text: 'Accès VIP Illimité Débloqué !',
      });
      setError(false);
      setTimeout(() => {
        setStatusMessage(null);
        setPin('');
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } else if (result === 'normal_reset') {
      sounds.playClick();
      setStatusMessage({
        type: 'reset',
        text: 'Mode Normal Rétabli (3 signaux gratuits)',
      });
      setError(false);
      setTimeout(() => {
        setStatusMessage(null);
        setPin('');
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } else {
      sounds.playWarning();
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e1422] border border-amber-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <KeyRound className="w-7 h-7 text-black stroke-[2.5]" />
        </div>

        <h3 className="text-lg font-black tracking-tight text-white mb-1 uppercase">
          SAS Secret Dave Capital
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Entrez votre code secret à 4 chiffres pour configurer l'accès.
        </p>

        {statusMessage ? (
          <div
            className={`p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm border ${
              statusMessage.type === 'vip'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
            }`}
          >
            {statusMessage.type === 'vip' ? (
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
            ) : (
              <RefreshCw className="w-5 h-5 text-indigo-400 shrink-0 animate-spin" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setError(false);
                }}
                placeholder="••••"
                className="w-full text-center tracking-[1em] text-2xl font-mono py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Code secret incorrect</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black tracking-wider uppercase text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Déverrouiller
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
