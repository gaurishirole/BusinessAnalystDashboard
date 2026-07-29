import React from 'react';
import '../../styles/RecentOrders.css';
import StatusBadge from '../common/StatusBadge';

export default function RecentOrders({ data = [] }) {
  return (
    <div className="recent-orders-card glass-panel">
      <div className="card-header">
        <h3>Recent Orders</h3>
        <p>Latest transactions processed</p>
      </div>
      <div className="table-responsive">
        <table className="orders-table">
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
            {data.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td className="customer-name">{order.customer}</td>
                <td>{order.product}</td>
                <td className="order-date">{order.date}</td>
                <td className="order-amount">{order.amount}</td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
