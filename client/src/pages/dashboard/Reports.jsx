import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  fetchReportData 
} from '../../services/reportService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, Calendar, Filter, 
  Download, Printer, FileSpreadsheet, FileText, ChevronLeft, ChevronRight 
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import '../../styles/Dashboard.css';
import '../../styles/RecentOrders.css';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('All');
  
  // Pagination State for Sales Report Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadReportData = async () => {
    setLoading(true);
    try {
      const res = await fetchReportData({ startDate, endDate, category });
      if (res && res.success) {
        setData(res.data);
      } else {
        setError('Failed to fetch report data');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [startDate, endDate, category]);

  // Export functions
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Basic premium-looking PDF generation mock or styled window print setup
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>InsightPro - Analytical Report</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; color: #111; padding: 40px; }
            h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
            .kpi-grid { display: flex; gap: 20px; margin: 30px 0; }
            .kpi-card { flex: 1; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #fafafa; }
            .kpi-title { font-size: 0.9rem; color: #666; }
            .kpi-value { font-size: 1.8rem; font-weight: bold; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Analytical Business Report</h1>
          <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Filters Applied:</strong> Date Range: ${startDate || 'All Time'} to ${endDate || 'All Time'} | Category: ${category}</p>
          
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-title">Total Revenue</div>
              <div class="kpi-value">${data?.kpis?.revenue || '$0.00'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Orders</div>
              <div class="kpi-value">${data?.kpis?.orders || '0'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Customers</div>
              <div class="kpi-value">${data?.kpis?.customers || '0'}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Profit</div>
              <div class="kpi-value">${data?.kpis?.profit || '$0.00'}</div>
            </div>
          </div>

          <h2>Sales Record Table</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data?.salesReportTable?.map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.customer}</td>
                  <td>${item.product}</td>
                  <td>${item.date}</td>
                  <td>${item.amount}</td>
                  <td>${item.status}</td>
                </tr>
              `).join('') || '<tr><td colspan="6">No records found</td></tr>'}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportExcel = () => {
    if (!data?.salesReportTable || data.salesReportTable.length === 0) return;
    
    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Product', 'Date', 'Amount', 'Status'];
    const rows = data.salesReportTable.map(item => [
      item.id,
      item.customer,
      item.product,
      item.date,
      item.amount.replace('$', ''),
      item.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `InsightPro_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return (
      <DashboardLayout title="Reports">
        <div className="dashboard-loading animate-pulse" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <p>Loading analytics and reports data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Reports">
        <div className="dashboard-error" style={{ color: 'var(--color-danger)', padding: '2rem' }}>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Paginated data for Sales Report Table
  const totalItems = data?.salesReportTable?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSales = data?.salesReportTable?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  return (
    <DashboardLayout title="Reports">
      <div className="dashboard-grid animate-fade-in" style={{ paddingBottom: '3rem' }}>
        
        {/* Reports Header & Filters Toolbar */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>Reports Generator</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Create, filter, and export customized business analytical reports.</p>
            </div>
            
            {/* Export and Print Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={handleExportPDF} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '6px' }}>
                <FileText size={16} />
                Export PDF
              </button>
              <button onClick={handleExportExcel} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '6px' }}>
                <FileSpreadsheet size={16} />
                Export Excel
              </button>
              <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '6px' }}>
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Filters Fields */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="input-wrapper" style={{ width: 'auto', minWidth: '180px' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> Start Date
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} 
                className="input-field" 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              />
            </div>

            <div className="input-wrapper" style={{ width: 'auto', minWidth: '180px' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> End Date
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} 
                className="input-field" 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
              />
            </div>

            <div className="input-wrapper" style={{ width: 'auto', minWidth: '200px' }}>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Filter size={14} /> Category / Product
              </label>
              <select 
                value={category} 
                onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }} 
                className="input-field" 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', background: 'var(--bg-tertiary)' }}
              >
                {data?.categories?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {(startDate || endDate || category !== 'All') && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); setCategory('All'); setCurrentPage(1); }}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.5rem 1rem', height: '38px' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="stats-grid">
          {/* Revenue KPI */}
          <div className="stats-card glass-panel glass-panel-hover" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(17, 24, 39, 0.6))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stats-card-title">Total Revenue</span>
              <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '8px', color: 'var(--color-primary)' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <h2 className="stats-card-value" style={{ margin: '0.5rem 0 0.2rem 0' }}>{data?.kpis?.revenue}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Orders Value</span>
          </div>

          {/* Orders KPI */}
          <div className="stats-card glass-panel glass-panel-hover" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(17, 24, 39, 0.6))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stats-card-title">Total Orders</span>
              <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: 'var(--color-success)' }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <h2 className="stats-card-value" style={{ margin: '0.5rem 0 0.2rem 0' }}>{data?.kpis?.orders}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Successful Sales Volume</span>
          </div>

          {/* Customers KPI */}
          <div className="stats-card glass-panel glass-panel-hover" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(17, 24, 39, 0.6))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stats-card-title">Total Customers</span>
              <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '8px', color: 'var(--color-info)' }}>
                <Users size={20} />
              </div>
            </div>
            <h2 className="stats-card-value" style={{ margin: '0.5rem 0 0.2rem 0' }}>{data?.kpis?.customers}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unique Purchasing Clients</span>
          </div>

          {/* Profit KPI */}
          <div className="stats-card glass-panel glass-panel-hover" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(17, 24, 39, 0.6))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stats-card-title">Estimated Profit</span>
              <div style={{ padding: '0.5rem', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '8px', color: 'var(--color-secondary)' }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <h2 className="stats-card-value" style={{ margin: '0.5rem 0 0.2rem 0' }}>{data?.kpis?.profit}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Net 45% Yield</span>
          </div>
        </div>

        {/* Charts Row: Revenue Chart & Order Status Chart */}
        <div className="charts-grid-row">
          {/* Revenue Chart */}
          <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Revenue Trends</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Detailed monthly breakdown of revenues and expenses.</p>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="repColorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="repColorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#repColorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="var(--color-secondary)" strokeWidth={2} fillOpacity={1} fill="url(#repColorExpenses)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Chart */}
          <div className="chart-card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Order Status Breakdown</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status distribution of all generated orders.</p>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.orderStatusData || []}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data?.orderStatusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '0.8rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales Report Table Section */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Detailed Sales Record</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comprehensive transaction log based on filters.</p>
          </div>

          {paginatedSales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No sales records match the selected filters.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="orders-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.map((item) => (
                      <tr key={item.id}>
                        <td className="order-id">{item.id}</td>
                        <td className="customer-name">{item.customer}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.product}</td>
                        <td className="order-date">{item.date}</td>
                        <td className="order-amount" style={{ fontWeight: 600 }}>{item.amount}</td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} orders
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: '4px' }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Performance & Customer Analytics Double Column */}
        <div className="charts-grid-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
          
          {/* Product Performance Bar Chart */}
          <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Product Performance</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sales volume and revenue distribution per product.</p>
            </div>
            <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.productPerformance || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Sales']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="sales" />
                  <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Analytics Column */}
          <div className="chart-card glass-panel" style={{ padding: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Top Customer Valuations</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Highest spending clients based on completed transactions.</p>
            </div>
            <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.customerAnalytics || []} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={10} tickLine={false} width={80} />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spent']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Bar dataKey="totalSpent" fill="var(--color-info)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
