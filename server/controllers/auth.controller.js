import { query } from '../database/db.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    if (user.status !== 'Active') {
      return res.status(403).json({ success: false, error: 'Your account is suspended or inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
