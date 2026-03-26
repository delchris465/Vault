import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, X, LogIn, UserPlus, Eye, EyeOff, Loader } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'login' | 'register';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, setAuthMode } = useGameContext();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ emailOrUsername: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm.emailOrUsername, loginForm.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(registerForm.username, registerForm.email, registerForm.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all text-sm";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 max-w-sm w-full border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-full h-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Welcome to Vault</h2>
            <p className="text-gray-400 text-xs">Save your progress, earn achievements, climb the leaderboards!</p>
          </div>

          <div className="flex rounded-xl bg-white/5 p-1 mb-5">
            {(['login', 'register'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${tab === t ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                placeholder="Email or username"
                value={loginForm.emailOrUsername}
                onChange={e => setLoginForm(f => ({ ...f, emailOrUsername: e.target.value }))}
                className={inputClass}
                required
                autoComplete="username"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className={inputClass + ' pr-10'}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 mt-1"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                type="text"
                placeholder="Username (3-30 characters)"
                value={registerForm.username}
                onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
                className={inputClass}
                required
                minLength={3}
                maxLength={30}
                autoComplete="username"
              />
              <input
                type="email"
                placeholder="Email address"
                value={registerForm.email}
                onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                className={inputClass}
                required
                autoComplete="email"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
                  value={registerForm.password}
                  onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  className={inputClass + ' pr-10'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg mt-1"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setAuthMode('guest');
                onClose();
              }}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
            >
              Enter Guest Mode
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
