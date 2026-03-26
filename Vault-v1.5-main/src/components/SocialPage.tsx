import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { socialApi, chatApi, ChatMessage, FriendshipRow, UserProfile } from '../api/client';
import { useGameContext } from '../context/GameContext';
import { Send, Search, UserPlus, Check, X, MessageCircle, Globe, Users, ChevronLeft, UserCheck } from 'lucide-react';

type SocialTab = 'global' | 'friends' | 'find';

function Avatar({ user, size = 'md' }: { user: { username: string; profile_pic_url?: string | null; friend_pic?: string | null }; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';
  const pic = user.profile_pic_url || user.friend_pic;
  if (pic) return <img src={pic} alt={user.username} className={`${sz} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${sz} rounded-full bg-violet-600/40 flex items-center justify-center font-bold text-violet-200 flex-shrink-0`}>
      {user.username.charAt(0).toUpperCase()}
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function GlobalChat({ myUserId }: { myUserId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useGameContext();

  const fetchMessages = async () => {
    try {
      const data = await chatApi.getGlobal();
      setMessages(data.messages);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || sending) return;
    setSending(true);
    setInput('');
    try {
      const data = await chatApi.sendGlobal(msg);
      setMessages(prev => [...prev, data.message]);
    } catch (e: any) {
      setInput(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet — say hi!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_id === myUserId;
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-violet-600/40 text-violet-200' : 'bg-white/10 text-gray-300'}`}>
                {(msg.username || '?').charAt(0).toUpperCase()}
              </div>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!isMe && (
                  <span className="text-xs font-semibold" style={{ color: msg.name_color || '#a78bfa' }}>
                    {msg.username}
                  </span>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-white/10 text-gray-100 rounded-tl-sm'}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-gray-600">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/5 flex gap-2">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          placeholder="Message everyone..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          maxLength={300}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function DMChat({ friend, myUserId, onBack }: { friend: FriendshipRow; myUserId: number; onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await chatApi.getDM(friend.friend_id);
      setMessages(data.messages);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [friend.friend_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || sending) return;
    setSending(true);
    setInput('');
    try {
      const data = await chatApi.sendDM(friend.friend_id, msg);
      setMessages(prev => [...prev, data.message]);
    } catch {
      setInput(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/5 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <Avatar user={{ username: friend.friend_username, friend_pic: friend.friend_pic }} size="sm" />
        <span className="font-semibold text-sm" style={{ color: friend.friend_color || '#fff' }}>
          {friend.friend_username}
        </span>
        <span className="text-xs text-gray-500 ml-auto">Lv.{friend.friend_level}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet — start the conversation!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === myUserId;
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-violet-600/40 text-violet-200' : 'bg-white/10 text-gray-300'}`}>
                {(msg.sender_username || '?').charAt(0).toUpperCase()}
              </div>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <div className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-white/10 text-gray-100 rounded-tl-sm'}`}>
                  {msg.message}
                </div>
                <span className="text-[10px] text-gray-600">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-white/5 flex gap-2">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          placeholder={`Message ${friend.friend_username}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          maxLength={500}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function FriendsTab({ myUserId }: { myUserId: number }) {
  const [friendships, setFriendships] = useState<FriendshipRow[]>([]);
  const [activeDM, setActiveDM] = useState<FriendshipRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const data = await socialApi.getFriends();
      setFriendships(data.friendships);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const accepted = friendships.filter(f => f.status === 'accepted');
  const pendingIncoming = friendships.filter(f => f.status === 'pending' && f.addressee_id === myUserId);
  const pendingSent = friendships.filter(f => f.status === 'pending' && f.requester_id === myUserId);

  const handleRespond = async (id: number, action: 'accept' | 'decline' | 'remove') => {
    try {
      await socialApi.respondToRequest(id, action);
      await fetch();
    } catch {}
  };

  if (activeDM) {
    return <DMChat friend={activeDM} myUserId={myUserId} onBack={() => setActiveDM(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      {pendingIncoming.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Pending Requests ({pendingIncoming.length})
          </h3>
          <div className="space-y-2">
            {pendingIncoming.map(f => (
              <div key={f.friendship_id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <Avatar user={{ username: f.friend_username, friend_pic: f.friend_pic }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: f.friend_color || '#fff' }}>{f.friend_username}</p>
                  <p className="text-xs text-gray-500">Lv.{f.friend_level}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleRespond(f.friendship_id, 'accept')} className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 rounded-lg transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRespond(f.friendship_id, 'decline')} className="p-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-400 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pendingSent.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Sent Requests ({pendingSent.length})
          </h3>
          <div className="space-y-2">
            {pendingSent.map(f => (
              <div key={f.friendship_id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <Avatar user={{ username: f.friend_username, friend_pic: f.friend_pic }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: f.friend_color || '#fff' }}>{f.friend_username}</p>
                  <p className="text-xs text-gray-500">Pending…</p>
                </div>
                <button onClick={() => handleRespond(f.friendship_id, 'remove')} className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Friends ({accepted.length})
        </h3>
        {accepted.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No friends yet. Search for people to add!
          </div>
        ) : (
          <div className="space-y-2">
            {accepted.map(f => (
              <div key={f.friendship_id} className="flex items-center gap-3 bg-white/5 hover:bg-white/8 rounded-xl p-3 transition-colors group">
                <Avatar user={{ username: f.friend_username, friend_pic: f.friend_pic }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: f.friend_color || '#fff' }}>{f.friend_username}</p>
                  <p className="text-xs text-gray-500">Lv.{f.friend_level}</p>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveDM(f)} className="p-1.5 bg-violet-600/30 hover:bg-violet-600/50 text-violet-400 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleRespond(f.friendship_id, 'remove')} className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FindPeopleTab({ myUserId }: { myUserId: number }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());
  const [friendships, setFriendships] = useState<FriendshipRow[]>([]);

  useEffect(() => {
    socialApi.getFriends().then(d => setFriendships(d.friendships)).catch(() => {});
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await socialApi.search(query);
        setResults(data.users);
      } catch {} finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const getRelationship = (userId: number) => {
    const f = friendships.find(fr => fr.friend_id === userId);
    if (!f) return null;
    return f;
  };

  const handleAdd = async (userId: number) => {
    try {
      await socialApi.sendRequest(userId);
      setSentIds(prev => new Set([...prev, userId]));
      const data = await socialApi.getFriends();
      setFriendships(data.friendships);
    } catch {}
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
          placeholder="Search by username..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {searching && (
          <div className="text-center py-4 text-gray-500 text-sm">Searching...</div>
        )}
        {!searching && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No users found for "{query}"</div>
        )}
        {results.map(user => {
          const rel = getRelationship(user.id);
          const alreadySent = sentIds.has(user.id);
          const isAccepted = rel?.status === 'accepted';
          const isPending = rel?.status === 'pending' || alreadySent;
          return (
            <div key={user.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <Avatar user={user} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: (user as any).name_color || '#fff' }}>{user.username}</p>
                <p className="text-xs text-gray-500">Lv.{(user as any).level || 1}</p>
              </div>
              {isAccepted ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                  <UserCheck className="w-4 h-4" />
                  Friends
                </div>
              ) : isPending ? (
                <div className="text-xs text-gray-500 font-medium">Pending</div>
              ) : (
                <button
                  onClick={() => handleAdd(user.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 text-xs font-medium rounded-lg transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              )}
            </div>
          );
        })}
        {query.length < 2 && (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">Type at least 2 characters to search for players</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SocialPage() {
  const [tab, setTab] = useState<SocialTab>('global');
  const { currentUser, state } = useGameContext();

  if (state.authMode !== 'logged_in' || !currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center">
          <Users className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Social Hub</h2>
        <p className="text-gray-400 max-w-sm">Log in with a registered account to chat, add friends, and message players.</p>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'global' as SocialTab, label: 'Global Chat', icon: Globe },
    { id: 'friends' as SocialTab, label: 'Friends', icon: Users },
    { id: 'find' as SocialTab, label: 'Find People', icon: Search },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
      style={{ height: 'calc(100vh - 80px)' }}
    >
      <div className="mb-6">
        <h2 className="text-4xl font-bold tracking-tight text-white mb-2">Social Hub</h2>
        <p className="text-gray-400 text-lg">Chat with players and manage your friends.</p>
      </div>

      <div className="flex-1 bg-[#1a1a1a] rounded-2xl border border-white/5 flex flex-col overflow-hidden min-h-0">
        <div className="flex border-b border-white/5 flex-shrink-0">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  active
                    ? 'border-violet-500 text-violet-400 bg-violet-500/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {tab === 'global' && (
              <motion.div key="global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
                <GlobalChat myUserId={currentUser.id} />
              </motion.div>
            )}
            {tab === 'friends' && (
              <motion.div key="friends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
                <FriendsTab myUserId={currentUser.id} />
              </motion.div>
            )}
            {tab === 'find' && (
              <motion.div key="find" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
                <FindPeopleTab myUserId={currentUser.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
