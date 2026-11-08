import React from 'react';
import { Award, ExternalLink, Calendar, Hash, Edit2, Trash2 } from 'lucide-react';

const CertCard = ({ cert, onEdit, onDelete }) => {
  const formattedDate = cert.issueDate
    ? new Date(cert.issueDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                {cert.name}
              </h3>
              <p style={{ color: '#4f46e5', fontSize: '0.88rem', fontWeight: 600 }}>
                {cert.issuingOrganization}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2px' }}>
            <button onClick={() => onEdit(cert)} className="btn-icon" title="Edit Certification">
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(cert)}
              className="btn-icon"
              style={{ color: '#ef4444' }}
              title="Delete Certification"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
          {formattedDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              <span>Issued {formattedDate}</span>
            </div>
          )}
          {cert.credentialId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Hash size={13} />
              <span>ID: {cert.credentialId}</span>
            </div>
          )}
        </div>
      </div>

      {cert.credentialUrl && (
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            <ExternalLink size={14} />
            <span>Verify Credential</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default CertCard;
