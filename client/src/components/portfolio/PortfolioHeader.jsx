import React from 'react';
import {
  GraduationCap,
  Building,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Printer,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PortfolioHeader = ({ user, stats }) => {
  const { addToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Portfolio link copied to clipboard!', 'success');
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                objectFit: 'cover',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                border: '4px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {getInitials(user?.name)}
            </div>
          )}

          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                {user?.name || 'Student Name'}
              </h1>
              <span
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(165, 180, 252, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={12} /> Verified Portfolio
              </span>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', fontWeight: 500, marginTop: '0.35rem' }}>
              {user?.headline || 'Aspiring Software Engineer'}
            </p>

            {/* Academic details */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                color: '#94a3b8',
                fontSize: '0.88rem',
                margin: '0.85rem 0',
              }}
            >
              {user?.institution && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building size={15} color="#818cf8" />
                  <span>{user.institution}</span>
                </div>
              )}
              {user?.department && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <GraduationCap size={15} color="#818cf8" />
                  <span>{user.department}</span>
                </div>
              )}
              {user?.graduationYear && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={15} color="#818cf8" />
                  <span>Batch of {user.graduationYear}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user?.bio && (
              <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                {user.bio}
              </p>
            )}

            {/* Social Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              {user?.socialLinks?.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Github size={15} /> GitHub
                </a>
              )}
              {user?.socialLinks?.linkedin && (
                <a
                  href={user.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
              {user?.socialLinks?.portfolio && (
                <a
                  href={user.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Globe size={15} /> Website
                </a>
              )}
              {user?.socialLinks?.twitter && (
                <a
                  href={user.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Twitter size={15} /> Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions (Print & Share) */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary btn-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            title="Share portfolio"
          >
            <Share2 size={15} /> Share
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
            title="Print or export as PDF"
          >
            <Printer size={15} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      {stats && (
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalSkills}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Skills</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{stats.completedSkills}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Mastered</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8' }}>{stats.averageProficiency}%</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Avg Proficiency</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalProjects}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Projects</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalCertifications}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Certifications</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioHeader;
