import { query } from './db.js';

async function initMessages() {
  try {
    console.log('Checking/creating messages table...');
    
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Unread',
        folder VARCHAR(50) NOT NULL DEFAULT 'Inbox',
        date_str VARCHAR(100) DEFAULT 'Today',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('messages table verified/created.');

    // Check if table is empty
    const checkEmpty = await query('SELECT COUNT(*) FROM messages;');
    const count = parseInt(checkEmpty.rows[0].count, 10);
    
    if (count === 0) {
      console.log('Seeding initial messages...');
      
      // We will seed the 3 main messages + dummy ones to preserve counts:
      // Inbox: 12 (Admin, Rahul, Priya + 9 dummies)
      // Sent: 8 (8 dummies)
      // Drafts: 2 (2 dummies)
      // Trash: 1 (1 dummy)
      
      // Seed Main Inbox items
      await query(`
        INSERT INTO messages (sender, email, subject, content, status, folder, date_str) VALUES
        ('Admin', 'admin@company.com', 'Monthly Report', 'Dear Team, Please find attached the monthly analytics report for July 2026. The dashboard has registered a 15% increase in total revenue compared to last month. Feel free to review the charts and share your feedback. Best, Admin.', 'Unread', 'Inbox', 'Today'),
        ('Rahul', 'rahul@company.com', 'Stock Update', 'Hey, just a quick update on the warehouse stocks. Most items in the top product categories are fully stocked, but we need to reorder item code #4082 before the weekend sales peak. Thanks, Rahul.', 'Read', 'Inbox', 'Yesterday'),
        ('Priya', 'priya@company.com', 'Sales Analysis', 'Hi, I finished analyzing the weekly sales figures. The conversion rate looks great for organic search traffic. However, paid campaigns have a slightly higher bounce rate. I''ll present this in the meeting on Friday. Regards, Priya.', 'Read', 'Inbox', 'Monday')
      `);

      // Seed 9 more Inbox items
      for (let i = 1; i <= 9; i++) {
        await query(`
          INSERT INTO messages (sender, email, subject, content, status, folder, date_str) VALUES
          ($1, $2, $3, $4, 'Read', 'Inbox', '3 days ago')
        `, [
          `Client Partner ${i}`, 
          `partner${i}@external.com`, 
          `Business Inquiry - Phase ${i}`, 
          `Hello, we would like to schedule a call to discuss the integration details. Let us know if you are free this week. Thanks, Client Partner ${i}.`
        ]);
      }

      // Seed 8 Sent items
      for (let i = 1; i <= 8; i++) {
        await query(`
          INSERT INTO messages (sender, email, subject, content, status, folder, date_str) VALUES
          ('Me', $1, $2, $3, 'Read', 'Sent', $4)
        `, [
          `customer${i}@example.com`, 
          `Reply to Ticket #${1024 + i}`, 
          `Hi there, we have resolved your query. Please let us know if you need further assistance. Regards.`,
          `${i} days ago`
        ]);
      }

      // Seed 2 Drafts items
      await query(`
        INSERT INTO messages (sender, email, subject, content, status, folder, date_str) VALUES
        ('Draft', 'draft@company.com', 'Quarterly projections draft', 'The following are the estimated growth figures for the next three quarters...', 'Read', 'Drafts', '4 days ago'),
        ('Draft', 'draft@company.com', 'Feedback response outline', 'Draft outline of the response to user complaints regarding load times.', 'Read', 'Drafts', '5 days ago')
      `);

      // Seed 1 Trash item
      await query(`
        INSERT INTO messages (sender, email, subject, content, status, folder, date_str) VALUES
        ('Spam System', 'spammer@junkmail.net', 'Win a free vacation!', 'Congratulations! You have been selected to win a free cruise. Click here to claim.', 'Read', 'Trash', '1 week ago')
      `);

      console.log('Initial messages seeded.');
    } else {
      console.log(`messages table already has ${count} records. Skipping seed.`);
    }
  } catch (error) {
    console.error('Error during messages table initialization:', error);
  } finally {
    process.exit(0);
  }
}

initMessages();
