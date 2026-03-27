const API_BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('vault_token');
}

export function setToken(token: string) {
  localStorage.setItem('vault_token', token);
}

export function removeToken() {
  localStorage.removeItem('vault_token');
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm = false
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  postForm: <T>(path: string, form: FormData) => request<T>('POST', path, form, true),
};

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile_pic_url: string | null;
  profile_banner: string | null;
  bio: string;
  name_color: string;
  coins: number;
  xp: number;
  level: number;
  streak: number;
  is_admin: boolean;
  is_owner: boolean;
  created_at: string;
  progress_json?: Record<string, unknown> | null;
  language?: string;
  notifications_enabled?: boolean;
  sound_enabled?: boolean;
  music_enabled?: boolean;
  theme?: string;
  extras?: Record<string, unknown>;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const authApi = {
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }),

  login: (emailOrUsername: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { emailOrUsername, password }),

  logout: () => api.post<{ success: boolean }>('/auth/logout'),

  me: () => api.get<{ user: UserProfile }>('/auth/me'),
};

export const profileApi = {
  update: (data: { username?: string; bio?: string; nameColor?: string; profileBanner?: string }) =>
    api.put<{ user: UserProfile }>('/profile', data),

  uploadPicture: (file: File) => {
    const form = new FormData();
    form.append('picture', file);
    return api.postForm<{ profilePicUrl: string }>('/profile/picture', form);
  },

  getPreferences: () => api.get<{ preferences: Record<string, unknown> }>('/profile/preferences'),

  updatePreferences: (prefs: Record<string, unknown>) =>
    api.put<{ preferences: Record<string, unknown> }>('/profile/preferences', prefs),

  syncGameState: (data: { coins?: number; xp?: number; level?: number; streak?: number; progressJson?: Record<string, unknown> }) =>
    api.put<{ success: boolean }>('/profile/game-state', data),

  getPublicProfile: (userId: number) =>
    api.get<{ user: UserProfile }>(`/social/profile/${userId}`),
};

export const socialApi = {
  search: (q: string) => api.get<{ users: UserProfile[] }>(`/social/search?q=${encodeURIComponent(q)}`),
  getFriends: () => api.get<{ friendships: FriendshipRow[] }>('/social/friends'),
  sendRequest: (addresseeId: number) => api.post<{ friendship: FriendshipRow }>('/social/request', { addresseeId }),
  respondToRequest: (id: number, action: 'accept' | 'decline' | 'remove') =>
    api.put<{ friendship?: FriendshipRow; success?: boolean }>(`/social/request/${id}`, { action }),
};

export const chatApi = {
  getGlobal: () => api.get<{ messages: ChatMessage[] }>('/chat/global'),
  sendGlobal: (message: string) => api.post<{ message: ChatMessage }>('/chat/global', { message }),
  getDM: (friendId: number) => api.get<{ messages: ChatMessage[] }>(`/chat/dm/${friendId}`),
  sendDM: (friendId: number, message: string) => api.post<{ message: ChatMessage }>(`/chat/dm/${friendId}`, { message }),
  getUnread: () => api.get<{ unread: { sender_id: number; count: number }[] }>('/chat/unread'),
};

export interface ChatMessage {
  id: number;
  user_id?: number;
  sender_id?: number;
  receiver_id?: number;
  username?: string;
  sender_username?: string;
  name_color?: string;
  sender_color?: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

export interface FriendshipRow {
  friendship_id: number;
  status: 'pending' | 'accepted' | 'declined';
  requester_id: number;
  addressee_id: number;
  friend_id: number;
  friend_username: string;
  friend_pic: string | null;
  friend_color: string;
  friend_level: number;
}

export const progressApi = {
  get: (gameId: string) =>
    api.get<{ progress: Record<string, unknown> | null; playtime_seconds?: number }>(`/progress/${gameId}`),

  save: (gameId: string, progress: Record<string, unknown>, playtimeSeconds?: number) =>
    api.put(`/progress/${gameId}`, { progress, playtimeSeconds }),

  getAll: () =>
    api.get<{ games: Array<{ game_id: string; progress: Record<string, unknown>; playtime_seconds: number; updated_at: string }> }>('/progress'),
};
