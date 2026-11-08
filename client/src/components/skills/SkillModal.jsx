import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import {
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  LEARNING_STATUSES,
} from '../../utils/constants';

const SkillModal = ({ isOpen, onClose, onSave, initialSkill = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: SKILL_CATEGORIES[0],
    proficiencyLevel: 'Beginner',
    progress: 0,
    status: 'Not Started',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialSkill) {
      setFormData({
        name: initialSkill.name || '',
        category: initialSkill.category || SKILL_CATEGORIES[0],
        proficiencyLevel: initialSkill.proficiencyLevel || 'Beginner',
        progress: initialSkill.progress || 0,
        status: initialSkill.status || 'Not Started',
        description: initialSkill.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: SKILL_CATEGORIES[0],
        proficiencyLevel: 'Beginner',
        progress: 0,
        status: 'Not Started',
        description: '',
      });
    }
    setErrors({});
  }, [initialSkill, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'progress') {
      const numVal = Math.min(100, Math.max(0, Number(value) || 0));
      let newStatus = formData.status;
      if (numVal === 100) newStatus = 'Completed';
      else if (numVal > 0 && formData.status === 'Not Started') newStatus = 'Learning';
      else if (numVal === 0) newStatus = 'Not Started';

      setFormData((prev) => ({
        ...prev,
        progress: numVal,
        status: newStatus,
      }));
    } else if (name === 'status') {
      let newProgress = formData.progress;
      if (value === 'Completed' && formData.progress < 100) newProgress = 100;
      else if (value === 'Not Started') newProgress = 0;
      else if (value === 'Learning' && formData.progress === 0) newProgress = 25;

      setFormData((prev) => ({
        ...prev,
        status: value,
        progress: newProgress,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Skill name is required';
    }
    if (!formData.category) {
      errs.category = 'Skill category is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(formData, initialSkill?._id);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.message || err.message || 'Error saving skill',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialSkill ? 'Edit Skill' : 'Add New Skill'}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : initialSkill ? 'Update Skill' : 'Add Skill'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div
            style={{
              padding: '0.75rem',
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="skill-name">
            Skill Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="skill-name"
            name="name"
            type="text"
            className="form-input"
            placeholder="e.g. React.js, Python, System Design"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="skill-category">
              Category <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="skill-category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill-proficiency">
              Proficiency Level <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="skill-proficiency"
              name="proficiencyLevel"
              className="form-select"
              value={formData.proficiencyLevel}
              onChange={handleChange}
            >
              {PROFICIENCY_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label className="form-label" htmlFor="skill-progress" style={{ margin: 0 }}>
                Progress (%)
              </label>
              <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.85rem' }}>
                {formData.progress}%
              </span>
            </div>
            <input
              id="skill-progress"
              name="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#4f46e5' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill-status">
              Learning Status
            </label>
            <select
              id="skill-status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              {LEARNING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="skill-description">
            Description / Learning Notes
          </label>
          <textarea
            id="skill-description"
            name="description"
            className="form-textarea"
            placeholder="Briefly describe what you've learned or topics covered..."
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default SkillModal;
