import React from 'react';
import { Github, ExternalLink, Calendar, Star, Edit2, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const formattedDate = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                {project.title}
              </h3>
              {project.featured && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  <Star size={11} fill="#F59E0B" color="#F59E0B" /> Featured
                </span>
              )}
            </div>
            {formattedDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '2px' }}>
            <button onClick={() => onEdit(project)} className="btn-icon" title="Edit Project">
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="btn-icon"
              style={{ color: '#ef4444' }}
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        {project.technologies && project.technologies.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#EEF2FF',
                  color: '#4338CA',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '0.85rem',
        }}
      >
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <Github size={14} />
            <span>GitHub</span>
          </a>
        )}

        {project.liveDemoUrl && (
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            <ExternalLink size={14} />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
