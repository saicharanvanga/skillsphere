import React from 'react';

const ProgressBar = ({
  progress = 0,
  height = 8,
  showLabel = false,
  color,
  animated = false,
}) => {
  const clamped = Math.min(100, Math.max(0, Number(progress) || 0));

  // Determine automatic color based on progress tier if not explicitly passed
  let barColor = color;
  if (!barColor) {
    if (clamped >= 80) barColor = '#10B981'; // Emerald
    else if (clamped >= 40) barColor = '#4F46E5'; // Indigo
    else if (clamped > 0) barColor = '#F59E0B'; // Amber
    else barColor = '#CBD5E1'; // Slate light
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
          <span>Proficiency</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className="progress-bar-container"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
