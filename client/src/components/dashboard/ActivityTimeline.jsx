import React from 'react';
import '../../styles/ActivityTimeline.css';
import { Database, UserCheck, Tag, ShieldCheck } from 'lucide-react';

export default function ActivityTimeline({ data = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'system':
        return <Database size={16} className="timeline-icon-svg" />;
      case 'user':
        return <UserCheck size={16} className="timeline-icon-svg" />;
      case 'product':
        return <Tag size={16} className="timeline-icon-svg" />;
      default:
        return <ShieldCheck size={16} className="timeline-icon-svg" />;
    }
  };

  return (
    <div className="activity-timeline-card glass-panel">
      <div className="card-header">
        <h3>Activity Timeline</h3>
        <p>Real-time log of administrative events</p>
      </div>
      <div className="timeline">
        {data.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-badge">
              {getIcon(item.type)}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{item.title}</h4>
                <span className="timeline-time">{item.time}</span>
              </div>
              <p className="timeline-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
