import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon-container stat-icon-${color}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.text}
          </span>
        )}
      </div>
    </div>
  );
};
