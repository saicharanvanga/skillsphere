import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  CircleDashed,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import ProgressBar from '../components/common/ProgressBar';
import { skillService } from '../services/skillService';
import { useToast } from '../context/ToastContext';
import { CATEGORY_COLORS } from '../utils/constants';

const SkillProgress = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ongoing', 'completed', 'pending'
  const [editingId, setEditingId] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  const { addToast } = useToast();

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillService.getSkills();
      if (res.success) {
        setSkills(res.skills);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load skill progression data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Metrics calculations
  const totalSkills = skills.length;
  const completedSkills = skills.filter((s) => s.status === 'Completed');
  const ongoingSkills = skills.filter((s) => s.status === 'Learning');
  const pendingSkills = skills.filter((s) => s.status === 'Not Started');

  const overallAvg =
    totalSkills > 0
      ? Math.round(skills.reduce((acc, c) => acc + c.progress, 0) / totalSkills)
      : 0;

  // Filter skills by tab
  const displayedSkills = skills.filter((s) => {
    if (activeTab === 'ongoing') return s.status === 'Learning';
    if (activeTab === 'completed') return s.status === 'Completed';
    if (activeTab === 'pending') return s.status === 'Not Started';
    return true;
  });

  const handleStartEdit = (skill) => {
    setEditingId(skill._id);
    setTempProgress(skill.progress);
  };

  const handleCommitProgress = async (id) => {
    try {
      const res = await skillService.updateProgress(id, tempProgress);
      if (res.success) {
        addToast(`Progress updated to ${tempProgress}%!`, 'success');
        setSkills((prev) =>
          prev.map((s) =>
            s._id === id
              ? {
                  ...s,
                  progress: tempProgress,
                  status:
                    tempProgress === 100
                      ? 'Completed'
                      : tempProgress > 0
                      ? 'Learning'
                      : 'Not Started',
                }
              : s
          )
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to save progress update.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Skill Progress Tracker</h1>
          <p className="page-subtitle">
            Fine-tune competency levels, track milestone progression, and monitor learning curves.
          </p>
        </div>
      </div>

      {/* Overall Progress Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 20px -4px rgba(49, 46, 129, 0.4)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <TrendingUp size={16} /> Overall Mastery Index
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.25rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {overallAvg}%
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.9rem', maxWidth: '480px' }}>
              Cumulative technical capacity across {totalSkills} active competencies in your academic curriculum.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>{completedSkills.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Completed</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#93c5fd' }}>{ongoingSkills.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Ongoing</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e2e8f0' }}>{pendingSkills.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Not Started</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <ProgressBar progress={overallAvg} height={10} color="#38bdf8" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          All Skills ({totalSkills})
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`btn ${activeTab === 'ongoing' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Ongoing Learning ({ongoingSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Completed ({completedSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Not Started ({pendingSkills.length})
        </button>
      </div>

      {/* Interactive Progress List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading progress tracking board...</p>
        </div>
      ) : displayedSkills.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedSkills.map((skill) => {
            const catColor = CATEGORY_COLORS[skill.category] || '#4F46E5';
            const isEditing = editingId === skill._id;

            return (
              <div
                key={skill._id}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: catColor,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {skill.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#eef2ff',
                        color: '#4338ca',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {skill.proficiencyLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: isEditing ? '#4f46e5' : '#0f172a', fontFamily: 'Plus Jakarta Sans' }}>
                      {isEditing ? tempProgress : skill.progress}%
                    </span>

                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleCommitProgress(skill._id)}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(skill)}
                        className="btn btn-secondary btn-sm"
                      >
                        Adjust Progress
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar or interactive slider */}
                {isEditing ? (
                  <div style={{ padding: '0.5rem 0' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={tempProgress}
                      onChange={(e) => setTempProgress(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                      <span>0% (Not Started)</span>
                      <span>50% (Intermediate)</span>
                      <span>100% (Completed)</span>
                    </div>
                  </div>
                ) : (
                  <ProgressBar progress={skill.progress} height={8} color={catColor} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No skills match this filter criteria.
        </div>
      )}
    </div>
  );
};

export default SkillProgress;
