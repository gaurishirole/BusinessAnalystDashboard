import { query } from '../database/db.js';

export const getCustomers = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.id, 
        c.name, 
        c.email, 
        c.company, 
        c.status,
        COALESCE(SUM(o.amount), 0)::float AS spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY spent DESC
    `);

    const formattedCustomers = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company,
      status: row.status,
      spent: `$${parseFloat(row.spent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }));

    res.json(formattedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
