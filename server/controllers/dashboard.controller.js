import { query } from '../database/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // === 1. KPI Cards ===

    // Total Revenue (Completed orders amount)
    const revResult = await query("SELECT COALESCE(SUM(amount), 0) AS total FROM orders WHERE status = 'Completed'");
    const totalRevenue = parseFloat(revResult.rows[0].total);

    // Total Orders
    const ordersCountResult = await query("SELECT COUNT(*) AS count FROM orders");
    const totalOrders = parseInt(ordersCountResult.rows[0].count, 10);

    // Total Customers
    const customersCountResult = await query("SELECT COUNT(*) AS count FROM customers");
    const totalCustomers = parseInt(customersCountResult.rows[0].count, 10);

    // Total Products
    const productsCountResult = await query("SELECT COUNT(*) AS count FROM products");
    const totalProducts = parseInt(productsCountResult.rows[0].count, 10);

    // Total Expenses (Assume 55% of completed order revenue)
    const totalExpenses = parseFloat((totalRevenue * 0.55).toFixed(2));

    // Total Profit (Total Revenue - Total Expenses)
    const totalProfit = parseFloat((totalRevenue - totalExpenses).toFixed(2));

    // Pending Orders
    const pendingOrdersResult = await query("SELECT COUNT(*) AS count FROM orders WHERE status = 'Pending'");
    const pendingOrders = parseInt(pendingOrdersResult.rows[0].count, 10);

    // Completed Orders
    const completedOrdersResult = await query("SELECT COUNT(*) AS count FROM orders WHERE status = 'Completed'");
    const completedOrders = parseInt(completedOrdersResult.rows[0].count, 10);

    // Structure KPI Cards
    const stats = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+12.5%',
        isPositive: true,
        timeframe: 'from last month'
      },
      {
        id: 'orders',
        title: 'Total Orders',
        value: totalOrders.toLocaleString('en-US'),
        change: '+8.2%',
        isPositive: true,
        timeframe: 'from last month'
      },
      {
        id: 'customers',
        title: 'Total Customers',
        value: totalCustomers.toLocaleString('en-US'),
        change: '+15.3%',
        isPositive: true,
        timeframe: 'from last month'
      },
      {
        id: 'products',
        title: 'Total Products',
        value: totalProducts.toLocaleString('en-US'),
        change: '+4.1%',
        isPositive: true,
        timeframe: 'from last month'
      },
      {
        id: 'profit',
        title: 'Total Profit',
        value: `$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+14.2%',
        isPositive: true,
        timeframe: 'from last month'
      },
      {
        id: 'expenses',
        title: 'Total Expenses',
        value: `$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+6.5%',
        isPositive: false,
        timeframe: 'from last month'
      },
      {
        id: 'pendingOrders',
        title: 'Pending Orders',
        value: pendingOrders.toLocaleString('en-US'),
        change: '-2.1%',
        isPositive: true,
        timeframe: 'from last week'
      },
      {
        id: 'completedOrders',
        title: 'Completed Orders',
        value: completedOrders.toLocaleString('en-US'),
        change: '+9.4%',
        isPositive: true,
        timeframe: 'from last month'
      }
    ];

    // === 2. Charts ===

    // Chart A: Revenue Trend (Last 30 Days of Completed Orders)
    const revTrendResult = await query(`
      SELECT 
        TO_CHAR(date, 'YYYY-MM-DD') AS date, 
        SUM(amount)::float AS revenue
      FROM orders
      WHERE status = 'Completed'
      GROUP BY date
      ORDER BY date ASC
      LIMIT 30
    `);
    const revenueTrend = revTrendResult.rows;

    // Chart B: Sales by Category
    const salesByCategoryResult = await query(`
      SELECT 
        p.category AS name, 
        COUNT(o.id)::int AS value
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY p.category
    `);
    const salesByCategory = salesByCategoryResult.rows;

    // Chart C: Monthly Revenue vs Expenses
    const monthlyRevResult = await query(`
      SELECT 
        TO_CHAR(date, 'Mon') as name,
        COALESCE(SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END), 0)::float as revenue
      FROM orders
      GROUP BY TO_CHAR(date, 'Mon'), DATE_PART('month', date)
      ORDER BY DATE_PART('month', date)
    `);
    const monthlyRevenueVsExpenses = monthlyRevResult.rows.map(row => ({
      name: row.name,
      revenue: row.revenue,
      expenses: parseFloat((row.revenue * 0.55).toFixed(2))
    }));

    // Chart D: Customer Growth
    const customerGrowthResult = await query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as name,
        COUNT(*)::int as count
      FROM customers
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_PART('month', created_at)
      ORDER BY DATE_PART('month', created_at)
    `);
    // Map cumulative customer count growth
    let runningTotal = 0;
    const customerGrowth = customerGrowthResult.rows.map(row => {
      runningTotal += row.count;
      return {
        name: row.name,
        customers: runningTotal
      };
    });

    // Chart E: Top Selling Products (ordered by sales count)
    const topSellingProductsResult = await query(`
      SELECT 
        id, 
        name, 
        sales, 
        (price * sales)::float AS revenue, 
        rating::float AS rating 
      FROM products 
      ORDER BY sales DESC 
      LIMIT 5
    `);
    const topSellingProducts = topSellingProductsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      sales: row.sales,
      revenue: `$${parseFloat(row.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      rating: parseFloat(row.rating || 0)
    }));


    // === 3. Tables ===

    // Table A: Recent Orders
    const recentOrdersResult = await query(`
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
      LIMIT 5
    `);
    const recentOrders = recentOrdersResult.rows.map(row => ({
      id: row.id,
      customer: row.customer || 'Unknown Customer',
      product: row.product || 'Unknown Product',
      date: row.date,
      amount: `$${parseFloat(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: row.status
    }));

    // Table B: Recent Customers
    const recentCustomersResult = await query(`
      SELECT 
        id, 
        name, 
        email, 
        phone,
        company,
        status,
        TO_CHAR(created_at, 'YYYY-MM-DD') AS date
      FROM customers 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const recentCustomers = recentCustomersResult.rows;

    // Table C: Low Stock Products
    const lowStockProductsResult = await query(`
      SELECT 
        id, 
        name, 
        stock, 
        price,
        category
      FROM products 
      ORDER BY stock ASC 
      LIMIT 5
    `);
    const lowStockProducts = lowStockProductsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      stock: row.stock,
      price: `$${parseFloat(row.price).toFixed(2)}`,
      category: row.category
    }));

    // Table D: Latest Notifications
    const formatRelativeTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 60) {
        return `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else if (diffHours < 48) {
        return 'Yesterday';
      } else {
        return `${Math.floor(diffHours / 24)} days ago`;
      }
    };

    const latestNotificationsResult = await query(`
      SELECT 
        id, 
        title, 
        message AS desc, 
        created_at, 
        type 
      FROM notifications 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const latestNotifications = latestNotificationsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      desc: row.desc,
      time: formatRelativeTime(row.created_at),
      type: row.type
    }));

    // Send complete response
    res.json({
      success: true,
      stats,
      charts: {
        revenueTrend,
        salesByCategory,
        monthlyRevenueVsExpenses,
        customerGrowth,
        topSellingProducts
      },
      tables: {
        recentOrders,
        recentCustomers,
        lowStockProducts,
        latestNotifications
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
