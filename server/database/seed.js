import { query } from './db.js';

async function seed() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (orders, notifications, products, customers, calendar_events)
    await query('TRUNCATE TABLE notifications, orders, products, customers, calendar_events CASCADE;');
    console.log('Cleared existing notifications, orders, products, customers, and calendar_events.');

    // 1. Insert Customers
    const customerInsert = await query(`
      INSERT INTO customers (name, email, phone, company, status) VALUES
      ('Jane Cooper', 'jane@cooper.com', '+1-555-0100', 'Cooper Inc', 'Active'),
      ('Cody Fisher', 'cody@fisher.com', '+1-555-0101', 'Fisher Labs', 'Active'),
      ('Esther Howard', 'esther@howard.com', '+1-555-0102', 'Howard Corp', 'Active'),
      ('Jenny Wilson', 'jenny@wilson.com', '+1-555-0103', 'Wilson Ltd', 'Active'),
      ('Kristin Watson', 'kristin@watson.com', '+1-555-0104', 'Watson Media', 'Active')
      RETURNING id, name;
    `);
    const customers = customerInsert.rows;
    console.log(`Inserted ${customers.length} customers.`);

    // 2. Insert Products
    const productInsert = await query(`
      INSERT INTO products (name, description, price, stock, sales, rating, category) VALUES
      ('SaaS Core Platform', 'Core subscription for our SaaS dashboard platform', 50.00, 1000, 842, 4.8, 'Software'),
      ('Advanced Reporting Add-on', 'Enables deep analytics and PDF reporting exports', 25.00, 500, 412, 4.5, 'Add-ons'),
      ('Team Collaboration Suite', 'Collaboration tools for teams up to 20 users', 30.00, 300, 310, 4.2, 'Software'),
      ('Premium Theme Developer Kit', 'Developer-focused kits and styling components', 30.00, 200, 185, 4.9, 'Themes')
      RETURNING id, name, price;
    `);
    const products = productInsert.rows;
    console.log(`Inserted ${products.length} products.`);

    // 3. Insert Orders (realistic list)
    // Distributed over months to get nice monthly charts (Jan - Dec 2026/2025)
    // Also include recent ones for Recent Orders and Weekly Sales
    // Status can be 'Completed', 'Pending', 'Cancelled'
    const ordersData = [
      { id: 'ORD-001', customerIdx: 0, productIdx: 0, date: '2026-07-29', amount: 120.00, status: 'Completed' },
      { id: 'ORD-002', customerIdx: 1, productIdx: 1, date: '2026-07-28', amount: 360.00, status: 'Pending' },
      { id: 'ORD-003', customerIdx: 2, productIdx: 2, date: '2026-07-28', amount: 150.00, status: 'Cancelled' },
      { id: 'ORD-004', customerIdx: 3, productIdx: 0, date: '2026-07-27', amount: 1200.00, status: 'Completed' },
      { id: 'ORD-005', customerIdx: 4, productIdx: 3, date: '2026-07-26', amount: 99.00, status: 'Completed' },
      { id: 'ORD-006', customerIdx: 0, productIdx: 1, date: '2026-06-15', amount: 250.00, status: 'Completed' },
      { id: 'ORD-007', customerIdx: 1, productIdx: 2, date: '2026-05-20', amount: 180.00, status: 'Completed' },
      { id: 'ORD-008', customerIdx: 2, productIdx: 0, date: '2026-04-12', amount: 300.00, status: 'Completed' },
      { id: 'ORD-009', customerIdx: 3, productIdx: 3, date: '2026-03-08', amount: 900.00, status: 'Completed' },
      { id: 'ORD-010', customerIdx: 4, productIdx: 0, date: '2026-02-14', amount: 450.00, status: 'Completed' },
      { id: 'ORD-011', customerIdx: 0, productIdx: 2, date: '2026-01-10', amount: 600.00, status: 'Completed' },
      { id: 'ORD-012', customerIdx: 1, productIdx: 1, date: '2026-07-25', amount: 200.00, status: 'Completed' },
      { id: 'ORD-013', customerIdx: 2, productIdx: 0, date: '2026-07-24', amount: 150.00, status: 'Completed' },
      { id: 'ORD-014', customerIdx: 3, productIdx: 2, date: '2026-07-23', amount: 310.00, status: 'Completed' },
      { id: 'ORD-015', customerIdx: 4, productIdx: 3, date: '2026-07-22', amount: 180.00, status: 'Completed' },
    ];

    for (const o of ordersData) {
      await query(`
        INSERT INTO orders (id, customer_id, product_id, date, amount, status) VALUES
        ($1, $2, $3, $4, $5, $6)
      `, [
        o.id,
        customers[o.customerIdx].id,
        products[o.productIdx].id,
        o.date,
        o.amount,
        o.status
      ]);
    }
    console.log(`Inserted ${ordersData.length} orders.`);

    // 4. Insert Notifications / Administrative events
    // Link to Admin user (id = 1)
    await query(`
      INSERT INTO notifications (user_id, title, message, is_read, type, created_at) VALUES
      (1, 'New Order', 'New order received from Jane Cooper ($120.00)', false, 'info', NOW() - INTERVAL '2 minutes'),
      (1, 'System Backup', 'Weekly system backup completed successfully', false, 'success', NOW() - INTERVAL '2 hours'),
      (1, 'Billing Warning', 'Billing card expiring soon', true, 'warning', NOW() - INTERVAL '1 day')
    `);
    console.log('Inserted notifications.');

    // 5. Insert Calendar Events
    await query(`
      INSERT INTO calendar_events (title, description, start_date, end_date, color) VALUES
      ('Strategy Alignment Meeting', 'Discuss Q3 goals and milestones with leadership team.', '2026-07-30T10:00:00Z', '2026-07-30T11:30:00Z', '#3b82f6'),
      ('Product Demo & Feedback', 'Walkthrough of the new analytics charts with client representatives.', '2026-07-31T14:00:00Z', '2026-07-31T15:00:00Z', '#10b981'),
      ('Weekly Team Sync', 'Check-in on ongoing engineering tasks and blockers.', '2026-07-28T09:00:00Z', '2026-07-28T10:00:00Z', '#f59e0b'),
      ('Monthly Operations Review', 'Review financial and operational metrics for the previous month.', '2026-07-25T13:00:00Z', '2026-07-25T15:00:00Z', '#ef4444')
    `);
    console.log('Inserted calendar events.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    process.exit(0);
  }
}

seed();
