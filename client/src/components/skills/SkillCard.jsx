import React from 'react';
import { Edit2, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import {
  STATUS_COLORS,
  PROFICIENCY_BADGES,
  CATEGORY_COLORS,
} from '../../utils/constants';

const SkillCard = ({
  skill,
  onEdit,
  onDelete,
  onUpdateProgress,
}) => {
  const statusConfig = STATUS_COLORS[skill.status] || STATUS_COLORS['Not Started'];
  const proficiencyConfig = PROFICIENCY_BADGES[skill.proficiencyLevel] || PROFICIENCY_BADGES['Beginner'];
  const categoryColor = CATEGORY_COLORS[skill.category] || '#6366F1';

  const handleStep = (step) => {
    const nextProgress = Math.min(100, Math.max(0, skill.progress + step));
    if (nextProgress !== skill.progress) {
      onUpdateProgress(skill._id, nextProgress);
    }
  };

  return (
    <div className="skill-card">
      <div>
        <div className="skill-card-header">
          <h3 className="skill-name">{skill.name}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(skill)}
              className="btn-icon"
              title="Edit Skill"
              aria-label={`Edit ${skill.name}`}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(skill)}
              className="btn-icon"
              style={{ color: '#ef4444' }}
              title="Delete Skill"
              aria-label={`Delete ${skill.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="skill-card-meta">
          <span
            className="category-pill"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            {skill.category}
          </span>

          <span
            className="proficiency-badge"
            style={{
              backgroundColor: proficiencyConfig.bg,
              color: proficiencyConfig.text,
            }}
          >
            {skill.proficiencyLevel}
          </span>

          <span
            className="status-badge"
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.text,
              border: `1px solid ${statusConfig.border}`,
            }}
          >
            <span
              className="status-dot"
              style={{ backgroundColor: statusConfig.dot }}
            />
            {skill.status}
          </span>
        </div>

        {/* Description */}
        {skill.description ? (
          <p className="skill-card-description">{skill.description}</p>
        ) : (
          <p className="skill-card-description text-slate-400 italic">
            No description provided.
          </p>
        )}
      </div>

      {/* Progress & Stepper */}
      <div>
        <div className="skill-progress-section">
          <div className="skill-progress-header">
            <span>Proficiency Progress</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{skill.progress}%</span>
          </div>
          <ProgressBar progress={skill.progress} />
        </div>

        <div className="skill-card-footer">
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Quick Adjust:
          </span>
          <div className="quick-progress-buttons">
            <button
              onClick={() => handleStep(-5)}
              disabled={skill.progress <= 0}
              className="btn-stepper"
              title="Decrease progress by 5%"
              aria-label="Decrease progress"
            >
              <Minus size={12} style={{ display: 'inline', marginRight: '2px' }} />
              5%
            </button>
            <button
              onClick={() => handleStep(5)}
              disabled={skill.progress >= 100}
              className="btn-stepper"
              title="Increase progress by 5%"
              aria-label="Increase progress"
            >
              <Plus size={12} style={{ display: 'inline', marginRight: '2px' }} />
              5%
            </button>
            {skill.progress < 100 && (
              <button
                onClick={() => handleStep(100 - skill.progress)}
                className="btn-stepper"
                style={{ backgroundColor: '#DEF7EC', color: '#03543F' }}
                title="Mark as 100% completed"
              >
                <CheckCircle size={12} style={{ display: 'inline', marginRight: '2px' }} />
                100%
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
