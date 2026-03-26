import { Router, Response } from 'express';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../auth.js';

const router = Router();

router.get('/:gameId', requireAuth, async (req: AuthRequest, res: Response) => {
  const { gameId } = req.params;
  try {
    const result = await pool.query(
      'SELECT progress, playtime_seconds, updated_at FROM game_progress WHERE user_id = $1 AND game_id = $2',
      [req.userId, gameId]
    );
    if (result.rowCount === 0) {
      return res.json({ progress: null });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Progress get error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:gameId', requireAuth, async (req: AuthRequest, res: Response) => {
  const { gameId } = req.params;
  const { progress, playtimeSeconds } = req.body;
  if (!progress) return res.status(400).json({ error: 'Progress data is required' });
  try {
    const result = await pool.query(
      `INSERT INTO game_progress (user_id, game_id, progress, playtime_seconds)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, game_id) DO UPDATE SET
         progress = EXCLUDED.progress,
         playtime_seconds = EXCLUDED.playtime_seconds,
         updated_at = NOW()
       RETURNING *`,
      [req.userId, gameId, JSON.stringify(progress), playtimeSeconds || 0]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Progress save error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT game_id, progress, playtime_seconds, updated_at FROM game_progress WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.userId]
    );
    return res.json({ games: result.rows });
  } catch (err) {
    console.error('All progress get error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
