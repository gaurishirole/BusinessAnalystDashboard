import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/RevenueChart.css';

export default function SalesChart({ data = [] }) {
  return (
    <div className="chart-card glass-panel">
      <div className="chart-header">
        <h3>Weekly Sales</h3>
        <p>Sales volume by day</p>
      </div>
      <div className="chart-body" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
              }}
            />
            <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
