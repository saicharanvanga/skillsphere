import React from 'react';
import ProgressBar from '../common/ProgressBar';
import { CATEGORY_COLORS, PROFICIENCY_BADGES } from '../../utils/constants';

const PortfolioSkills = ({ skillsByCategory = {} }) => {
  const categories = Object.keys(skillsByCategory);

  if (categories.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#64748b' }}>No skills added yet to display in the portfolio.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {categories.map((category) => {
        const skills = skillsByCategory[category] || [];
        const catColor = CATEGORY_COLORS[category] || '#4F46E5';

        return (
          <div key={category} className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: catColor,
                }}
              />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                {category}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  marginLeft: 'auto',
                }}
              >
                {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {skills.map((skill) => {
                const badgeConfig =
                  PROFICIENCY_BADGES[skill.proficiencyLevel] ||
                  PROFICIENCY_BADGES['Beginner'];

                return (
                  <div
                    key={skill._id}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {skill.name}
                      </span>
                      <span
                        className="proficiency-badge"
                        style={{
                          backgroundColor: badgeConfig.bg,
                          color: badgeConfig.text,
                        }}
                      >
                        {skill.proficiencyLevel}
                      </span>
                    </div>

                    {skill.description && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          marginBottom: '0.75rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {skill.description}
                      </p>
                    )}

                    <div style={{ marginTop: '0.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: '#475569',
                          marginBottom: '4px',
                          fontWeight: 600,
                        }}
                      >
                        <span>Proficiency</span>
                        <span style={{ color: catColor }}>{skill.progress}%</span>
                      </div>
                      <ProgressBar progress={skill.progress} color={catColor} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioSkills;
