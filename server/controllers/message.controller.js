import { query } from '../database/db.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const result = await query('SELECT * FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new message (POST)
export const createMessage = async (req, res) => {
  const { sender, email, subject, content, folder, date_str } = req.body;
  
  if (!sender || !email || !subject || !content) {
    return res.status(400).json({ error: 'Sender, email, subject, and content are required' });
  }

  try {
    const result = await query(
      `INSERT INTO messages (sender, email, subject, content, status, folder, date_str) 
       VALUES ($1, $2, $3, $4, 'Read', $5, $6) 
       RETURNING *`,
      [sender, email, subject, content, folder || 'Sent', date_str || 'Just now']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `UPDATE messages 
       SET status = 'Read', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update message folder (e.g. Move to Trash / Sent / Inbox)
export const updateMessageFolder = async (req, res) => {
  const { id } = req.params;
  const { folder } = req.body;

  if (!folder) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  try {
    const result = await query(
      `UPDATE messages 
       SET folder = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [folder, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating message folder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
