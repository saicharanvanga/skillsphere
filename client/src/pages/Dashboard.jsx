import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import { dashboardService } from '../services/dashboardService';
import { CATEGORY_COLORS, STATUS_COLORS } from '../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard metrics. Please make sure the server is connected.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
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
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="card text-center" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">
          Try Again
        </button>
      </div>
    );
  }

  // Format category distribution data for chart
  const categoryChartData = (stats.categoryDistribution || [])
    .filter((c) => c && c.count > 0)
    .map((c) => ({
      name: c.category.length > 18 ? c.category.substring(0, 15) + '...' : c.category,
      fullName: c.category,
      count: c.count,
      avgProgress: c.averageProgress,
      color: CATEGORY_COLORS[c.category] || '#6366f1',
    }));

  // Status breakdown for PieChart
  const statusPieData = (stats.statusDistribution || []).filter((s) => s && s.count > 0);

  return (
    <div>
      {/* Header Banner */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Learning & Skill Analytics</h1>
          <p className="page-subtitle">
            Comprehensive overview of technical competencies, active milestones, and portfolio progress.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/skills?action=add')} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Skill</span>
          </button>
          <button onClick={() => navigate('/portfolio')} className="btn btn-secondary">
            <span>View Portfolio</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Skills"
          value={stats.totalSkills}
          subtext="Categorized in profile"
          icon={Award}
          iconBg="#EEF2FF"
          iconColor="#4F46E5"
        />

        <StatCard
          label="Completed Skills"
          value={stats.completedSkills}
          subtext={`${stats.totalSkills > 0 ? Math.round((stats.completedSkills / stats.totalSkills) * 100) : 0}% completion rate`}
          icon={CheckCircle}
          iconBg="#DEF7EC"
          iconColor="#059669"
        />

        <StatCard
          label="Average Proficiency"
          value={`${stats.averageProficiency}%`}
          subtext="Across all technical domains"
          icon={TrendingUp}
          iconBg="#FEF3C7"
          iconColor="#D97706"
        />

        <StatCard
          label="Currently Learning"
          value={stats.learningSkills}
          subtext={`${stats.notStartedSkills} skills pending`}
          icon={Clock}
          iconBg="#F3E8FF"
          iconColor="#7E22CE"
        />
      </div>

      {/* Visualizations Section: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown (BarChart) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Category-Wise Skill Distribution</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Count & Progress</span>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '0.6rem 0.85rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{data.fullName}</p>
                            <p style={{ fontSize: '0.8rem', color: '#4f46e5' }}>Total Skills: {data.count}</p>
                            <p style={{ fontSize: '0.8rem', color: '#10b981' }}>Avg Progress: {data.avgProgress}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Add skills to see category metrics
            </div>
          )}
        </div>

        {/* Learning Status Breakdown (PieChart) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Learning Status Distribution</h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>By current phase</span>
          </div>

          {statusPieData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Skills`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No skills data available yet
            </div>
          )}
        </div>
      </div>

      {/* Recently Updated Skills Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>Recently Updated Skills</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
              Latest milestones and progress updates
            </p>
          </div>
          <button
            onClick={() => navigate('/skills')}
            className="btn btn-secondary btn-sm"
          >
            <span>View All Skills</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {stats.recentlyUpdatedSkills && stats.recentlyUpdatedSkills.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Skill Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Proficiency</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Progress</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentlyUpdatedSkills.map((skill) => {
                  const statusConf = STATUS_COLORS[skill.status] || STATUS_COLORS['Not Started'];
                  return (
                    <tr
                      key={skill._id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {skill.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                        {skill.category}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#eef2ff',
                            color: '#4338ca',
                          }}
                        >
                          {skill.proficiencyLevel}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', width: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <ProgressBar progress={skill.progress} height={6} />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '32px', textAlign: 'right' }}>
                            {skill.progress}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: statusConf.bg,
                            color: statusConf.text,
                            border: `1px solid ${statusConf.border}`,
                          }}
                        >
                          <span className="status-dot" style={{ backgroundColor: statusConf.dot }} />
                          {skill.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
            <p>No skills recorded yet.</p>
            <button
              onClick={() => navigate('/skills?action=add')}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '0.75rem' }}
            >
              Add Your First Skill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
