import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi, profileApi, getToken, setToken, removeToken, UserProfile } from '../api/client';

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  lastLogin: string;
  gamesPlayedToday: number;
  totalGamesPlayed: number;
  sportsGamesPlayed: number;
  actionGamesPlayed: number;
  puzzleGamesPlayed: number;
  clickerGamesPlayed: number;
  ioGamesPlayed: number;
  classicsGamesPlayed: number;
  papasGamesPlayed: number;
  racingGamesPlayed: number;
  sandboxGamesPlayed: number;
  asmrGamesPlayed: number;
  weeklyGamesPlayed: number;
  lastWeekReset: string;
  inventory: string[];
  skins: Record<string, string[]>;
  activeSkins: Record<string, string>;
  claimedQuests: string[];
  claimedWeeklyQuests: string[];
  unlockedAchievements: string[];
  claimedAchievements: string[];
  username: string;
  profilePic: string;
  profileBanner: string;
  isAdmin: boolean;
  isOwner: boolean;
  lastDailyReward: string;
  claimedLevelRewards: number[];
  prestige: number;
  nameColor: string;
  pendingStreakLoss: { oldStreak: number; cost: number } | null;
  showStreakIncrease: boolean;
  authMode: 'none' | 'guest' | 'logged_in';
}

interface GameContextType {
  state: GameState;
  currentUser: UserProfile | null;
  buyItem: (id: string, cost: number, isConsumable?: boolean) => boolean;
  openMysteryBox: () => string | null;
  equipSkin: (game: string, skin: string) => void;
  playGame: (category: string) => void;
  claimQuest: (id: string, reward: number, isWeekly?: boolean) => void;
  claimAchievement: (id: string, reward: number) => void;
  checkAchievements: () => void;
  getMultiplier: () => number;
  updateProfile: (username: string, profilePic: string, profileBanner: string, nameColor: string) => void;
  claimDailyReward: () => boolean;
  enterSecretCode: (code: string) => boolean;
  claimLevelReward: (level: number, reward: number) => boolean;
  doPrestige: () => boolean;
  resolveStreakLoss: (restore: boolean) => void;
  clearStreakIncrease: () => void;
  setAuthMode: (mode: 'none' | 'guest' | 'logged_in') => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultState: GameState = {
  coins: 200,
  xp: 0,
  level: 1,
  streak: 1,
  lastLogin: new Date().toDateString(),
  gamesPlayedToday: 0,
  totalGamesPlayed: 0,
  sportsGamesPlayed: 0,
  actionGamesPlayed: 0,
  puzzleGamesPlayed: 0,
  clickerGamesPlayed: 0,
  ioGamesPlayed: 0,
  classicsGamesPlayed: 0,
  papasGamesPlayed: 0,
  racingGamesPlayed: 0,
  sandboxGamesPlayed: 0,
  asmrGamesPlayed: 0,
  weeklyGamesPlayed: 0,
  lastWeekReset: new Date().toDateString(),
  inventory: [],
  skins: { snake: ['default'] },
  activeSkins: { snake: 'default' },
  claimedQuests: [],
  claimedWeeklyQuests: [],
  unlockedAchievements: [],
  claimedAchievements: [],
  username: 'Player',
  profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player',
  profileBanner: 'bg-gradient-to-r from-blue-500 to-purple-600',
  isAdmin: false,
  isOwner: false,
  lastDailyReward: '',
  claimedLevelRewards: [],
  prestige: 0,
  nameColor: '#ffffff',
  pendingStreakLoss: null,
  showStreakIncrease: false,
  authMode: 'none',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function applyDailyLoginLogic(merged: GameState): GameState {
  const today = new Date().toDateString();
  if (merged.lastLogin !== today) {
    const last = new Date(merged.lastLogin);
    const now = new Date(today);
    const utcLast = Date.UTC(last.getFullYear(), last.getMonth(), last.getDate());
    const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.floor((utcNow - utcLast) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      merged.streak += 1;
      merged.showStreakIncrease = true;
    } else if (diffDays > 1) {
      if (merged.inventory && merged.inventory.includes('streak-freeze')) {
        const freezeIndex = merged.inventory.indexOf('streak-freeze');
        merged.inventory.splice(freezeIndex, 1);
      } else {
        if (merged.streak > 1) {
          const cost = Math.max(5000, merged.streak * 500);
          merged.pendingStreakLoss = { oldStreak: merged.streak, cost };
        }
        merged.streak = 1;
      }
    }
    merged.lastLogin = today;
    merged.gamesPlayedToday = 0;
    merged.claimedQuests = [];
  }
  const lastWeek = new Date(merged.lastWeekReset);
  const nowForWeek = new Date(today);
  const diffTimeWeekly = Math.abs(nowForWeek.getTime() - lastWeek.getTime());
  const diffDaysWeekly = Math.ceil(diffTimeWeekly / (1000 * 60 * 60 * 24));
  if (diffDaysWeekly >= 7) {
    merged.weeklyGamesPlayed = 0;
    merged.claimedWeeklyQuests = [];
    merged.lastWeekReset = today;
  }
  return merged;
}

function fillDefaults(merged: GameState): GameState {
  merged.claimedWeeklyQuests = merged.claimedWeeklyQuests || [];
  merged.claimedAchievements = merged.claimedAchievements || [];
  merged.puzzleGamesPlayed = merged.puzzleGamesPlayed || 0;
  merged.clickerGamesPlayed = merged.clickerGamesPlayed || 0;
  merged.ioGamesPlayed = merged.ioGamesPlayed || 0;
  merged.classicsGamesPlayed = merged.classicsGamesPlayed || 0;
  merged.papasGamesPlayed = merged.papasGamesPlayed || 0;
  merged.racingGamesPlayed = merged.racingGamesPlayed || 0;
  merged.sandboxGamesPlayed = merged.sandboxGamesPlayed || 0;
  merged.asmrGamesPlayed = merged.asmrGamesPlayed || 0;
  merged.weeklyGamesPlayed = merged.weeklyGamesPlayed || 0;
  merged.xp = merged.xp || 0;
  merged.level = merged.level || 1;
  merged.skins = merged.skins || { snake: ['default'] };
  merged.activeSkins = merged.activeSkins || { snake: 'default' };
  merged.username = merged.username || 'Player';
  merged.profilePic = merged.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${merged.username || 'Player'}`;
  merged.profileBanner = merged.profileBanner || 'bg-gradient-to-r from-blue-500 to-purple-600';
  merged.isAdmin = merged.isAdmin || false;
  merged.isOwner = merged.isOwner || false;
  merged.lastDailyReward = merged.lastDailyReward || '';
  merged.claimedLevelRewards = merged.claimedLevelRewards || [];
  merged.prestige = merged.prestige || 0;
  merged.nameColor = merged.nameColor || '#ffffff';
  return merged;
}

function progressFromState(s: GameState): Record<string, unknown> {
  return {
    gamesPlayedToday: s.gamesPlayedToday,
    totalGamesPlayed: s.totalGamesPlayed,
    sportsGamesPlayed: s.sportsGamesPlayed,
    actionGamesPlayed: s.actionGamesPlayed,
    puzzleGamesPlayed: s.puzzleGamesPlayed,
    clickerGamesPlayed: s.clickerGamesPlayed,
    ioGamesPlayed: s.ioGamesPlayed,
    classicsGamesPlayed: s.classicsGamesPlayed,
    papasGamesPlayed: s.papasGamesPlayed,
    racingGamesPlayed: s.racingGamesPlayed,
    sandboxGamesPlayed: s.sandboxGamesPlayed,
    asmrGamesPlayed: s.asmrGamesPlayed,
    weeklyGamesPlayed: s.weeklyGamesPlayed,
    lastWeekReset: s.lastWeekReset,
    inventory: s.inventory,
    skins: s.skins,
    activeSkins: s.activeSkins,
    claimedQuests: s.claimedQuests,
    claimedWeeklyQuests: s.claimedWeeklyQuests,
    unlockedAchievements: s.unlockedAchievements,
    claimedAchievements: s.claimedAchievements,
    lastDailyReward: s.lastDailyReward,
    claimedLevelRewards: s.claimedLevelRewards,
    prestige: s.prestige,
    lastLogin: s.lastLogin,
  };
}

function stateFromUser(user: UserProfile): GameState {
  const saved = (user.progress_json as Partial<GameState>) || {};
  const base: GameState = {
    ...defaultState,
    ...saved,
    coins: user.coins,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    username: user.username,
    profilePic: user.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    profileBanner: user.profile_banner || 'bg-gradient-to-r from-blue-500 to-purple-600',
    nameColor: user.name_color || '#ffffff',
    isAdmin: user.is_admin,
    isOwner: user.is_owner,
    authMode: 'logged_in',
  };
  return fillDefaults(applyDailyLoginLogic(base));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('portalGameState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = fillDefaults(applyDailyLoginLogic({ ...defaultState, ...parsed }));
        return merged;
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem('portalGameState', JSON.stringify(state));
    if (state.authMode === 'logged_in' && currentUser) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        profileApi.syncGameState({
          coins: state.coins,
          xp: state.xp,
          level: state.level,
          streak: state.streak,
          progressJson: progressFromState(state),
        }).catch(() => {});
      }, 3000);
    }
  }, [state]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me().then(({ user }) => {
        setCurrentUser(user);
        setState(stateFromUser(user));
      }).catch(() => {
        removeToken();
      });
    }
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    if (currentUser) {
      try { await authApi.logout(); } catch {}
      removeToken();
    }
    const { token, user } = await authApi.login(emailOrUsername, password);
    setToken(token);
    setCurrentUser(user);
    setState(stateFromUser(user));
  };

  const register = async (username: string, email: string, password: string) => {
    const { token, user } = await authApi.register(username, email, password);
    setToken(token);
    setCurrentUser(user);
    setState(stateFromUser(user));
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    removeToken();
    setCurrentUser(null);
    localStorage.removeItem('portalGameState');
    setState({ ...defaultState });
  };

  const getMultiplier = () => Math.min(2.5, 1 + (state.streak - 1) * 0.1);

  const resolveStreakLoss = (restore: boolean) => {
    setState(prev => {
      if (!prev.pendingStreakLoss) return prev;
      if (restore) {
        if (prev.coins >= prev.pendingStreakLoss.cost) {
          return { ...prev, coins: prev.coins - prev.pendingStreakLoss.cost, streak: prev.pendingStreakLoss.oldStreak, pendingStreakLoss: null };
        }
        return prev;
      }
      return { ...prev, pendingStreakLoss: null };
    });
  };

  const clearStreakIncrease = () => setState(prev => ({ ...prev, showStreakIncrease: false }));

  const addXp = (amount: number, currentState: GameState) => {
    let newXp = currentState.xp + amount;
    let newLevel = currentState.level;
    let xpNeeded = newLevel * 1000;
    while (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel++;
      xpNeeded = newLevel * 1000;
    }
    return { xp: newXp, level: newLevel };
  };

  const checkAchievements = () => {
    setState(s => {
      const newState = { ...s };
      let changed = false;
      const unlock = (id: string) => {
        if (!newState.unlockedAchievements.includes(id)) {
          newState.unlockedAchievements.push(id);
          changed = true;
        }
      };
      if (newState.totalGamesPlayed >= 1) unlock('first-blood');
      if (newState.totalGamesPlayed >= 10) unlock('gamer');
      if (newState.totalGamesPlayed >= 50) unlock('addicted');
      if (newState.totalGamesPlayed >= 100) unlock('master');
      if (newState.totalGamesPlayed >= 500) unlock('grandmaster');
      if (newState.streak >= 3) unlock('dedicated');
      if (newState.streak >= 7) unlock('weekly-warrior');
      if (newState.streak >= 14) unlock('fortnight-fanatic');
      if (newState.streak >= 30) unlock('monthly-legend');
      if (newState.streak >= 90) unlock('quarterly-king');
      if (newState.sportsGamesPlayed >= 5) unlock('sports-fan');
      if (newState.sportsGamesPlayed >= 15) unlock('sports-pro');
      if (newState.actionGamesPlayed >= 5) unlock('action-novice');
      if (newState.actionGamesPlayed >= 25) unlock('action-expert');
      if (newState.puzzleGamesPlayed >= 5) unlock('puzzle-novice');
      if (newState.puzzleGamesPlayed >= 25) unlock('puzzle-expert');
      if (newState.clickerGamesPlayed >= 3) unlock('clicker-novice');
      if (newState.clickerGamesPlayed >= 10) unlock('clicker-addict');
      if (newState.ioGamesPlayed >= 5) unlock('io-novice');
      if (newState.ioGamesPlayed >= 20) unlock('io-pro');
      if (newState.papasGamesPlayed >= 2) unlock('chefs-apprentice');
      if (newState.papasGamesPlayed >= 6) unlock('head-chef');
      if (newState.classicsGamesPlayed >= 3) unlock('classics-fan');
      if (newState.sandboxGamesPlayed >= 1) unlock('sandbox-explorer');
      if (newState.asmrGamesPlayed >= 2) unlock('asmr-addict');
      if (newState.coins >= 1000) unlock('wealthy');
      if (newState.coins >= 5000) unlock('rich');
      if (newState.coins >= 10000) unlock('millionaire');
      if (newState.inventory.length >= 3) unlock('collector');
      if (newState.inventory.length >= 10) unlock('hoarder');
      return changed ? newState : s;
    });
  };

  useEffect(() => { checkAchievements(); }, [
    state.totalGamesPlayed, state.streak, state.coins, state.inventory.length,
    state.sportsGamesPlayed, state.actionGamesPlayed, state.puzzleGamesPlayed,
    state.clickerGamesPlayed, state.ioGamesPlayed, state.classicsGamesPlayed,
    state.papasGamesPlayed, state.sandboxGamesPlayed, state.asmrGamesPlayed,
  ]);

  const buyItem = (id: string, cost: number, isConsumable = false) => {
    let success = false;
    setState(s => {
      if (s.coins >= cost && (isConsumable || !s.inventory.includes(id))) {
        success = true;
        return { ...s, coins: s.coins - cost, inventory: [...s.inventory, id] };
      }
      return s;
    });
    return success;
  };

  const openMysteryBox = () => {
    const cost = 500;
    const availableSkins = ['neon', 'gold', 'glitch', 'ghost', 'rainbow', 'zebra', 'robo', 'dragon'].filter(
      skin => !state.skins.snake?.includes(skin)
    );
    if (state.coins < cost || availableSkins.length === 0) return null;
    const randomSkin = availableSkins[Math.floor(Math.random() * availableSkins.length)];
    setState(s => ({ ...s, coins: s.coins - cost, skins: { ...s.skins, snake: [...(s.skins.snake || ['default']), randomSkin] } }));
    return randomSkin;
  };

  const equipSkin = (game: string, skin: string) => setState(s => ({ ...s, activeSkins: { ...s.activeSkins, [game]: skin } }));

  const playGame = (category: string) => {
    setState(s => {
      const mult = Math.min(2.5, 1 + (s.streak - 1) * 0.1);
      const xpGained = Math.floor(100 * mult);
      const coinsGained = Math.floor(10 * mult);
      const { xp, level } = addXp(xpGained, s);
      return {
        ...s,
        coins: s.coins + coinsGained,
        xp,
        level,
        gamesPlayedToday: s.gamesPlayedToday + 1,
        totalGamesPlayed: s.totalGamesPlayed + 1,
        weeklyGamesPlayed: (s.weeklyGamesPlayed || 0) + 1,
        sportsGamesPlayed: category === 'Sports' ? s.sportsGamesPlayed + 1 : s.sportsGamesPlayed,
        actionGamesPlayed: category === 'Action' ? (s.actionGamesPlayed || 0) + 1 : (s.actionGamesPlayed || 0),
        puzzleGamesPlayed: category === 'Puzzle' ? (s.puzzleGamesPlayed || 0) + 1 : (s.puzzleGamesPlayed || 0),
        clickerGamesPlayed: category === 'Clicker' ? (s.clickerGamesPlayed || 0) + 1 : (s.clickerGamesPlayed || 0),
        ioGamesPlayed: category === 'IO Games' ? (s.ioGamesPlayed || 0) + 1 : (s.ioGamesPlayed || 0),
        classicsGamesPlayed: category === 'Classics' ? (s.classicsGamesPlayed || 0) + 1 : (s.classicsGamesPlayed || 0),
        papasGamesPlayed: category === "Papa's" ? (s.papasGamesPlayed || 0) + 1 : (s.papasGamesPlayed || 0),
        racingGamesPlayed: category === 'Racing' ? (s.racingGamesPlayed || 0) + 1 : (s.racingGamesPlayed || 0),
        sandboxGamesPlayed: category === 'Sandbox' ? (s.sandboxGamesPlayed || 0) + 1 : (s.sandboxGamesPlayed || 0),
        asmrGamesPlayed: category === 'ASMR' ? (s.asmrGamesPlayed || 0) + 1 : (s.asmrGamesPlayed || 0),
      };
    });
  };

  const claimQuest = (id: string, reward: number, isWeekly = false) => {
    setState(s => {
      const targetArray = isWeekly ? s.claimedWeeklyQuests : s.claimedQuests;
      if (!targetArray.includes(id)) {
        const { xp, level } = addXp(reward * 2, s);
        return {
          ...s,
          coins: s.coins + reward,
          xp,
          level,
          ...(isWeekly
            ? { claimedWeeklyQuests: [...s.claimedWeeklyQuests, id] }
            : { claimedQuests: [...s.claimedQuests, id] }),
        };
      }
      return s;
    });
  };

  const claimAchievement = (id: string, reward: number) => {
    setState(s => {
      if (s.unlockedAchievements.includes(id) && !s.claimedAchievements.includes(id)) {
        const { xp, level } = addXp(reward * 5, s);
        return { ...s, coins: s.coins + reward, xp, level, claimedAchievements: [...s.claimedAchievements, id] };
      }
      return s;
    });
  };

  const updateProfile = (username: string, profilePic: string, profileBanner: string, nameColor: string) => {
    setState(s => ({ ...s, username, profilePic, profileBanner, nameColor }));
    if (state.authMode === 'logged_in') {
      profileApi.update({ username, nameColor, profileBanner }).catch(() => {});
    }
  };

  const claimDailyReward = () => {
    const today = new Date().toDateString();
    let success = false;
    setState(s => {
      if (s.lastDailyReward !== today) {
        success = true;
        const rewardAmount = 100 * Math.min(2.5, 1 + (s.streak - 1) * 0.1);
        return { ...s, coins: s.coins + Math.floor(rewardAmount), lastDailyReward: today };
      }
      return s;
    });
    return success;
  };

  const enterSecretCode = (code: string) => {
    let success = false;
    setState(s => {
      if (code === 'ADMIN777' && !s.isAdmin) {
        success = true;
        return { ...s, isAdmin: true, coins: s.coins + 5000 };
      }
      if (code === 'OWNER999' && !s.isOwner) {
        success = true;
        return { ...s, isOwner: true, isAdmin: true, coins: s.coins + 50000, level: Math.max(s.level, 100) };
      }
      return s;
    });
    return success;
  };

  const claimLevelReward = (level: number, reward: number) => {
    let success = false;
    setState(s => {
      if (s.level >= level && !s.claimedLevelRewards.includes(level)) {
        success = true;
        return { ...s, coins: s.coins + reward, claimedLevelRewards: [...s.claimedLevelRewards, level] };
      }
      return s;
    });
    return success;
  };

  const doPrestige = () => {
    let success = false;
    setState(s => {
      if (s.level >= 100) {
        success = true;
        return { ...s, prestige: s.prestige + 1, level: 1, xp: 0, claimedLevelRewards: [] };
      }
      return s;
    });
    return success;
  };

  const setAuthMode = (mode: 'none' | 'guest' | 'logged_in') => setState(s => ({ ...s, authMode: mode }));

  return (
    <GameContext.Provider value={{
      state, currentUser,
      buyItem, openMysteryBox, equipSkin, playGame, claimQuest, claimAchievement,
      checkAchievements, getMultiplier, updateProfile, claimDailyReward, enterSecretCode,
      claimLevelReward, doPrestige, resolveStreakLoss, clearStreakIncrease, setAuthMode,
      login, register, logout,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within GameProvider');
  return context;
};
