import React from 'react';

const StatCard = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconBg = 'rgba(79, 70, 229, 0.1)',
  iconColor = '#4F46E5',
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-left">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
        {subtext && <span className="stat-card-sub">{subtext}</span>}
      </div>
      {Icon && (
        <div
          className="stat-icon-wrapper"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
