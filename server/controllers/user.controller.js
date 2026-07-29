import { query } from '../database/db.js';

export const getUsers = async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, status, avatar FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  const { id, name, email, role, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  try {
    const userId = id || 1;
    const result = await query(
      `UPDATE users 
       SET name = $1, email = $2, role = COALESCE($3, role), avatar = COALESCE($4, avatar), updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, name, email, role, status, avatar`,
      [name, email, role, avatar, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
