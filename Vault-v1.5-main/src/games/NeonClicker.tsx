import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, Save } from 'lucide-react';
import { progressApi } from '../api/client';
import { useGameContext } from '../context/GameContext';

const SIGMA_EMOJIS = ['🗿', '🍷', '🥶', '📈', '🐺', '🔥', '🤫', '🧏‍♂️'];
const GAME_ID = 'sigma-clicker';

interface Upgrade {
  id: string;
  name: string;
  type: 'click' | 'auto';
  value: number;
  baseCost: number;
  icon: string;
  description: string;
}

const UPGRADES: Upgrade[] = [
  { id: 'mewing', name: 'Mewing Streak', type: 'click', value: 1, baseCost: 15, icon: '🤫', description: '+1 per click' },
  { id: 'podcast', name: 'Start a Podcast', type: 'auto', value: 2, baseCost: 50, icon: '🎙️', description: '+2 per sec' },
  { id: 'grindset', name: 'Sigma Grindset', type: 'click', value: 5, baseCost: 200, icon: '🧠', description: '+5 per click' },
  { id: 'crypto', name: 'Crypto Portfolio', type: 'auto', value: 15, baseCost: 1000, icon: '📈', description: '+15 per sec' },
  { id: 'looksmaxxing', name: 'Looksmaxxing', type: 'click', value: 50, baseCost: 5000, icon: '🧏‍♂️', description: '+50 per click' },
  { id: 'matrix', name: 'Escape the Matrix', type: 'auto', value: 100, baseCost: 25000, icon: '💊', description: '+100 per sec' },
  { id: 'alpha', name: 'Alpha Aura', type: 'click', value: 500, baseCost: 100000, icon: '🐺', description: '+500 per click' },
  { id: 'ceo', name: 'CEO Mindset', type: 'auto', value: 1000, baseCost: 500000, icon: '🏢', description: '+1000 per sec' },
];

export function NeonClicker() {
  const { state } = useGameContext();
  const [clicks, setClicks] = useState(0);
  const [ownedUpgrades, setOwnedUpgrades] = useState<Record<string, number>>({});
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = React.useRef(Date.now());

  const clickPower = 1 + UPGRADES.filter(u => u.type === 'click').reduce((acc, u) => acc + (u.value * (ownedUpgrades[u.id] || 0)), 0);
  const autoClicks = UPGRADES.filter(u => u.type === 'auto').reduce((acc, u) => acc + (u.value * (ownedUpgrades[u.id] || 0)), 0);

  const saveProgress = useCallback(async (currentClicks: number, currentUpgrades: Record<string, number>) => {
    if (state.authMode !== 'logged_in') {
      localStorage.setItem('sigmaClicker_progress', JSON.stringify({ clicks: currentClicks, ownedUpgrades: currentUpgrades }));
      setSaveStatus('saved');
      return;
    }
    setSaveStatus('saving');
    try {
      const playtimeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      await progressApi.save(GAME_ID, { clicks: currentClicks, ownedUpgrades: currentUpgrades }, playtimeSeconds);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('unsaved');
    }
  }, [state.authMode]);

  useEffect(() => {
    const loadProgress = async () => {
      if (state.authMode === 'logged_in') {
        try {
          const data = await progressApi.get(GAME_ID);
          if (data.progress) {
            const p = data.progress as { clicks?: number; ownedUpgrades?: Record<string, number> };
            setClicks(p.clicks || 0);
            setOwnedUpgrades(p.ownedUpgrades || {});
          }
        } catch {
          const local = localStorage.getItem('sigmaClicker_progress');
          if (local) {
            try {
              const p = JSON.parse(local);
              setClicks(p.clicks || 0);
              setOwnedUpgrades(p.ownedUpgrades || {});
            } catch {}
          }
        }
      } else {
        const local = localStorage.getItem('sigmaClicker_progress');
        if (local) {
          try {
            const p = JSON.parse(local);
            setClicks(p.clicks || 0);
            setOwnedUpgrades(p.ownedUpgrades || {});
          } catch {}
        }
      }
      setLoaded(true);
    };
    loadProgress();
  }, [state.authMode]);

  useEffect(() => {
    if (!loaded) return;
    setSaveStatus('unsaved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProgress(clicks, ownedUpgrades);
    }, 5000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [clicks, ownedUpgrades, loaded]);

  useEffect(() => {
    if (autoClicks > 0) {
      const interval = setInterval(() => setClicks(c => c + autoClicks), 1000);
      return () => clearInterval(interval);
    }
  }, [autoClicks]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClicks(c => c + clickPower);
    const randomEmoji = SIGMA_EMOJIS[Math.floor(Math.random() * SIGMA_EMOJIS.length)];
    const newEffect = { id: Date.now() + Math.random(), x, y, emoji: randomEmoji };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id)), 1000);
  };

  const getCost = (upgrade: Upgrade) => {
    const owned = ownedUpgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.5, owned));
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    const cost = getCost(upgrade);
    if (clicks >= cost) {
      setClicks(c => c - cost);
      setOwnedUpgrades(prev => ({ ...prev, [upgrade.id]: (prev[upgrade.id] || 0) + 1 }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full bg-[#111] text-white font-sans p-4 sm:p-8 overflow-y-auto">
      <div className="mb-8 text-center w-full">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Sigma Clicker
          </h1>
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
            <Save className="w-3 h-3" />
            <span className={saveStatus === 'saved' ? 'text-emerald-400' : saveStatus === 'saving' ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}>
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-3xl font-bold text-white">
          <Trophy className="w-8 h-8 text-yellow-400" />
          {Math.floor(clicks).toLocaleString()} <span className="text-xl text-gray-400">Aura</span>
        </div>
        <p className="text-gray-400 mt-2">{autoClicks.toLocaleString()} aura / second | {clickPower.toLocaleString()} aura / click</p>
        {state.authMode !== 'logged_in' && (
          <p className="text-yellow-500/70 text-xs mt-1">Log in to save progress to the cloud ☁️</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl pb-12">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 pointer-events-none" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            onClick={handleClick}
            className="relative w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center border-4 border-white/20 overflow-hidden group z-10"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
            <img
              src="https://i.imgflip.com/5w7j4y.jpg"
              alt="Gigachad"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-300"
              draggable={false}
            />
            <AnimatePresence>
              {clickEffects.map(effect => (
                <motion.div
                  key={effect.id}
                  initial={{ opacity: 1, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, y: -100, scale: 2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute text-4xl font-bold text-white drop-shadow-lg pointer-events-none z-20 flex flex-col items-center"
                  style={{ left: effect.x, top: effect.y, transform: 'translate(-50%, -50%)' }}
                >
                  <span className="text-2xl mb-1">{effect.emoji}</span>
                  <span className="text-emerald-400 text-xl">+{clickPower}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.button>
          <p className="mt-8 text-gray-400 font-medium text-lg animate-pulse">Click the Sigma to gain Aura</p>
        </div>

        <div className="flex-1 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 sticky top-0 bg-[#111] py-2 z-10">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Grindset Upgrades
          </h2>
          {UPGRADES.map(upgrade => {
            const cost = getCost(upgrade);
            const canAfford = clicks >= cost;
            const owned = ownedUpgrades[upgrade.id] || 0;
            return (
              <button
                key={upgrade.id}
                onClick={() => buyUpgrade(upgrade)}
                disabled={!canAfford}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${canAfford ? 'bg-[#1a1a1a] border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 cursor-pointer' : 'bg-[#111] border-white/5 opacity-50 cursor-not-allowed'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/20 rounded-xl text-2xl">{upgrade.icon}</div>
                  <div className="text-left">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {upgrade.name}
                      {owned > 0 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Lvl {owned}</span>}
                    </h3>
                    <p className="text-sm text-gray-400">{upgrade.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-emerald-400">{cost.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Aura</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
