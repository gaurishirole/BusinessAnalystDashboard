import { query } from '../database/db.js';

export const getOrders = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        o.id, 
        c.name AS customer, 
        p.name AS product, 
        TO_CHAR(o.date, 'YYYY-MM-DD') AS date, 
        o.amount, 
        o.status 
      FROM orders o 
      LEFT JOIN customers c ON o.customer_id = c.id 
      LEFT JOIN products p ON o.product_id = p.id 
      ORDER BY o.date DESC, o.created_at DESC
    `);

    const formattedOrders = result.rows.map(row => ({
      id: row.id,
      customer: row.customer || 'Unknown Customer',
      product: row.product || 'Unknown Product',
      date: row.date,
      amount: `$${parseFloat(row.amount).toFixed(2)}`,
      status: row.status
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
