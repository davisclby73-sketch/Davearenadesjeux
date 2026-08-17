import React from 'react';
import { Heart, Lock } from 'lucide-react';
import { GameItem } from '../types';
import { sounds } from '../utils/audio';

interface GameCardProps {
  game: GameItem;
  onSelectGame: (game: GameItem) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelectGame,
  onToggleFavorite,
}) => {
  const isAvailableGame = game.isAvailable !== false;

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onSelectGame(game);
      }}
      className={`group relative rounded-2xl bg-[#131927] border border-slate-800/90 overflow-hidden shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-950/40 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
        !isAvailableGame ? 'opacity-70' : ''
      }`}
    >
      {/* Cover Image Wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={game.coverImage}
          alt={game.name}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131927] via-transparent to-black/20" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 border border-white/10 ${
            game.isFavorite ? 'text-rose-500' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${game.isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Lock overlay for coming soon games */}
        {!isAvailableGame && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] font-bold text-slate-300 flex items-center gap-1 border border-slate-700">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>VIP</span>
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-extrabold text-sm text-white tracking-wide truncate group-hover:text-indigo-300 transition-colors">
          {game.name}
        </h3>

        {/* Provider Pill Button */}
        <div>
          <span
            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border shadow-sm ${
              game.badgeType === '1win'
                ? 'bg-[#1a233a] text-slate-300 border-slate-700/80'
                : 'bg-[#1e1c2e] text-purple-300 border-purple-800/50'
            }`}
          >
            {game.badgeTag || game.provider}
          </span>
        </div>
      </div>
    </div>
  );
};
