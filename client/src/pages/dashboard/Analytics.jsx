import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { fetchAnalyticsStats } from '../../services/analyticsService';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, ShoppingBag, DollarSign, Target, Percent,
  Award, MapPin, Package, RefreshCw, BarChart2, PieChart as PieIcon,
  Activity, Calendar, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import '../../styles/Dashboard.css';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchAnalyticsStats();
        if (res && res.success) {
          setData(res);
        } else {
          setError(res?.error || 'Failed to load analytics data');
        }
      } catch (err) {
        setError('Error fetching analytics data');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="dashboard-loading animate-pulse">
          <p>Loading deep business insights...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics">
        <div className="dashboard-error">
          <p className="text-danger">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { salesAnalytics, customerAnalytics, productAnalytics, financialAnalytics, charts } = data;

  const renderOverviewTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <div className="stats-card glass-panel glass-panel-hover">
          <div className="stats-header">
            <div>
              <p className="stats-title">Gross Revenue</p>
              <h3 className="stats-value">${financialAnalytics.grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="stats-icon-container" style={{ background: 'rgba(226, 176, 66, 0.15)', color: 'var(--color-primary)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stats-footer">
            <span className="trend-label text-success">
              <ArrowUpRight size={14} /> +{salesAnalytics.revenueGrowthPercent}%
            </span>
            <span className="timeframe-label">from last month</span>
          </div>
        </div>

        <div className="stats-card glass-panel glass-panel-hover">
          <div className="stats-header">
            <div>
              <p className="stats-title">Total Customers</p>
              <h3 className="stats-value">{customerAnalytics.totalCustomers.toLocaleString('en-US')}</h3>
            </div>
            <div className="stats-icon-container" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--color-secondary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stats-footer">
            <span className="trend-label text-success">
              <ArrowUpRight size={14} /> {customerAnalytics.newCustomers} new
            </span>
            <span className="timeframe-label">in last 30 days</span>
          </div>
        </div>

        <div className="stats-card glass-panel glass-panel-hover">
          <div className="stats-header">
            <div>
              <p className="stats-title">Target Achievement</p>
              <h3 className="stats-value">{salesAnalytics.salesTargetAchievement.percent}%</h3>
            </div>
            <div className="stats-icon-container" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
              <Target size={20} />
            </div>
          </div>
          <div className="stats-footer">
            <span className="trend-label text-success">
              ${salesAnalytics.yearlySales.amount.toLocaleString()} / ${salesAnalytics.salesTargetAchievement.target.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="stats-card glass-panel glass-panel-hover">
          <div className="stats-header">
            <div>
              <p className="stats-title">Retention Rate</p>
              <h3 className="stats-value">{customerAnalytics.customerRetentionRate}%</h3>
            </div>
            <div className="stats-icon-container" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--color-info)' }}>
              <Percent size={20} />
            </div>
          </div>
          <div className="stats-footer">
            <span className="trend-label">
              {customerAnalytics.returningCustomers} returning users
            </span>
          </div>
        </div>
      </div>

      {/* Overview Charts */}
      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Line Chart - Revenue Trend */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Revenue & Expenses Trend</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly performance overview</p>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} activeDot={{ r: 8 }} name="Revenue ($)" />
                <Line type="monotone" dataKey="expenses" stroke="var(--color-secondary)" strokeWidth={2} name="Expenses ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Order Statuses */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Order Status Summary</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Breakdown of order fulfillments</p>
          </div>
          <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={charts.orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}>
              {charts.orderStatusData.map((entry, index) => (
                <span key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], display: 'inline-block' }}></span>
                  {entry.name} ({entry.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalesTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="stats-card glass-panel">
          <p className="stats-title">Daily Sales</p>
          <h3 className="stats-value">${salesAnalytics.dailySales.amount.toLocaleString()}</h3>
          <p className="stats-footer-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {salesAnalytics.dailySales.count} completed orders today
          </p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Weekly Sales</p>
          <h3 className="stats-value">${salesAnalytics.weeklySales.amount.toLocaleString()}</h3>
          <p className="stats-footer-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {salesAnalytics.weeklySales.count} orders this week
          </p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Monthly Sales</p>
          <h3 className="stats-value">${salesAnalytics.monthlySales.amount.toLocaleString()}</h3>
          <p className="stats-footer-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {salesAnalytics.monthlySales.count} orders this month
          </p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Yearly Sales</p>
          <h3 className="stats-value">${salesAnalytics.yearlySales.amount.toLocaleString()}</h3>
          <p className="stats-footer-text" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {salesAnalytics.yearlySales.count} orders this year
          </p>
        </div>
      </div>

      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Area Chart - Cumulative Growth */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Cumulative Revenue Growth</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Running total of business revenue throughout the year</p>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="cumulativeRevenue" stroke="var(--color-success)" strokeWidth={3} fillOpacity={1} fill="url(#colorCumulative)" name="Cumulative Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="stats-grid">
        <div className="stats-card glass-panel">
          <p className="stats-title">New Customers</p>
          <h3 className="stats-value">{customerAnalytics.newCustomers}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Registered in last 30 days</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Returning Customers</p>
          <h3 className="stats-value">{customerAnalytics.returningCustomers}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>With multiple order transactions</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Customer Retention</p>
          <h3 className="stats-value">{customerAnalytics.customerRetentionRate}%</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Returning / total customer ratio</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Active Customers</p>
          <h3 className="stats-value">{customerAnalytics.activeCustomers}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Transacted in last 30 days</p>
        </div>
      </div>

      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Customer Composition Pie Chart */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Customer Composition</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Comparison of New vs Returning users</p>
          </div>
          <div style={{ width: '100%', height: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={charts.pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  <Cell fill="var(--color-primary)" />
                  <Cell fill="var(--color-success)" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: 'var(--color-primary)', display: 'inline-block' }}></span>
                New Customers ({customerAnalytics.newCustomers})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: 'var(--color-success)', display: 'inline-block' }}></span>
                Returning Customers ({customerAnalytics.returningCustomers})
              </span>
            </div>
          </div>
        </div>

        {/* Customer Location Table */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Customer Organizations</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Distribution of customers by company affiliation</p>
          </div>
          <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: 250 }}>
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>Company / Org</th>
                  <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Customers Count</th>
                </tr>
              </thead>
              <tbody>
                {customerAnalytics.customerLocations.map((loc) => (
                  <tr key={loc.location} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} className="text-secondary" />
                      {loc.location}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>{loc.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Bar Chart - Sales by Category */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sales by Category</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Revenue breakdown per product segment</p>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categorySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Turnover */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Inventory Turnover</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sales to current stock ratio</p>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 280 }}>
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Product</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Stock</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Sales</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Ratio</th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.inventoryTurnover.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.stock}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.sales}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }} className="text-success">
                      {item.turnover_ratio}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top vs Least Selling */}
      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }} className="text-success">Top Selling Products</h3>
          <div className="table-responsive">
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Product Name</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Units Sold</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.topSellingProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>{p.name}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>{p.sales}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }} className="text-danger">Least Selling Products</h3>
          <div className="table-responsive">
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Product Name</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Units Sold</th>
                  <th style={{ padding: '0.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.leastSellingProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>{p.name}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>{p.sales}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialTab = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="stats-grid">
        <div className="stats-card glass-panel">
          <p className="stats-title">Gross Revenue</p>
          <h3 className="stats-value">${financialAnalytics.grossRevenue.toLocaleString()}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>All completed sales</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Total Expenses</p>
          <h3 className="stats-value">${financialAnalytics.totalExpenses.toLocaleString()}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Estimated operational costs</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Net Profit</p>
          <h3 className="stats-value text-success">${financialAnalytics.netProfit.toLocaleString()}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Revenue minus Expenses</p>
        </div>
        <div className="stats-card glass-panel">
          <p className="stats-title">Profit Margin</p>
          <h3 className="stats-value">{financialAnalytics.profitMargin}%</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Net Profit / Gross Revenue</p>
        </div>
      </div>

      <div className="charts-grid-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Financial Comparison Bar Chart */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Financial Performance Comparison</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Comparing revenue and expenses by month</p>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Gross Revenue ($)" />
                <Bar dataKey="expenses" fill="var(--color-danger)" radius={[4, 4, 0, 0]} name="Expenses ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Summary card */}
        <div className="chart-card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Tax Summary</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Estimated corporate tax calculations based on completed business orders.
            </p>
            <div className="space-y-3" style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax Rate</span>
                <span style={{ fontWeight: 600 }}>15.00%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Taxable Revenue</span>
                <span style={{ fontWeight: 600 }}>${financialAnalytics.grossRevenue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax Owed</span>
                <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>${financialAnalytics.taxSummary.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-warning)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Activity size={16} />
            <span>Values shown are estimates. Consult an accountant.</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', overflowX: 'auto', gap: '1.5rem', paddingBottom: '0.25rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
            { id: 'customer', label: 'Customer Analytics', icon: Users },
            { id: 'product', label: 'Product Analytics', icon: Package },
            { id: 'financial', label: 'Financial Analytics', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'sales' && renderSalesTab()}
        {activeTab === 'customer' && renderCustomerTab()}
        {activeTab === 'product' && renderProductTab()}
        {activeTab === 'financial' && renderFinancialTab()}
      </div>
    </DashboardLayout>
  );
}
