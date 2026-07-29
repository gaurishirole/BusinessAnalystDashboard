import { query } from '../database/db.js';

export const getProducts = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, 
        name, 
        sales, 
        (price * sales)::float AS revenue, 
        rating::float AS rating 
      FROM products 
      ORDER BY sales DESC
    `);

    const formattedProducts = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      sales: row.sales,
      revenue: `$${parseFloat(row.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      rating: parseFloat(row.rating || 0)
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
