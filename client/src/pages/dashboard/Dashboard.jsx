import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import { fetchDashboardStats } from '../../services/dashboardService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import '../../styles/Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchDashboardStats();
        if (res && res.success) {
          setData(res);
        } else {
          setError(res?.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="dashboard-loading animate-pulse">
          <p>Loading dashboard statistics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats = [], charts = {}, tables = {} } = data || {};
  const { revenueTrend = [], salesByCategory = [], monthlyRevenueVsExpenses = [], customerGrowth = [], topSellingProducts = [] } = charts;
  const { recentOrders = [], recentCustomers = [], lowStockProducts = [], latestNotifications = [] } = tables;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-grid animate-fade-in">
        
        {/* === 1. KPI Cards === */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <StatsCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive}
              timeframe={stat.timeframe}
            />
          ))}
        </div>

        {/* === 2. Charts Rows === */}
        <div className="charts-grid-row">
          
          {/* Revenue Trend Chart */}
          <div className="chart-large glass-panel" style={{ padding: '1.5rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Revenue Trend</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Daily completed sales trend</p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenueTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenueTrend)" name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales by Category Chart */}
          <div className="chart-small glass-panel" style={{ padding: '1.5rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Sales by Category</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Distribution of sales across categories</p>
            </div>
            <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Second Chart Row */}
        <div className="charts-grid-row">
          
          {/* Monthly Revenue vs Expenses */}
          <div className="chart-medium glass-panel" style={{ padding: '1.5rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Monthly Revenue vs Expenses</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Financial overview compared by month</p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueVsExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: '12px' }}>{value}</span>} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                  <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expenses ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Growth Chart */}
          <div className="chart-medium glass-panel" style={{ padding: '1.5rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Customer Growth</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total customers count over time</p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total Customers" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        <div className="charts-grid-row">
          
          {/* Top Selling Products */}
          <div className="chart-large glass-panel" style={{ padding: '1.5rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Top Selling Products</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Best performing products by total sales volume</p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingProducts} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={11} width={150} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Sales Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* === 3. Tables Row === */}
        <div className="content-grid-row">
          
          {/* Recent Orders */}
          <div className="content-large">
            <RecentOrders data={recentOrders} />
          </div>

          {/* Latest Notifications / Administrative timeline */}
          <div className="content-small">
            <ActivityTimeline data={latestNotifications} />
          </div>

        </div>

        {/* Second Tables Row */}
        <div className="content-grid-row">
          
          {/* Recent Customers */}
          <div className="content-large glass-panel" style={{ padding: '1.5rem' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Recent Customers</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Latest client profiles added</p>
            </div>
            <div className="table-responsive">
              <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCustomers.map((cust) => (
                    <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-primary)' }}>{cust.name}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{cust.email}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{cust.company || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: cust.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: cust.status === 'Active' ? '#10b981' : '#ef4444'
                        }}>
                          {cust.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{cust.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="content-small glass-panel" style={{ padding: '1.5rem' }}>
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>Low Stock Alert</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Products requiring restock inventory</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockProducts.map((prod) => (
                <div key={prod.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <h5 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>{prod.name}</h5>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Category: {prod.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: prod.stock < 250 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: prod.stock < 250 ? '#ef4444' : '#f59e0b',
                      marginBottom: '0.2rem'
                    }}>
                      {prod.stock} left
                    </span>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{prod.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
