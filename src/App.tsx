import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GameCatalog } from './components/GameCatalog';
import { PromoView } from './components/PromoView';
import { BottomNav } from './components/BottomNav';
import { SecretVipModal } from './components/SecretVipModal';
import { QuotaBlockedModal } from './components/QuotaBlockedModal';
import { VipGuideModal } from './components/VipGuideModal';
import { AppleOfFortunePredictor } from './components/AppleOfFortunePredictor';
import { SwampLandPredictor } from './components/SwampLandPredictor';
import { AviatorPredictor } from './components/AviatorPredictor';
import { LuckyJetPredictor } from './components/LuckyJetPredictor';
import { MinesPredictor } from './components/MinesPredictor';
import { MinesClassicPredictor } from './components/MinesClassicPredictor';
import { ThimblesPredictor } from './components/ThimblesPredictor';
import { CrashPredictor } from './components/CrashPredictor';
import { RocketQueenPredictor } from './components/RocketQueenPredictor';
import { GenericGamePredictor } from './components/GenericGamePredictor';
import { MathPanelModal } from './components/MathPanelModal';
import { MenuDrawer } from './components/MenuDrawer';

import { GameItem, MathModelType } from './types';
import { INITIAL_GAMES, preloadAllAssets } from './services/gameService';

export default function App() {
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [activeTab, setActiveTab] = useState<'games' | 'promo'>('games');
  const [selectedModel, setSelectedModel] = useState<MathModelType>('pattern_v4');
  const [isMathPanelOpen, setIsMathPanelOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSecretVipOpen, setIsSecretVipOpen] = useState<boolean>(false);
  const [isQuotaBlockedOpen, setIsQuotaBlockedOpen] = useState<boolean>(false);
  const [isVipGuideOpen, setIsVipGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    preloadAllAssets();
  }, []);

  const handleToggleFavorite = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, isFavorite: !g.isFavorite } : g))
    );
  };

  const handleSelectGame = (game: GameItem) => {
    setActiveGame(game);
  };

  const handleTabChange = (tab: 'games' | 'promo') => {
    setActiveTab(tab);
    if (activeGame) {
      setActiveGame(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {!activeGame ? (
        <div className="flex-1 flex flex-col">
          {/* Header with Dave Capital Brand & 3-Click Backdoor */}
          <Header
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenSecretSas={() => setIsSecretVipOpen(true)}
          />

          {/* Main Views: Games Catalog vs Promo Offers */}
          <main className="flex-1 pb-20 animate-fade-in">
            {activeTab === 'games' ? (
              <GameCatalog
                games={games}
                onSelectGame={handleSelectGame}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <PromoView />
            )}
          </main>

          {/* Bottom Navigation (JEUX vs PROMO) */}
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      ) : (
        /* Game Predictor Views (Internal SAS) */
        <main className="animate-fade-in flex-1 pb-16">
          {activeGame.id === 'rocket_queen' ? (
            <RocketQueenPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'crash' ? (
            <CrashPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'mines' ? (
            <MinesPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'mines_classic' ? (
            <MinesClassicPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'thimbles' ? (
            <ThimblesPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'aviator' ? (
            <AviatorPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'lucky_jet' ? (
            <LuckyJetPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'apple_of_fortune' ? (
            <AppleOfFortunePredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : activeGame.id === 'swamp_land' ? (
            <SwampLandPredictor
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          ) : (
            <GenericGamePredictor
              game={activeGame}
              onBack={() => setActiveGame(null)}
              selectedModel={selectedModel}
              onOpenMathPanel={() => setIsMathPanelOpen(true)}
              onQuotaBlocked={() => setIsQuotaBlockedOpen(true)}
            />
          )}
        </main>
      )}

      {/* Math Panel Modal (Opened from inside Game SAS) */}
      <MathPanelModal
        isOpen={isMathPanelOpen}
        onClose={() => setIsMathPanelOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenVipGuide={() => setIsVipGuideOpen(true)}
        onOpenSecretSas={() => setIsSecretVipOpen(true)}
      />

      {/* Full VIP Guide Modal */}
      <VipGuideModal
        isOpen={isVipGuideOpen}
        onClose={() => setIsVipGuideOpen(false)}
        onOpenSecretSas={() => {
          setIsVipGuideOpen(false);
          setIsSecretVipOpen(true);
        }}
      />

      {/* Secret VIP SAS Modal (Code 1948 = Unlimited, Code 1844 = Reset Normal) */}
      <SecretVipModal
        isOpen={isSecretVipOpen}
        onClose={() => setIsSecretVipOpen(false)}
      />

      {/* Quota Blocked Modal (After 3 analyses: Megapari Code PAGA26 + 3000 XOF deposit requirement) */}
      <QuotaBlockedModal
        isOpen={isQuotaBlockedOpen}
        onClose={() => setIsQuotaBlockedOpen(false)}
        onOpenSecretSas={() => {
          setIsQuotaBlockedOpen(false);
          setIsSecretVipOpen(true);
        }}
      />
    </div>
  );
}
