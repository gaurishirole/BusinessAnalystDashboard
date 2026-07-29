import { query } from '../database/db.js';

export const getReportData = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (startDate) {
      whereClauses.push(`o.date >= $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      whereClauses.push(`o.date <= $${paramIndex}`);
      params.push(endDate);
      paramIndex++;
    }
    if (category && category !== 'All' && category !== '') {
      whereClauses.push(`p.name = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // 1. KPI Cards (Revenue, Orders, Customers, Profit)
    // We filter by Completed status for financial KPI metrics where appropriate
    const kpiQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.amount ELSE 0 END), 0) AS total_revenue,
        COUNT(CASE WHEN o.status = 'Completed' THEN 1 END) AS total_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'Completed' THEN o.customer_id END) AS total_customers
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ${whereString}
    `;
    const kpiResult = await query(kpiQuery, params);
    const totalRevenue = parseFloat(kpiResult.rows[0].total_revenue);
    const totalOrders = parseInt(kpiResult.rows[0].total_orders, 10);
    const totalCustomers = parseInt(kpiResult.rows[0].total_customers, 10);
    const totalProfit = parseFloat((totalRevenue * 0.45).toFixed(2)); // Assume 45% profit margin

    // 2. Revenue Chart Data (Grouped by month name or date depending on range)
    const revenueChartQuery = `
      SELECT 
        TO_CHAR(o.date, 'Mon YYYY') as name,
        DATE_TRUNC('month', o.date) as month_date,
        COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.amount ELSE 0 END), 0)::float as revenue,
        COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.amount * 0.55 ELSE 0 END), 0)::float as expenses
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ${whereString}
      GROUP BY TO_CHAR(o.date, 'Mon YYYY'), DATE_TRUNC('month', o.date)
      ORDER BY month_date ASC
    `;
    const revenueChartResult = await query(revenueChartQuery, params);

    // 3. Sales Report Table (List of orders with details)
    const salesTableQuery = `
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
      ${whereString}
      ORDER BY o.date DESC, o.created_at DESC
    `;
    const salesTableResult = await query(salesTableQuery, params);
    const salesReportTable = salesTableResult.rows.map(row => ({
      id: row.id,
      customer: row.customer || 'Unknown Customer',
      product: row.product || 'Unknown Product',
      date: row.date,
      amount: `$${parseFloat(row.amount).toFixed(2)}`,
      status: row.status
    }));

    // 4. Product Performance Data
    const productPerfQuery = `
      SELECT 
        p.name,
        COUNT(o.id) as sales,
        COALESCE(SUM(o.amount), 0)::float as revenue
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ${whereString}
      GROUP BY p.name
      ORDER BY revenue DESC
    `;
    const productPerfResult = await query(productPerfQuery, params);
    const productPerformance = productPerfResult.rows.map(row => ({
      name: row.name || 'Unknown Product',
      sales: parseInt(row.sales, 10),
      revenue: row.revenue
    }));

    // 5. Customer Analytics Data
    const customerAnalQuery = `
      SELECT 
        c.name,
        COUNT(o.id) as orders_count,
        COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.amount ELSE 0 END), 0)::float as total_spent
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      ${whereString}
      GROUP BY c.name
      ORDER BY total_spent DESC
      LIMIT 10
    `;
    const customerAnalResult = await query(customerAnalQuery, params);
    const customerAnalytics = customerAnalResult.rows.map(row => ({
      name: row.name || 'Unknown Customer',
      ordersCount: parseInt(row.orders_count, 10),
      totalSpent: row.total_spent
    }));

    // 6. Order Status Chart Data
    const orderStatusQuery = `
      SELECT 
        o.status as name,
        COUNT(o.id) as value
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ${whereString}
      GROUP BY o.status
    `;
    const orderStatusResult = await query(orderStatusQuery, params);
    const statusColorMap = {
      'Completed': '#10b981',
      'Pending': '#f59e0b',
      'Cancelled': '#ef4444',
      'Refunded': '#3b82f6'
    };
    const orderStatusData = orderStatusResult.rows.map(row => ({
      name: row.name,
      value: parseInt(row.value, 10),
      color: statusColorMap[row.name] || '#6b7280'
    }));

    // Get categories list for category selector
    const categoriesResult = await query('SELECT DISTINCT name FROM products');
    const categories = ['All', ...categoriesResult.rows.map(row => row.name)];

    res.json({
      success: true,
      data: {
        kpis: {
          revenue: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          orders: totalOrders.toLocaleString('en-US'),
          customers: totalCustomers.toLocaleString('en-US'),
          profit: `$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        },
        revenueChart: revenueChartResult.rows,
        salesReportTable,
        productPerformance,
        customerAnalytics,
        orderStatusData,
        categories
      }
    });

  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
