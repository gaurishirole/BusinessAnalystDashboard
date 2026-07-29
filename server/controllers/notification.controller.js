import { query } from '../database/db.js';

// Get all notifications
export const getNotifications = async (req, res) => {
  try {
    const result = await query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  const { title, message, type, user_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type, is_read) 
       VALUES ($1, $2, $3, $4, false) 
       RETURNING *`,
      [user_id || 1, title || 'Notification', message, type || 'info']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      `UPDATE notifications 
       SET is_read = true, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP');
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully', notification: result.rows[0] });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
