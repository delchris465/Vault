import { Router, Response } from 'express';
import pool from '../db.js';
import { requireAuth, AuthRequest } from '../auth.js';

const router = Router();

router.get('/search', requireAuth, async (req: AuthRequest, res: Response) => {
  const q = (req.query.q as string || '').trim();
  if (!q || q.length < 2) return res.json({ users: [] });
  try {
    const result = await pool.query(
      `SELECT id, username, profile_pic_url, name_color, level
       FROM users
       WHERE username ILIKE $1 AND id != $2
       LIMIT 20`,
      [`%${q}%`, req.userId]
    );
    return res.json({ users: result.rows });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/friends', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         f.id as friendship_id,
         f.status,
         f.requester_id,
         f.addressee_id,
         CASE WHEN f.requester_id = $1 THEN u2.id ELSE u1.id END as friend_id,
         CASE WHEN f.requester_id = $1 THEN u2.username ELSE u1.username END as friend_username,
         CASE WHEN f.requester_id = $1 THEN u2.profile_pic_url ELSE u1.profile_pic_url END as friend_pic,
         CASE WHEN f.requester_id = $1 THEN u2.name_color ELSE u1.name_color END as friend_color,
         CASE WHEN f.requester_id = $1 THEN u2.level ELSE u1.level END as friend_level
       FROM friendships f
       JOIN users u1 ON u1.id = f.requester_id
       JOIN users u2 ON u2.id = f.addressee_id
       WHERE (f.requester_id = $1 OR f.addressee_id = $1)
       ORDER BY f.updated_at DESC`,
      [req.userId]
    );
    return res.json({ friendships: result.rows });
  } catch (err) {
    console.error('Friends list error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/request', requireAuth, async (req: AuthRequest, res: Response) => {
  const { addresseeId } = req.body;
  if (!addresseeId || addresseeId === req.userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  try {
    const existing = await pool.query(
      `SELECT id, status FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
      [req.userId, addresseeId]
    );
    if (existing.rowCount! > 0) {
      return res.status(409).json({ error: 'Friend request already exists', status: existing.rows[0].status });
    }
    const result = await pool.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [req.userId, addresseeId]
    );
    return res.status(201).json({ friendship: result.rows[0] });
  } catch (err) {
    console.error('Friend request error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/request/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { action } = req.body;
  if (!['accept', 'decline', 'remove'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }
  try {
    if (action === 'remove') {
      await pool.query(
        `DELETE FROM friendships
         WHERE id = $1 AND (requester_id = $2 OR addressee_id = $2)`,
        [id, req.userId]
      );
      return res.json({ success: true });
    }
    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    const result = await pool.query(
      `UPDATE friendships SET status = $1, updated_at = NOW()
       WHERE id = $2 AND addressee_id = $3
       RETURNING *`,
      [newStatus, id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    return res.json({ friendship: result.rows[0] });
  } catch (err) {
    console.error('Friend action error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
