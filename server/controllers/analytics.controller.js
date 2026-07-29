import { query } from '../database/db.js';

export const getAnalyticsStats = async (req, res) => {
  try {
    // ----------------------------------------------------
    // 1. Sales Analytics
    // ----------------------------------------------------
    
    // Daily Sales (completed orders today)
    const dailyResult = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
      FROM orders
      WHERE status = 'Completed' AND date = CURRENT_DATE
    `);
    const dailySales = {
      amount: parseFloat(dailyResult.rows[0].total),
      count: parseInt(dailyResult.rows[0].count, 10)
    };

    // Weekly Sales (completed orders this week)
    const weeklyResult = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
      FROM orders
      WHERE status = 'Completed' AND date >= DATE_TRUNC('week', CURRENT_DATE)
    `);
    const weeklySales = {
      amount: parseFloat(weeklyResult.rows[0].total),
      count: parseInt(weeklyResult.rows[0].count, 10)
    };

    // Monthly Sales (completed orders this month)
    const monthlyResult = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
      FROM orders
      WHERE status = 'Completed' AND date >= DATE_TRUNC('month', CURRENT_DATE)
    `);
    const monthlySales = {
      amount: parseFloat(monthlyResult.rows[0].total),
      count: parseInt(monthlyResult.rows[0].count, 10)
    };

    // Yearly Sales (completed orders this year)
    const yearlyResult = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
      FROM orders
      WHERE status = 'Completed' AND date >= DATE_TRUNC('year', CURRENT_DATE)
    `);
    const yearlySales = {
      amount: parseFloat(yearlyResult.rows[0].total),
      count: parseInt(yearlyResult.rows[0].count, 10)
    };

    // Revenue Growth % (comparing this month vs last month)
    const lastMonthResult = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM orders
      WHERE status = 'Completed'
        AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        AND date < DATE_TRUNC('month', CURRENT_DATE)
    `);
    const lastMonthRevenue = parseFloat(lastMonthResult.rows[0].total);
    const thisMonthRevenue = monthlySales.amount;
    let revenueGrowthPercent = 0;
    if (lastMonthRevenue > 0) {
      revenueGrowthPercent = parseFloat(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2));
    } else if (thisMonthRevenue > 0) {
      revenueGrowthPercent = 100; // 100% growth if there was no revenue last month
    }

    // Sales Target Achievement (yearly target: $10,000)
    const yearlyTarget = 10000.00;
    const targetAchievementPercent = parseFloat(((yearlySales.amount / yearlyTarget) * 100).toFixed(2));

    const salesAnalytics = {
      dailySales,
      weeklySales,
      monthlySales,
      yearlySales,
      revenueGrowthPercent,
      salesTargetAchievement: {
        target: yearlyTarget,
        current: yearlySales.amount,
        percent: Math.min(targetAchievementPercent, 100) // capped at 100 for gauge/progress bar display if needed, but return actual
      }
    };

    // ----------------------------------------------------
    // 2. Customer Analytics
    // ----------------------------------------------------

    // Total Customers
    const totalCustomersResult = await query("SELECT COUNT(*)::int AS count FROM customers");
    const totalCustomers = totalCustomersResult.rows[0].count;

    // New Customers (registered in the last 30 days)
    const newCustomersResult = await query(`
      SELECT COUNT(*)::int AS count
      FROM customers
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    const newCustomers = newCustomersResult.rows[0].count;

    // Returning Customers (customers who placed > 1 order)
    const returningCustomersResult = await query(`
      SELECT COUNT(*)::int AS count FROM (
        SELECT customer_id
        FROM orders
        WHERE customer_id IS NOT NULL
        GROUP BY customer_id
        HAVING COUNT(id) > 1
      ) AS subquery
    `);
    const returningCustomers = returningCustomersResult.rows[0].count;

    // Customer Retention Rate: (Returning / Total) * 100
    const customerRetentionRate = totalCustomers > 0 
      ? parseFloat(((returningCustomers / totalCustomers) * 100).toFixed(2))
      : 0;

    // Active Customers (placed at least 1 order in the last 30 days)
    const activeCustomersResult = await query(`
      SELECT COUNT(DISTINCT customer_id)::int AS count
      FROM orders
      WHERE date >= CURRENT_DATE - INTERVAL '30 days' AND customer_id IS NOT NULL
    `);
    const activeCustomers = activeCustomersResult.rows[0].count;

    // Customer Location (grouped by customer company/location)
    const customerLocationsResult = await query(`
      SELECT COALESCE(company, 'Individual') AS location, COUNT(*)::int AS count
      FROM customers
      GROUP BY company
      ORDER BY count DESC
    `);
    const customerLocations = customerLocationsResult.rows;

    const customerAnalytics = {
      totalCustomers,
      newCustomers,
      returningCustomers,
      customerRetentionRate,
      activeCustomers,
      customerLocations
    };

    // ----------------------------------------------------
    // 3. Product Analytics
    // ----------------------------------------------------

    // Top Selling Products (by sales count)
    const topSellingResult = await query(`
      SELECT id, name, sales, price::float, (price * sales)::float AS revenue
      FROM products
      ORDER BY sales DESC
      LIMIT 5
    `);
    const topSellingProducts = topSellingResult.rows;

    // Least Selling Products
    const leastSellingResult = await query(`
      SELECT id, name, sales, price::float, (price * sales)::float AS revenue
      FROM products
      ORDER BY sales ASC
      LIMIT 5
    `);
    const leastSellingProducts = leastSellingResult.rows;

    // Product Performance
    const prodPerfResult = await query(`
      SELECT p.id, p.name, p.category, COUNT(o.id)::int AS orders_count, COALESCE(SUM(o.amount), 0)::float AS revenue
      FROM products p
      LEFT JOIN orders o ON p.id = o.product_id AND o.status = 'Completed'
      GROUP BY p.id, p.name, p.category
      ORDER BY revenue DESC
    `);
    const productPerformance = prodPerfResult.rows;

    // Inventory Turnover: Cost of Goods Sold (approx 55% of sales revenue) / Average Inventory (price * stock)
    // For simplicity: sales / stock ratio
    const invTurnoverResult = await query(`
      SELECT id, name, stock, sales,
        CASE WHEN stock > 0 THEN ROUND((sales::float / stock::float)::numeric, 2)::float ELSE sales::float END AS turnover_ratio
      FROM products
      ORDER BY turnover_ratio DESC
    `);
    const inventoryTurnover = invTurnoverResult.rows;

    const productAnalytics = {
      topSellingProducts,
      leastSellingProducts,
      productPerformance,
      inventoryTurnover
    };

    // ----------------------------------------------------
    // 4. Financial Analytics
    // ----------------------------------------------------

    // Gross Revenue (all completed orders)
    const grossRevResult = await query("SELECT COALESCE(SUM(amount), 0) AS total FROM orders WHERE status = 'Completed'");
    const grossRevenue = parseFloat(grossRevResult.rows[0].total);

    // Total Expenses (approx 55% of completed order revenue)
    const totalExpenses = parseFloat((grossRevenue * 0.55).toFixed(2));

    // Net Profit
    const netProfit = parseFloat((grossRevenue - totalExpenses).toFixed(2));

    // Profit Margin
    const profitMargin = grossRevenue > 0
      ? parseFloat(((netProfit / grossRevenue) * 100).toFixed(2))
      : 0;

    // Tax Summary (assuming 15% tax on gross revenue)
    const taxSummary = parseFloat((grossRevenue * 0.15).toFixed(2));

    const financialAnalytics = {
      grossRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      taxSummary
    };

    // ----------------------------------------------------
    // 5. Chart Data
    // ----------------------------------------------------

    // Line Chart & Area Chart: Monthly Revenue Trend
    const monthlyRevResult = await query(`
      SELECT 
        TO_CHAR(date, 'Mon') as name,
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END), 0)::float as revenue,
        DATE_PART('month', date) as month_num
      FROM orders
      GROUP BY TO_CHAR(date, 'Mon'), DATE_PART('month', date)
      ORDER BY month_num ASC
    `);
    
    // Process running/cumulative total for Area Chart (Cumulative Revenue)
    let cumulative = 0;
    const monthlyTrendData = monthlyRevResult.rows.map(row => {
      cumulative += row.revenue;
      return {
        name: row.name,
        revenue: row.revenue,
        cumulativeRevenue: parseFloat(cumulative.toFixed(2)),
        expenses: parseFloat((row.revenue * 0.55).toFixed(2))
      };
    });

    // Bar Chart: Sales by Product Category
    const categorySalesResult = await query(`
      SELECT p.category AS name, COUNT(o.id)::int AS sales, COALESCE(SUM(o.amount), 0)::float AS revenue
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY p.category
      ORDER BY revenue DESC
    `);
    const categorySalesData = categorySalesResult.rows;

    // Donut Chart: Order Status Breakdown
    const orderStatusResult = await query(`
      SELECT status AS name, COUNT(*)::int AS value
      FROM orders
      GROUP BY status
    `);
    const orderStatusData = orderStatusResult.rows;

    // Pie Chart: New vs Returning Customers count
    const pieChartData = [
      { name: 'New Customers', value: newCustomers },
      { name: 'Returning Customers', value: returningCustomers }
    ];

    res.json({
      success: true,
      salesAnalytics,
      customerAnalytics,
      productAnalytics,
      financialAnalytics,
      charts: {
        monthlyTrendData,
        categorySalesData,
        orderStatusData,
        pieChartData
      }
    });

  } catch (error) {
    console.error('Error generating analytics stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
