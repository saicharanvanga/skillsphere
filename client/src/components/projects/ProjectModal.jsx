import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const ProjectModal = ({ isOpen, onClose, onSave, initialProject = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    completionDate: new Date().toISOString().split('T')[0],
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setFormData({
        title: initialProject.title || '',
        description: initialProject.description || '',
        technologies: Array.isArray(initialProject.technologies)
          ? initialProject.technologies.join(', ')
          : initialProject.technologies || '',
        githubUrl: initialProject.githubUrl || '',
        liveDemoUrl: initialProject.liveDemoUrl || '',
        completionDate: initialProject.completionDate
          ? new Date(initialProject.completionDate).toISOString().split('T')[0]
          : '',
        featured: Boolean(initialProject.featured),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveDemoUrl: '',
        completionDate: new Date().toISOString().split('T')[0],
        featured: false,
      });
    }
    setErrors({});
  }, [initialProject, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Project title is required';
    if (!formData.description.trim()) errs.description = 'Project description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(formData, initialProject?._id);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.message || err.message || 'Error saving project',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProject ? 'Edit Project' : 'Add New Project'}
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
            {submitting ? 'Saving...' : initialProject ? 'Update Project' : 'Add Project'}
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
          <label className="form-label" htmlFor="project-title">
            Project Title <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="project-title"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g. SkillSphere – Portfolio Tracker"
            value={formData.title}
            onChange={handleChange}
            autoFocus
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-desc">
            Description <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            id="project-desc"
            name="description"
            className="form-textarea"
            rows={4}
            placeholder="Describe problem solved, architecture, and core features..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-tech">
            Technologies Used
          </label>
          <input
            id="project-tech"
            name="technologies"
            type="text"
            className="form-input"
            placeholder="Comma-separated: React.js, Express, MongoDB, Tailwind"
            value={formData.technologies}
            onChange={handleChange}
          />
          <div className="form-hint">Separate multiple technologies with commas</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-github">
              GitHub Repository URL
            </label>
            <input
              id="project-github"
              name="githubUrl"
              type="url"
              className="form-input"
              placeholder="https://github.com/username/repo"
              value={formData.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="project-demo">
              Live Demo URL
            </label>
            <input
              id="project-demo"
              name="liveDemoUrl"
              type="url"
              className="form-input"
              placeholder="https://myproject.demo.app"
              value={formData.liveDemoUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="project-date">
              Completion Date
            </label>
            <input
              id="project-date"
              name="completionDate"
              type="date"
              className="form-input"
              value={formData.completionDate}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem' }}>
            <input
              id="project-featured"
              name="featured"
              type="checkbox"
              style={{ width: '18px', height: '18px', accentColor: '#4f46e5', cursor: 'pointer' }}
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="project-featured" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              Feature in Portfolio
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
