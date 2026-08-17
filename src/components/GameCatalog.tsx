import React, { useState } from 'react';
import { Search, Heart, Sparkles, Trophy, Zap, Play } from 'lucide-react';
import { GameCategory, GameItem } from '../types';
import { sounds } from '../utils/audio';

interface GameCatalogProps {
  games: GameItem[];
  onSelectGame: (game: GameItem) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameCatalog: React.FC<GameCatalogProps> = ({
  games,
  onSelectGame,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.badgeTag && game.badgeTag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'wingame') return game.category === 'wingame';
    if (selectedCategory === 'autres') return game.category === 'autres';
    if (selectedCategory === 'favorites') return !!game.isFavorite;
    return true;
  });

  const winGameCount = games.filter((g) => g.category === 'wingame').length;
  const autresCount = games.filter((g) => g.category === 'autres').length;
  const favCount = games.filter((g) => g.isFavorite).length;

  const getBadgeStyle = (tag?: string) => {
    if (!tag) return 'bg-slate-800/90 text-slate-300 border-slate-700/60';
    if (tag.includes('MEGA') && tag.includes('1WIN')) {
      return 'bg-purple-950/80 text-purple-200 border-purple-700/60 group-hover:border-purple-500';
    }
    if (tag.includes('MEGA') || tag.includes('1X')) {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 group-hover:border-emerald-500';
    }
    if (tag.includes('1WIN')) {
      return 'bg-blue-950/80 text-blue-300 border-blue-700/60 group-hover:border-blue-500';
    }
    return 'bg-slate-800/90 text-slate-300 border-slate-700/60';
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-5 text-white">
      {/* Title "Nos Jeux" */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-white inline-block relative">
          Nos Jeux
          <span className="block h-1 w-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mx-auto mt-1 shadow-sm shadow-indigo-500/50"></span>
        </h2>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un jeu..."
          className="w-full pl-10 pr-4 py-3 bg-[#131a29]/90 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
        />
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs font-medium">
        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('all');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold ring-2 ring-indigo-400/30'
              : 'bg-[#131a29] text-slate-300 border border-slate-800 hover:border-slate-700'
          }`}
        >
          Tout
          <span className="ml-1 text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
            {games.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('wingame');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm cursor-pointer ${
            selectedCategory === 'wingame'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold ring-2 ring-indigo-400/30'
              : 'bg-[#131a29] text-slate-300 border border-slate-800 hover:border-slate-700'
          }`}
        >
          Win Game
          <span className="ml-1 text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
            {winGameCount}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('autres');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm cursor-pointer ${
            selectedCategory === 'autres'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold ring-2 ring-indigo-400/30'
              : 'bg-[#131a29] text-slate-300 border border-slate-800 hover:border-slate-700'
          }`}
        >
          Autres bet
          <span className="ml-1 text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
            {autresCount}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('favorites');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm cursor-pointer ${
            selectedCategory === 'favorites'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold ring-2 ring-indigo-400/30'
              : 'bg-[#131a29] text-slate-300 border border-slate-800 hover:border-slate-700'
          }`}
        >
          Favoris
          <span className="ml-1 text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
            {favCount}
          </span>
        </button>
      </div>

      {/* 3x3 Grid Layout of Games */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              sounds.playClick();
              onSelectGame(game);
            }}
            className="group relative bg-[#131a27] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between transform hover:-translate-y-1 active:scale-[0.98]"
          >
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={game.coverImage}
                alt={game.name}
                loading="eager"
                decoding="sync"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131a27] via-transparent to-black/20 pointer-events-none" />

              {/* Heart Favorite Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onToggleFavorite(game.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-black/70 transition-all border border-white/10 cursor-pointer z-10"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    game.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                  }`}
                />
              </button>

              {/* Play Overlay Hover effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-950/40 backdrop-blur-[2px]">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Card Content Footer */}
            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {game.name}
                </h3>
              </div>

              {/* Compact, Beautiful Badge Tag */}
              <div className="mt-2">
                <span
                  className={`inline-block w-full text-center py-1 px-1.5 text-[9.5px] font-extrabold uppercase tracking-wider rounded-lg border transition-all truncate shadow-sm ${getBadgeStyle(
                    game.badgeTag
                  )}`}
                >
                  {game.badgeTag || game.provider}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 bg-[#131a29]/60 rounded-2xl border border-dashed border-slate-800">
          <p className="text-slate-400 text-sm">Aucun jeu ne correspond à votre sélection.</p>
        </div>
      )}
    </div>
  );
};
