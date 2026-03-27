import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../auth.js';

const router = Router();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.put('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { username, bio, nameColor, profileBanner } = req.body;
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let i = 1;
    if (username !== undefined) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be 3-30 characters' });
      }
      const taken = await pool.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, req.userId]);
      if (taken.rowCount! > 0) return res.status(409).json({ error: 'Username already taken' });
      updates.push(`username = $${i++}`); values.push(username);
    }
    if (bio !== undefined) { updates.push(`bio = $${i++}`); values.push(bio); }
    if (nameColor !== undefined) { updates.push(`name_color = $${i++}`); values.push(nameColor); }
    if (profileBanner !== undefined) { updates.push(`profile_banner = $${i++}`); values.push(profileBanner); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    updates.push(`updated_at = NOW()`);
    values.push(req.userId);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, username, email, profile_pic_url, profile_banner, bio, name_color, coins, xp, level, streak, is_admin, is_owner`,
      values
    );
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/picture', requireAuth, upload.single('picture'), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded or invalid file type' });
  const picUrl = `/uploads/${req.file.filename}`;
  try {
    const result = await pool.query(
      'UPDATE users SET profile_pic_url = $1, updated_at = NOW() WHERE id = $2 RETURNING profile_pic_url',
      [picUrl, req.userId]
    );
    return res.json({ profilePicUrl: result.rows[0].profile_pic_url });
  } catch (err) {
    console.error('Picture upload error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/preferences', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [req.userId]
    );
    return res.json({ preferences: result.rows[0] || {} });
  } catch (err) {
    console.error('Preferences get error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/preferences', requireAuth, async (req: AuthRequest, res: Response) => {
  const { language, notificationsEnabled, soundEnabled, musicEnabled, theme, extras } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_preferences (user_id, language, notifications_enabled, sound_enabled, music_enabled, theme, extras)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
         language = COALESCE(EXCLUDED.language, user_preferences.language),
         notifications_enabled = COALESCE(EXCLUDED.notifications_enabled, user_preferences.notifications_enabled),
         sound_enabled = COALESCE(EXCLUDED.sound_enabled, user_preferences.sound_enabled),
         music_enabled = COALESCE(EXCLUDED.music_enabled, user_preferences.music_enabled),
         theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
         extras = COALESCE(EXCLUDED.extras, user_preferences.extras),
         updated_at = NOW()
       RETURNING *`,
      [req.userId, language, notificationsEnabled, soundEnabled, musicEnabled, theme, extras ? JSON.stringify(extras) : null]
    );
    return res.json({ preferences: result.rows[0] });
  } catch (err) {
    console.error('Preferences update error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/game-state', requireAuth, async (req: AuthRequest, res: Response) => {
  const { coins, xp, level, streak, progressJson } = req.body;
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let i = 1;
    if (coins !== undefined) { updates.push(`coins = $${i++}`); values.push(coins); }
    if (xp !== undefined) { updates.push(`xp = $${i++}`); values.push(xp); }
    if (level !== undefined) { updates.push(`level = $${i++}`); values.push(level); }
    if (streak !== undefined) { updates.push(`streak = $${i++}`); values.push(streak); }
    if (progressJson !== undefined) { updates.push(`progress_json = $${i++}`); values.push(JSON.stringify(progressJson)); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    updates.push(`updated_at = NOW()`);
    values.push(req.userId);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${i}`, values);
    return res.json({ success: true });
  } catch (err) {
    console.error('Game state sync error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
