import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameContext } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { Store, Target, Trophy, CheckCircle2, Lock, Flame, Sparkles, Crown, Coins, Star, Zap, Shield, Medal, Gem, Puzzle, CalendarDays, PackageOpen, Palette, Edit2, Gift, Key, Download, Upload, Settings, Globe, LogOut } from 'lucide-react';

export const ACHIEVEMENTS_DATA = [
  { id: 'first-blood', title: 'First Blood', description: 'Play your first game', reward: 100, icon: Target },
  { id: 'gamer', title: 'Gamer', description: 'Play 10 games total', reward: 500, icon: Trophy },
  { id: 'addicted', title: 'Addicted', description: 'Play 50 games total', reward: 1000, icon: Flame },
  { id: 'master', title: 'Arcade Master', description: 'Play 100 games total', reward: 2500, icon: Crown },
  { id: 'grandmaster', title: 'Grandmaster', description: 'Play 500 games total', reward: 10000, icon: Star },
  { id: 'dedicated', title: 'Dedicated', description: 'Reach a 3-day streak', reward: 300, icon: Flame },
  { id: 'weekly-warrior', title: 'Weekly Warrior', description: 'Reach a 7-day streak', reward: 800, icon: Target },
  { id: 'fortnight-fanatic', title: 'Fortnight Fanatic', description: 'Reach a 14-day streak', reward: 1500, icon: Zap },
  { id: 'monthly-legend', title: 'Monthly Legend', description: 'Reach a 30-day streak', reward: 3000, icon: Crown },
  { id: 'quarterly-king', title: 'Quarterly King', description: 'Reach a 90-day streak', reward: 10000, icon: Gem },
  { id: 'sports-fan', title: 'Sports Fan', description: 'Play 5 Sports games', reward: 400, icon: Trophy },
  { id: 'sports-pro', title: 'Sports Pro', description: 'Play 15 Sports games', reward: 1200, icon: Trophy },
  { id: 'action-novice', title: 'Action Novice', description: 'Play 5 Action games', reward: 400, icon: Target },
  { id: 'action-expert', title: 'Action Expert', description: 'Play 25 Action games', reward: 1500, icon: Shield },
  { id: 'puzzle-novice', title: 'Puzzle Novice', description: 'Play 5 Puzzle games', reward: 400, icon: Puzzle },
  { id: 'puzzle-expert', title: 'Puzzle Expert', description: 'Play 25 Puzzle games', reward: 1500, icon: Medal },
  { id: 'clicker-novice', title: 'Clicker Novice', description: 'Play 3 Clicker games', reward: 300, icon: Target },
  { id: 'clicker-addict', title: 'Clicker Addict', description: 'Play 10 Clicker games', reward: 800, icon: Zap },
  { id: 'io-novice', title: 'IO Novice', description: 'Play 5 IO Games', reward: 400, icon: Target },
  { id: 'io-pro', title: 'IO Pro', description: 'Play 20 IO Games', reward: 1000, icon: Shield },
  { id: 'chefs-apprentice', title: "Chef's Apprentice", description: "Play 2 Papa's games", reward: 300, icon: Medal },
  { id: 'head-chef', title: 'Head Chef', description: "Play all 6 Papa's games", reward: 1200, icon: Crown },
  { id: 'classics-fan', title: 'Classics Fan', description: 'Play 3 Classics games', reward: 350, icon: Medal },
  { id: 'sandbox-explorer', title: 'Sandbox Explorer', description: 'Play a Sandbox game', reward: 200, icon: Star },
  { id: 'asmr-addict', title: 'ASMR Addict', description: 'Play 2 ASMR games', reward: 300, icon: Sparkles },
  { id: 'wealthy', title: 'Wealthy', description: 'Accumulate 1,000 coins', reward: 500, icon: Coins },
  { id: 'rich', title: 'High Roller', description: 'Accumulate 5,000 coins', reward: 2000, icon: Coins },
  { id: 'millionaire', title: 'Millionaire', description: 'Accumulate 10,000 coins', reward: 5000, icon: Gem },
  { id: 'collector', title: 'Collector', description: 'Buy 3 items from the store', reward: 600, icon: Store },
  { id: 'hoarder', title: 'Hoarder', description: 'Buy 10 items from the store', reward: 2000, icon: Store },
];

export const STORE_ITEMS = [
  { id: 'streak-freeze', name: 'Streak Freeze', description: 'Miss a day? Your streak will be saved automatically.', cost: 200, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', isConsumable: true },
  { id: 'neon-theme', name: 'Neon Glow Theme', description: 'Unlock a premium fuchsia neon glow for all game cards.', cost: 500, icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-500/30', isConsumable: false },
  { id: 'emerald-theme', name: 'Emerald Theme', description: 'Unlock a lush green theme for your profile.', cost: 500, icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', isConsumable: false },
  { id: 'ruby-theme', name: 'Ruby Theme', description: 'Unlock a deep red theme for your profile.', cost: 500, icon: Sparkles, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', isConsumable: false },
  { id: 'golden-crown', name: 'Golden Crown', description: 'Show off your wealth with a golden crown next to your streak.', cost: 1000, icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', isConsumable: false },
  { id: 'diamond-crown', name: 'Diamond Crown', description: 'The ultimate flex. A diamond crown for the elite.', cost: 5000, icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', isConsumable: false },
  { id: 'vip-badge', name: 'VIP Badge', description: 'Exclusive VIP status icon on your profile.', cost: 10000, icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', isConsumable: false },
  { id: 'glitch-fx', name: 'Glitch FX', description: 'Add a cyberpunk glitch effect to your avatar.', cost: 2500, icon: Zap, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', isConsumable: false },
];

export const LEVEL_REWARDS = [
  { level: 5, reward: 500, title: 'Novice Explorer', icon: Star },
  { level: 10, reward: 1500, title: 'Apprentice Gamer', icon: Medal },
  { level: 25, reward: 5000, title: 'Seasoned Veteran', icon: Shield },
  { level: 50, reward: 15000, title: 'Arcade Master', icon: Crown },
  { level: 75, reward: 30000, title: 'Grand Champion', icon: Gem },
  { level: 100, reward: 100000, title: 'Legendary Status', icon: Zap },
  { level: 200, reward: 250000, title: 'Mythic Entity', icon: Sparkles },
  { level: 300, reward: 500000, title: 'Divine Being', icon: Flame },
  { level: 400, reward: 1000000, title: 'Cosmic Overlord', icon: Crown },
  { level: 500, reward: 2500000, title: 'Universal Creator', icon: Target },
];

export function StorePage() {
  const { state, buyItem, openMysteryBox } = useGameContext();
  const { t } = useLanguage();
  const [mysteryResult, setMysteryResult] = useState<string | null>(null);

  const handleOpenBox = () => {
    const result = openMysteryBox();
    if (result) {
      setMysteryResult(result);
      setTimeout(() => setMysteryResult(null), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30">
          <Store className="w-8 h-8 text-fuchsia-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('store.title')}</h1>
          <p className="text-gray-400 mt-1 text-lg">{t('store.desc')}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <PackageOpen className="w-6 h-6 text-fuchsia-400" />
          {t('store.mystery')}
        </h2>
        <div className="bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/20 blur-3xl rounded-full" />
          
          <div className="w-32 h-32 shrink-0 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.3)] border border-white/20 relative z-10">
            <PackageOpen className="w-16 h-16 text-white" />
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">{t('store.snake')}</h3>
            <p className="text-fuchsia-200/70 text-lg mb-6 max-w-md">
              {t('store.snake.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleOpenBox}
                disabled={state.coins < 500}
                className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  state.coins >= 500 
                    ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Coins className="w-5 h-5" />
                {t('store.open').replace('{cost}', '500')}
              </button>
              
              <AnimatePresence>
                {mysteryResult && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-bold flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('store.unlocked').replace('{item}', mysteryResult.toUpperCase())}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 text-yellow-400" />
        {t('store.cosmetics')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isOwned = !item.isConsumable && state.inventory.includes(item.id);
          const canAfford = state.coins >= item.cost;

          return (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden rounded-3xl bg-[#1a1a1a] border ${item.border} p-6 flex flex-col`}
            >
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl ${item.bg} opacity-50`} />
              
              <div className="relative z-10 flex-1">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t(`store.item.${item.id}.name`)}</h3>
                <p className="text-gray-400 leading-relaxed">{t(`store.item.${item.id}.desc`)}</p>
              </div>

              <div className="relative z-10 mt-8">
                {isOwned ? (
                  <button disabled className="w-full py-4 rounded-xl font-bold bg-white/5 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 border border-white/5">
                    <CheckCircle2 className="w-5 h-5" /> {t('store.owned')}
                  </button>
                ) : (
                  <button
                    onClick={() => buyItem(item.id, item.cost, item.isConsumable)}
                    disabled={!canAfford}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      canAfford 
                        ? `bg-white text-black hover:scale-[1.02] shadow-xl shadow-white/10` 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <Coins className="w-5 h-5" />
                    {item.cost} {t('header.coins')}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function QuestsPage() {
  const { state, claimQuest } = useGameContext();
  const { t } = useLanguage();

  const dailyQuests = [
    { id: 'daily-play-3', title: 'Warmup', description: 'Play 3 games today', target: 3, progress: state.gamesPlayedToday, reward: 50 },
    { id: 'daily-play-10', title: 'Marathon', description: 'Play 10 games today', target: 10, progress: state.gamesPlayedToday, reward: 200 },
    { id: 'daily-action-2', title: 'Action Hero', description: 'Play 2 Action games today', target: 2, progress: state.actionGamesPlayed, reward: 100 },
    { id: 'daily-puzzle-2', title: 'Puzzle Master', description: 'Play 2 Puzzle games today', target: 2, progress: state.puzzleGamesPlayed, reward: 100 },
    { id: 'daily-sports-2', title: 'Athlete', description: 'Play 2 Sports games today', target: 2, progress: state.sportsGamesPlayed, reward: 100 },
    { id: 'daily-clicker-1', title: 'Click Frenzy', description: 'Play 1 Clicker game today', target: 1, progress: state.clickerGamesPlayed, reward: 75 },
    { id: 'daily-io-2', title: 'Online Warrior', description: 'Play 2 IO Games today', target: 2, progress: state.ioGamesPlayed, reward: 100 },
    { id: 'daily-papas-1', title: "Papa's Helper", description: "Play a Papa's game today", target: 1, progress: state.papasGamesPlayed, reward: 75 },
  ];

  const weeklyQuests = [
    { id: 'weekly-play-25', title: 'Weekend Warrior', description: 'Play 25 games this week', target: 25, progress: state.weeklyGamesPlayed, reward: 1000 },
    { id: 'weekly-streak-5', title: 'Consistent Gamer', description: 'Reach a 5-day streak', target: 5, progress: state.streak, reward: 500 },
    { id: 'weekly-action-10', title: 'Action Fanatic', description: 'Play 10 Action games this week', target: 10, progress: state.actionGamesPlayed, reward: 800 },
    { id: 'weekly-puzzle-10', title: 'Big Brain', description: 'Play 10 Puzzle games this week', target: 10, progress: state.puzzleGamesPlayed, reward: 800 },
    { id: 'weekly-sports-7', title: 'League MVP', description: 'Play 7 Sports games this week', target: 7, progress: state.sportsGamesPlayed, reward: 500 },
    { id: 'weekly-clicker-5', title: 'Clicker Legend', description: 'Play 5 Clicker games this week', target: 5, progress: state.clickerGamesPlayed, reward: 350 },
    { id: 'weekly-io-8', title: 'IO Dominator', description: 'Play 8 IO Games this week', target: 8, progress: state.ioGamesPlayed, reward: 600 },
    { id: 'weekly-papas-3', title: "Papa's Regular", description: "Play 3 Papa's games this week", target: 3, progress: state.papasGamesPlayed, reward: 350 },
  ];

  const renderQuest = (quest: any, isWeekly = false) => {
    const isCompleted = quest.progress >= quest.target;
    const isClaimed = isWeekly 
      ? state.claimedWeeklyQuests.includes(quest.id) 
      : state.claimedQuests.includes(quest.id);
    const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

    return (
      <motion.div 
        key={quest.id}
        whileHover={{ scale: 1.01 }}
        className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{t(`quest.${quest.id}.title`)}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border ${
              isWeekly ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              <Coins className="w-4 h-4" /> {quest.reward}
            </span>
          </div>
          <p className="text-gray-400 mb-4">{t(`quest.${quest.id}.desc`)}</p>
          
          <div className="w-full bg-black/50 rounded-full h-3 border border-white/5 overflow-hidden">
            <div 
              className={`${isWeekly ? 'bg-blue-500' : 'bg-emerald-500'} h-full rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
            </div>
          </div>
          <div className="text-right mt-2 text-sm font-medium text-gray-500">
            {Math.min(quest.progress, quest.target)} / {quest.target}
          </div>
        </div>

        <div className="w-full sm:w-auto">
          {isClaimed ? (
            <button disabled className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-white/5 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2 border border-white/5">
              <CheckCircle2 className="w-5 h-5" /> {t('quests.claimed')}
            </button>
          ) : (
            <button
              onClick={() => claimQuest(quest.id, quest.reward, isWeekly)}
              disabled={!isCompleted}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                isCompleted 
                  ? (isWeekly ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20')
                  : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {isCompleted ? t('quests.claim') : t('quests.progress')}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
          <Target className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('quests.title')}</h1>
          <p className="text-gray-400 mt-1 text-lg">{t('quests.desc')}</p>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" /> {t('quests.daily')}
          </h2>
          <div className="space-y-4">
            {dailyQuests.map(q => renderQuest(q, false))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-400" /> {t('quests.weekly')}
          </h2>
          <div className="space-y-4">
            {weeklyQuests.map(q => renderQuest(q, true))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementsPage() {
  const { state, claimAchievement } = useGameContext();
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-yellow-500/20 rounded-2xl border border-yellow-500/30">
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('achievements.title')}</h1>
          <p className="text-gray-400 mt-1 text-lg">{t('achievements.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const isUnlocked = state.unlockedAchievements.includes(ach.id);
          const isClaimed = state.claimedAchievements?.includes(ach.id);
          const Icon = ach.icon;

          return (
            <motion.div 
              key={ach.id}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl p-6 flex items-center gap-6 border transition-all duration-300 ${
                isClaimed
                  ? 'bg-[#1a1a1a] border-white/5 opacity-70'
                  : isUnlocked 
                    ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                    : 'bg-[#1a1a1a] border-white/5'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                isUnlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-600'
              }`}>
                {isUnlocked ? <Icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {t(`ach.${ach.id}.title`)}
                  </h3>
                  {isClaimed ? (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-400 text-xs font-bold border border-white/10">
                      {t('achievements.claimed')}
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                      {t('achievements.unlocked')}
                    </span>
                  ) : null}
                </div>
                <p className="text-gray-500">{t(`ach.${ach.id}.desc`)}</p>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <div className={`flex items-center gap-1.5 font-bold ${isUnlocked && !isClaimed ? 'text-yellow-400' : 'text-gray-600'}`}>
                  <Coins className="w-5 h-5" />
                  {ach.reward}
                </div>
                {isClaimed ? (
                  <button disabled className="px-4 py-1.5 rounded-lg font-bold bg-white/5 text-gray-500 cursor-not-allowed flex items-center gap-1.5 border border-white/5 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> {t('quests.claimed')}
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => claimAchievement(ach.id, ach.reward)}
                    className="px-4 py-1.5 rounded-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all text-sm"
                  >
                    {t('achievements.claim')}
                  </button>
                ) : (
                  <button disabled className="px-4 py-1.5 rounded-lg font-bold bg-white/5 text-gray-600 cursor-not-allowed border border-white/5 text-sm">
                    {t('achievements.locked')}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gray-500/20 rounded-2xl border border-gray-500/30">
          <Settings className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('nav.settings')}</h1>
          <p className="text-gray-400 mt-1 text-lg">Manage your preferences</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-400" />
          Language
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              language === 'en' 
                ? 'bg-blue-500/20 border-blue-500/50 text-white' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              language === 'en' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
            }`}>
              EN
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">{t('lang.english')}</div>
              <div className="text-sm opacity-70">English</div>
            </div>
          </button>

          <button
            onClick={() => setLanguage('es-mx')}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              language === 'es-mx' 
                ? 'bg-blue-500/20 border-blue-500/50 text-white' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              language === 'es-mx' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
            }`}>
              MX
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">{t('lang.spanish')}</div>
              <div className="text-sm opacity-70">Español (México)</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProfilePage() {
  const { state, equipSkin, getMultiplier, updateProfile, claimDailyReward, enterSecretCode, setAuthMode, logout } = useGameContext();
  const { t } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState(state.username);
  const [editPic, setEditPic] = useState(state.profilePic);
  const [editBanner, setEditBanner] = useState(state.profileBanner);
  const [editNameColor, setEditNameColor] = useState(state.nameColor || '#ffffff');
  const [secretCode, setSecretCode] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);

  const handleSaveProfile = () => {
    updateProfile(editUsername, editPic, editBanner, editNameColor);
    setIsEditingProfile(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (state.authMode === 'logged_in') {
      try {
        const { profileApi } = await import('../api/client');
        const { profilePicUrl } = await profileApi.uploadPicture(file);
        setEditPic(profilePicUrl);
        updateProfile(editUsername, profilePicUrl, editBanner, editNameColor);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setEditPic(reader.result as string);
        reader.readAsDataURL(file);
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => setEditPic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClaimDaily = () => {
    const success = claimDailyReward();
    if (success) {
      alert('Daily reward claimed!');
    } else {
      alert('You already claimed your daily reward today.');
    }
  };

  const handleSecretCode = (e: React.FormEvent) => {
    e.preventDefault();
    const success = enterSecretCode(secretCode);
    if (success) {
      alert('Secret code accepted! Check your new badges and rewards.');
      setShowSecretInput(false);
    } else {
      alert('Invalid code or already claimed.');
    }
    setSecretCode('');
  };

  const earnedBadges = ACHIEVEMENTS_DATA.filter(ach => state.unlockedAchievements.includes(ach.id));
  const xpNeeded = state.level * 1000;
  const xpProgress = (state.xp / xpNeeded) * 100;
  const multiplier = getMultiplier();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      {/* Profile Header with Banner */}
      <div 
        className={`relative w-full h-48 sm:h-64 rounded-t-3xl mb-16 overflow-visible ${!state.profileBanner.startsWith('#') ? state.profileBanner : ''}`}
        style={state.profileBanner.startsWith('#') ? { backgroundColor: state.profileBanner } : {}}
      >
        {isEditingProfile && (
          <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
            <label className="text-xs text-white/70 block mb-1">Banner Class or Color</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={editBanner}
                onChange={(e) => setEditBanner(e.target.value)}
                className="bg-black/50 text-white text-sm px-2 py-1 rounded border border-white/20 w-40"
                placeholder="e.g. bg-blue-500 or #ff0000"
              />
              <input 
                type="color"
                value={editBanner.startsWith('#') ? editBanner : '#3b82f6'}
                onChange={(e) => setEditBanner(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-white/20 p-0.5 bg-black/50"
                title="Pick a custom color"
              />
            </div>
          </div>
        )}
        
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group">
            <img 
              src={isEditingProfile ? editPic : state.profilePic} 
              alt="Profile" 
              className="w-32 h-32 rounded-2xl border-4 border-[#0a0a0a] bg-[#1a1a1a] object-cover shadow-2xl"
            />
            {isEditingProfile && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <input 
                  type="text" 
                  value={editPic}
                  onChange={(e) => setEditPic(e.target.value)}
                  className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-white/20 w-28 text-center"
                  placeholder="Image URL"
                />
                <label className="text-xs text-blue-400 cursor-pointer hover:underline">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            )}
          </div>
          
          <div className="mb-2">
            {isEditingProfile ? (
              <div className="flex flex-col gap-2 mb-2">
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="bg-black/50 text-3xl font-bold text-white px-3 py-1 rounded border border-white/20 w-48"
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Name Color:</label>
                  <input 
                    type="color" 
                    value={editNameColor}
                    onChange={(e) => setEditNameColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-white/20 p-0.5 bg-black/50"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {state.prestige > 0 && (
                  <span className="text-sm font-bold text-fuchsia-400 mb-1">{t('profile.prestige')} {state.prestige}</span>
                )}
                <h1 
                  className="text-4xl font-bold tracking-tight flex items-center gap-3" 
                  style={{ 
                    color: state.nameColor || '#ffffff',
                    textShadow: `0 0 10px ${state.nameColor || '#ffffff'}80`
                  }}
                >
                  {state.username}
                  {state.isOwner && <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" title={t('profile.owner')} />}
                  {state.isAdmin && !state.isOwner && <Shield className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" title={t('profile.admin')} />}
                </h1>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1">
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-bold text-white border border-white/10">
                {t('profile.lvl')} {state.level}
              </span>
              <span className="text-gray-400 text-sm">
                {state.xp} / {xpNeeded} {t('profile.xp')}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-12 right-8 flex gap-3">
          {isEditingProfile ? (
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-yellow-400 font-medium bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                This is a preview, remember to save
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditUsername(state.username);
                    setEditPic(state.profilePic);
                    setEditBanner(state.profileBanner);
                    setEditNameColor(state.nameColor || '#ffffff');
                    setIsEditingProfile(false);
                  }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-colors border border-red-500/30"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {t('profile.save')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => logout()}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 flex items-center gap-2"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Log Out</span>
              </button>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10"
                title={t('profile.edit')}
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-3 bg-black/50 rounded-full border border-white/10 overflow-hidden mb-12">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
          style={{ width: `${xpProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Flame className="w-8 h-8 text-orange-400 mb-2" />
          <p className="text-gray-400 text-sm font-medium">{t('profile.streak')}</p>
          <p className="text-3xl font-bold text-white">{state.streak} {t('profile.days')}</p>
          <div className="mt-2 text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">
            {multiplier.toFixed(1)}x {t('profile.multiplier')}
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Coins className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-gray-400 text-sm font-medium">{t('profile.coins')}</p>
          <p className="text-3xl font-bold text-white">{state.coins}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Target className="w-8 h-8 text-emerald-400 mb-2" />
          <p className="text-gray-400 text-sm font-medium">{t('profile.played')}</p>
          <p className="text-3xl font-bold text-white">{state.totalGamesPlayed}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center relative overflow-hidden">
          <Gift className="w-8 h-8 text-purple-400" />
          <p className="text-purple-200 text-sm font-medium">{t('profile.daily')}</p>
          <button 
            onClick={handleClaimDaily}
            disabled={state.lastDailyReward === new Date().toDateString()}
            className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
              state.lastDailyReward === new Date().toDateString()
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/20'
            }`}
          >
            {state.lastDailyReward === new Date().toDateString() ? t('profile.claimed') : t('profile.claim')}
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Palette className="w-6 h-6 text-fuchsia-400" />
          {t('profile.skins')}
        </h2>
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">{t('profile.snake')}</h3>
              <p className="text-gray-400 text-sm">{t('profile.snake.desc')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.skins.snake?.map(skin => (
                <button
                  key={skin}
                  onClick={() => equipSkin('snake', skin)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                    state.activeSkins.snake === skin
                      ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {skin}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          {t('profile.badges')}
        </h2>
        
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {earnedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{badge.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">{badge.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('profile.badges.none')}</h3>
            <p className="text-gray-400">{t('profile.badges.none.desc')}</p>
          </div>
        )}
      </div>

      {/* Admin Panel */}
      {(state.isAdmin || state.isOwner) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Secret Admin Panel
          </h2>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-200 mb-4">Welcome to the secret admin panel. Use these tools responsibly.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const newCoins = prompt("Enter amount of coins to add:");
                  if (newCoins && !isNaN(Number(newCoins))) {
                    const currentData = JSON.parse(localStorage.getItem('portalGameState') || '{}');
                    currentData.coins = (currentData.coins || 0) + Number(newCoins);
                    localStorage.setItem('portalGameState', JSON.stringify(currentData));
                    window.location.reload();
                  }
                }}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Add Coins
              </button>
              <button 
                onClick={() => {
                  const newLevel = prompt("Enter new level:");
                  if (newLevel && !isNaN(Number(newLevel))) {
                    const currentData = JSON.parse(localStorage.getItem('portalGameState') || '{}');
                    currentData.level = Number(newLevel);
                    localStorage.setItem('portalGameState', JSON.stringify(currentData));
                    window.location.reload();
                  }
                }}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Set Level
              </button>
              {state.isOwner && (
                <button 
                  onClick={() => {
                    const currentData = JSON.parse(localStorage.getItem('portalGameState') || '{}');
                    currentData.inventory = [...(currentData.inventory || []), 'diamond-crown', 'golden-crown', 'vip-badge'];
                    localStorage.setItem('portalGameState', JSON.stringify(currentData));
                    window.location.reload();
                  }}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  Unlock All Badges (Owner)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secret Code Section */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center">
        <button 
          onClick={() => setShowSecretInput(!showSecretInput)}
          className="text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-2 text-sm"
        >
          <Key className="w-4 h-4" />
          {t('profile.redeem')}
        </button>
        
        <AnimatePresence>
          {showSecretInput && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSecretCode}
              className="mt-4 flex gap-2 overflow-hidden"
            >
              <input 
                type="text" 
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code..."
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Submit
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Data Management Section */}
      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
        <h3 className="text-gray-400 text-sm mb-4">{t('profile.data')}</h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href",     dataStr);
              downloadAnchorNode.setAttribute("download", "neongames_save.json");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-white/10 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('profile.export')}
          </button>
          <label className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-white/10 flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            {t('profile.import')}
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const json = JSON.parse(event.target?.result as string);
                      localStorage.setItem('portalGameState', JSON.stringify(json));
                      window.location.reload();
                    } catch (err) {
                      alert('Invalid save file');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-4 max-w-md text-center">
          {t('profile.export.desc')}
        </p>
      </div>
    </motion.div>
  );
}

export function RoadmapPage() {
  const { state, claimLevelReward, doPrestige } = useGameContext();
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
          <Target className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('roadmap.title')}</h1>
          <p className="text-gray-400 mt-1 text-lg">{t('roadmap.desc')}</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 mb-12 relative overflow-hidden">
        {state.prestige > 0 && (
          <div className="absolute top-0 right-0 bg-fuchsia-500/20 text-fuchsia-400 px-4 py-2 rounded-bl-2xl font-bold border-b border-l border-fuchsia-500/30">
            {t('profile.prestige')} {state.prestige}
          </div>
        )}
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('roadmap.current')}: {state.level}</h2>
            <p className="text-gray-400">{t('profile.xp')}: {state.xp} / {state.level * 1000}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">{t('roadmap.next')}</p>
            <p className="text-xl font-bold text-blue-400">{state.level + 1}</p>
          </div>
        </div>
        <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(state.xp / (state.level * 1000)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {state.level >= 100 && (
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-fuchsia-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> {t('roadmap.prestige.avail')}
              </h3>
              <p className="text-sm text-gray-400">{t('roadmap.prestige.desc')}</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm(t('roadmap.prestige.confirm'))) {
                  doPrestige();
                }
              }}
              className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-fuchsia-500/20 whitespace-nowrap"
            >
              {t('roadmap.prestige.now')}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-transparent">
        {LEVEL_REWARDS.map((milestone, index) => {
          const isUnlocked = state.level >= milestone.level;
          const isClaimed = state.claimedLevelRewards.includes(milestone.level);
          const Icon = milestone.icon;

          return (
            <div key={milestone.level} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#111] bg-[#1a1a1a] shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 shrink-0 md:mx-auto group-hover:scale-110 transition-transform">
                <Icon className={`w-6 h-6 ${isUnlocked ? 'text-blue-400' : 'text-gray-600'}`} />
              </div>

              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 shadow-xl relative">
                <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] border-white/5 transform rotate-45 
                  ${index % 2 === 0 ? 'md:-right-2 md:border-t md:border-r border-l border-b -left-2' : 'md:-left-2 md:border-b md:border-l border-l border-b -left-2'}`} 
                />
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                    {t('roadmap.level')} {milestone.level}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded-lg">
                    <Coins className="w-4 h-4" />
                    {milestone.reward.toLocaleString()}
                  </div>
                </div>
                
                <p className={`text-sm mb-4 ${isUnlocked ? 'text-blue-300' : 'text-gray-600'}`}>
                  {t(`level.${milestone.level}.title`)}
                </p>

                <button
                  onClick={() => claimLevelReward(milestone.level, milestone.reward)}
                  disabled={!isUnlocked || isClaimed}
                  className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isClaimed 
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : isUnlocked
                        ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t('roadmap.claimed')}
                    </>
                  ) : isUnlocked ? (
                    t('roadmap.claim')
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      {t('roadmap.locked')}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function DailyRewardsPage() {
  const { state, claimDailyReward, getMultiplier } = useGameContext();
  const { t } = useLanguage();
  const multiplier = getMultiplier();
  const today = new Date().toDateString();
  const canClaim = state.lastDailyReward !== today;

  // Generate a 7-day timeline based on current streak
  const timelineDays = Array.from({ length: 7 }, (_, i) => {
    const dayNumber = state.streak + (canClaim ? i : i + 1);
    const dayMultiplier = Math.min(2.5, 1 + (dayNumber - 1) * 0.1);
    const reward = Math.floor(100 * dayMultiplier);
    return { day: dayNumber, reward, multiplier: dayMultiplier };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-orange-500/20 rounded-2xl border border-orange-500/30">
          <Flame className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('daily.title')}</h1>
          <p className="text-gray-400 mt-1 text-lg">{t('daily.desc')}</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('daily.streak')}: {state.streak} {t('profile.days')}</h2>
        <p className="text-orange-400 font-bold mb-6">{t('daily.multiplier')}: {multiplier.toFixed(1)}x</p>
        
        <button
          onClick={() => {
            if (claimDailyReward()) {
              alert(t('daily.claimed.msg'));
            }
          }}
          disabled={!canClaim}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            canClaim 
              ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
          }`}
        >
          {canClaim ? `${t('daily.claim')} (${Math.floor(100 * multiplier)} ${t('header.coins')})` : t('daily.tomorrow')}
        </button>
      </div>

      <h3 className="text-2xl font-bold text-white mb-6">{t('daily.upcoming')}</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-yellow-500 before:to-transparent">
        {timelineDays.map((dayData, index) => {
          const isToday = index === 0 && canClaim;
          
          return (
            <div key={dayData.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#111] ${isToday ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'bg-[#1a1a1a] shadow-[0_0_15px_rgba(0,0,0,0.5)]'} z-10 shrink-0 md:mx-auto group-hover:scale-110 transition-transform`}>
                <Flame className={`w-6 h-6 ${isToday ? 'text-white' : 'text-orange-400'}`} />
              </div>

              <div className={`w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-[#1a1a1a] border ${isToday ? 'border-orange-500/50' : 'border-white/5'} rounded-2xl p-6 shadow-xl relative`}>
                <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1a1a1a] transform rotate-45 
                  ${index % 2 === 0 ? 'md:-right-2 md:border-t md:border-r border-l border-b -left-2' : 'md:-left-2 md:border-b md:border-l border-l border-b -left-2'}
                  ${isToday ? 'border-orange-500/50' : 'border-white/5'}`} 
                />
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${isToday ? 'text-orange-400' : 'text-white'}`}>
                    {t('daily.day')} {dayData.day}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded-lg">
                    <Coins className="w-4 h-4" />
                    {dayData.reward.toLocaleString()}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400">
                  {t('profile.multiplier')}: <span className="text-orange-400 font-bold">{dayData.multiplier.toFixed(1)}x</span>
                </p>
                {isToday && (
                  <p className="text-xs text-emerald-400 font-bold mt-2">{t('daily.available')}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
