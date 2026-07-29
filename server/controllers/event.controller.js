import { query } from '../database/db.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const result = await query('SELECT * FROM calendar_events ORDER BY start_date ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  const { title, description, start_date, end_date, color } = req.body;
  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'Title, start date, and end date are required' });
  }

  try {
    const result = await query(
      `INSERT INTO calendar_events (title, description, start_date, end_date, color) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [title, description, start_date, end_date, color || '#3b82f6']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, color } = req.body;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'Title, start date, and end date are required' });
  }

  try {
    const result = await query(
      `UPDATE calendar_events 
       SET title = $1, description = $2, start_date = $3, end_date = $4, color = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [title, description, start_date, end_date, color, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM calendar_events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully', event: result.rows[0] });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
