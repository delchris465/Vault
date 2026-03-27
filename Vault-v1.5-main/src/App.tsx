import { useState, useMemo, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { StorePage, QuestsPage, AchievementsPage, ProfilePage, RoadmapPage, DailyRewardsPage, SettingsPage } from './components/FeaturePages';
import { SocialPage } from './components/SocialPage';
import { PrivacyPolicyPage, TermsOfServicePage, AboutPage } from './components/LegalPages';
import { StreakPopup } from './components/StreakPopup';
import { AuthModal } from './components/AuthModal';
import { useGameContext } from './context/GameContext';
import { useLanguage } from './context/LanguageContext';
import { games, Game } from './data/games';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { state, playGame } = useGameContext();
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'games' | 'store' | 'quests' | 'achievements' | 'profile' | 'roadmap' | 'daily-rewards' | 'settings' | 'social' | 'privacy' | 'terms' | 'about'>('games');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [currentView, selectedCategory]);

  useEffect(() => {
    if (currentView === 'profile' && state.authMode === 'none') {
      setCurrentView('games');
    }
  }, [currentView, state.authMode]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#111] text-white font-sans selection:bg-violet-500/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden flex`}>
        <Sidebar 
          currentView={currentView}
          onSelectView={(view) => {
            setCurrentView(view as any);
            setIsMobileMenuOpen(false);
          }}
          selectedCategory={selectedCategory} 
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setIsMobileMenuOpen(false);
          }}
          onGoHome={() => {
            setCurrentView('games');
            setSelectedCategory('');
            setIsMobileMenuOpen(false);
          }}
          onOpenAuthModal={() => {
            setIsAuthModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
        />
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view as any)}
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory}
          onGoHome={() => {
            setCurrentView('games');
            setSelectedCategory('');
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentView !== 'games') setCurrentView('games');
          }}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onOpenStore={() => setCurrentView('store')}
          onOpenQuests={() => setCurrentView('quests')}
          onOpenAchievements={() => setCurrentView('achievements')}
          onOpenProfile={() => setCurrentView('profile')}
          onOpenRoadmap={() => setCurrentView('roadmap')}
          onOpenDailyRewards={() => setCurrentView('daily-rewards')}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        
        <div id="main-scroll-container" className="flex-1 p-6 md:p-10 overflow-y-auto">
          {currentView === 'games' && (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-bold tracking-tight text-white mb-2">
                  {selectedCategory ? t(`cat.${selectedCategory.toLowerCase().replace(' ', '')}`) : t('games.all')}
                </h2>
                <p className="text-gray-400 text-lg">
                  {filteredGames.length} {t('games.available')}
                </p>
              </div>

              {filteredGames.length > 0 ? (
                <>
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 mb-16"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredGames.map((game) => (
                        <GameCard 
                          key={game.id} 
                          game={game} 
                          onClick={(g) => setSelectedGame(g)} 
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="bg-white/5 p-6 rounded-full mb-4">
                    <Menu className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('games.none')}</h3>
                  <p className="text-gray-400 max-w-md">
                    {t('games.none.desc').replace('{query}', searchQuery)}
                  </p>
                </motion.div>
              )}
            </>
          )}

          {currentView === 'store' && <StorePage />}
          {currentView === 'quests' && <QuestsPage />}
          {currentView === 'achievements' && <AchievementsPage />}
          {currentView === 'profile' && <ProfilePage />}
          {currentView === 'roadmap' && <RoadmapPage />}
          {currentView === 'daily-rewards' && <DailyRewardsPage />}
          {currentView === 'settings' && <SettingsPage />}
          {currentView === 'social' && <SocialPage />}
          {currentView === 'privacy' && <PrivacyPolicyPage />}
          {currentView === 'terms' && <TermsOfServicePage />}
          {currentView === 'about' && <AboutPage />}
        </div>
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GamePlayer 
            game={selectedGame} 
            onClose={() => setSelectedGame(null)}
            onPlay={() => playGame(selectedGame.category)}
          />
        )}
      </AnimatePresence>

      {/* Streak Popup */}
      <StreakPopup />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
