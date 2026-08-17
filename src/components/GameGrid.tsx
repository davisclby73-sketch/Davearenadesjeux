import React, { useState } from 'react';
import { Search, Grid2x2, Grid3x3 } from 'lucide-react';
import { GameCategory, GameItem } from '../types';
import { GameCard } from './GameCard';
import { sounds } from '../utils/audio';

interface GameGridProps {
  games: GameItem[];
  onSelectGame: (game: GameItem) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  onSelectGame,
  onToggleFavorite,
}) => {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridColumns, setGridColumns] = useState<3 | 2>(3); // Default 3x3 as requested!

  // Category counts
  const totalCount = games.length;
  const winGameCount = games.filter((g) => g.category === 'wingame').length;
  const autresCount = games.filter((g) => g.category === 'autres').length;
  const favoritesCount = games.filter((g) => g.isFavorite).length;

  // Filter logic
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'wingame') return game.category === 'wingame';
    if (activeCategory === 'autres') return game.category === 'autres';
    if (activeCategory === 'favorites') return game.isFavorite;
    return true; // 'all'
  });

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-5">
      {/* Category Main Header Title */}
      <div className="text-center relative pt-2">
        <h2 className="text-2xl font-black tracking-tight text-white inline-block relative">
          Nos Jeux
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
        </h2>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un jeu..."
          className="w-full bg-[#111726]/90 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors shadow-inner"
        />
        <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Category Pills & Layout Toggle Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2">
          {/* TOUT Pill */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveCategory('all');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400/30'
                : 'bg-[#151c2d] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Tout</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeCategory === 'all' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* WIN GAME Pill */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveCategory('wingame');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
              activeCategory === 'wingame'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400/30'
                : 'bg-[#151c2d] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Win Game</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeCategory === 'wingame' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {winGameCount}
            </span>
          </button>

          {/* AUTRES BET Pill */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveCategory('autres');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
              activeCategory === 'autres'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400/30'
                : 'bg-[#151c2d] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Autres bet</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeCategory === 'autres' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autresCount}
            </span>
          </button>

          {/* FAVORIS Pill */}
          <button
            onClick={() => {
              sounds.playClick();
              setActiveCategory('favorites');
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
              activeCategory === 'favorites'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ring-2 ring-indigo-400/30'
                : 'bg-[#151c2d] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span>Favoris</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeCategory === 'favorites' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {favoritesCount}
            </span>
          </button>
        </div>

        {/* Column Layout Switcher (3x3 vs 2x2) */}
        <div className="flex items-center bg-[#151c2d] border border-slate-800 rounded-xl p-1 gap-1 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setGridColumns(3);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              gridColumns === 3 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Grille 3x3 (Recommandé)"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setGridColumns(2);
            }}
            className={`p-1.5 rounded-lg transition-all ${
              gridColumns === 2 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Grille 2x2"
          >
            <Grid2x2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Display (3 Columns 3x3 or 2 Columns) */}
      <div
        className={`grid gap-3.5 ${
          gridColumns === 3 ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onSelectGame={onSelectGame}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 text-slate-500 bg-[#121826] border border-slate-800 rounded-2xl p-6">
          <p className="font-semibold text-sm">Aucun jeu trouvé pour cette catégorie.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-indigo-400 underline font-bold"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </div>
  );
};
