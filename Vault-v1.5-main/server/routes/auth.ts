import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { signToken, requireAuth, AuthRequest } from '../auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ error: 'Username must be 3-30 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username]
    );
    if (existing.rowCount! > 0) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, profile_pic_url, profile_banner, bio, name_color, coins, xp, level, streak, is_admin, is_owner, created_at`,
      [username, email.toLowerCase(), passwordHash]
    );
    const user = result.rows[0];
    await pool.query(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [user.id]
    );
    const token = signToken(user.id, user.username);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );
    return res.status(201).json({ token, user });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: 'Email/username and password are required' });
  }
  try {
    const result = await pool.query(
      `SELECT id, username, email, password_hash, profile_pic_url, profile_banner, bio, name_color, coins, xp, level, streak, last_login_date, is_admin, is_owner
       FROM users WHERE email = $1 OR LOWER(username) = $1`,
      [emailOrUsername.toLowerCase()]
    );
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = user.streak;
    if (user.last_login_date === yesterday) {
      newStreak = user.streak + 1;
    } else if (user.last_login_date !== today) {
      newStreak = 1;
    }
    await pool.query(
      'UPDATE users SET streak = $1, last_login_date = $2, updated_at = NOW() WHERE id = $3',
      [newStreak, today, user.id]
    );
    user.streak = newStreak;
    delete user.password_hash;
    const token = signToken(user.id, user.username);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );
    return res.json({ token, user });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  const token = req.headers.authorization?.slice(7);
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  return res.json({ success: true });
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.profile_pic_url, u.profile_banner, u.bio, u.name_color,
              u.coins, u.xp, u.level, u.streak, u.is_admin, u.is_owner, u.created_at,
              p.language, p.notifications_enabled, p.sound_enabled, p.music_enabled, p.theme, p.extras
       FROM users u
       LEFT JOIN user_preferences p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
