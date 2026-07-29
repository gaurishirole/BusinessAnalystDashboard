import { query } from './db.js';

async function initCalendar() {
  try {
    console.log('Checking/creating calendar_events table...');
    
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        color VARCHAR(50) DEFAULT '#3b82f6',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('calendar_events table verified/created.');

    // Check if table is empty
    const checkEmpty = await query('SELECT COUNT(*) FROM calendar_events;');
    const count = parseInt(checkEmpty.rows[0].count, 10);
    
    if (count === 0) {
      console.log('Seeding initial calendar events...');
      await query(`
        INSERT INTO calendar_events (title, description, start_date, end_date, color) VALUES
        ('Strategy Alignment Meeting', 'Discuss Q3 goals and milestones with leadership team.', '2026-07-30T10:00:00Z', '2026-07-30T11:30:00Z', '#3b82f6'),
        ('Product Demo & Feedback', 'Walkthrough of the new analytics charts with client representatives.', '2026-07-31T14:00:00Z', '2026-07-31T15:00:00Z', '#10b981'),
        ('Weekly Team Sync', 'Check-in on ongoing engineering tasks and blockers.', '2026-07-28T09:00:00Z', '2026-07-28T10:00:00Z', '#f59e0b'),
        ('Monthly Operations Review', 'Review financial and operational metrics for the previous month.', '2026-07-25T13:00:00Z', '2026-07-25T15:00:00Z', '#ef4444');
      `);
      console.log('Initial calendar events seeded.');
    } else {
      console.log(`calendar_events table already has ${count} records. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error during calendar table initialization:', error);
  } finally {
    process.exit(0);
  }
}

initCalendar();
