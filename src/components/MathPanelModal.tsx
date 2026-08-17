import React from 'react';
import { X, Cpu, ShieldCheck, Check, Sparkles, Activity } from 'lucide-react';
import { MathModelType } from '../types';
import { MATH_MODELS } from '../services/predictionEngine';
import { sounds } from '../utils/audio';

interface MathPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: MathModelType;
  onSelectModel: (model: MathModelType) => void;
}

export const MathPanelModal: React.FC<MathPanelModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0d121f] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#111728] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Moteurs Mathématiques DAVE</h3>
              <p className="text-[11px] text-slate-400">Sélectionnez le modèle algorithmique avancé</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              Tous les modèles intègrent une vérification matricielle à haut taux d'exactitude (supérieure à <strong>+90%</strong>) avec gestion adaptative de la volatilité.
            </p>
          </div>

          <div className="space-y-2.5">
            {MATH_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectModel(model.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/50'
                      : 'bg-[#131929] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{model.name}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500 text-white uppercase tracking-wider">
                          ACTIF
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">{model.description}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Fiabilité: {model.accuracyPercent}%
                      </span>
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Risque: {model.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'border-slate-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0a0d16] border-t border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-indigo-900/50 transition-all active:scale-95"
          >
            CONFIRMER LE MODÈLE
          </button>
        </div>
      </div>
    </div>
  );
};
