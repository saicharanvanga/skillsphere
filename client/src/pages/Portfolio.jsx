import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Award,
  ExternalLink,
  Github,
  Calendar,
  Layers,
} from 'lucide-react';
import PortfolioHeader from '../components/portfolio/PortfolioHeader';
import PortfolioSkills from '../components/portfolio/PortfolioSkills';
import { dashboardService } from '../services/dashboardService';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getMyPortfolio();
        if (res.success && res.portfolio) {
          setData(res.portfolio);
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <p style={{ color: '#64748b' }}>Generating student portfolio preview...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error || 'No portfolio data found.'}</p>
      </div>
    );
  }

  const { user, stats, skillsByCategory, projects, certifications } = data;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Portfolio Header with Student Info, Socials, & Actions */}
      <PortfolioHeader user={user} stats={stats} />

      {/* Main Portfolio Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Section 1: Technical & Professional Skills */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Layers size={22} color="#4f46e5" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Technical Competencies & Proficiencies
            </h2>
          </div>
          <PortfolioSkills skillsByCategory={skillsByCategory} />
        </section>

        {/* Section 2: Projects Showcase */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Briefcase size={22} color="#4f46e5" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Featured Software Projects
            </h2>
          </div>

          {projects && projects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {projects.map((proj) => (
                <div key={proj._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {proj.title}
                    </h3>
                    {proj.completionDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
                        <Calendar size={12} />
                        <span>{new Date(proj.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {proj.description}
                    </p>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1.25rem' }}>
                        {proj.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: '#EEF2FF',
                              color: '#4338CA',
                              fontSize: '0.72rem',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <Github size={13} /> GitHub
                      </a>
                    )}
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No projects showcased yet.
            </div>
          )}
        </section>

        {/* Section 3: Verified Certifications */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Award size={22} color="#4f46e5" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Honors & Certifications
            </h2>
          </div>

          {certifications && certifications.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {certifications.map((c) => (
                <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</h3>
                    <p style={{ color: '#4f46e5', fontSize: '0.88rem', fontWeight: 600, marginTop: '2px' }}>
                      {c.issuingOrganization}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                      Issued: {new Date(c.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {c.credentialUrl && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', fontSize: '0.78rem' }}
                      >
                        <ExternalLink size={13} /> Verify Credential
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No certifications listed yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
