import React from 'react';
import '../../styles/StatsCard.css';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({ title, value, change, isPositive, timeframe }) {
  return (
    <div className="stats-card glass-panel glass-panel-hover">
      <div className="stats-card-header">
        <span className="stats-card-title">{title}</span>
      </div>
      <div className="stats-card-body">
        <h2 className="stats-card-value">{value}</h2>
        <div className="stats-card-footer">
          <span className={`stats-card-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}
          </span>
          <span className="stats-card-timeframe">{timeframe}</span>
        </div>
      </div>
    </div>
  );
}
