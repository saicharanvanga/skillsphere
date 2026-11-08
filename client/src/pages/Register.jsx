import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, User, Mail, Lock, Building, GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    department: '',
    graduationYear: '2026',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please provide full name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await register(formData);
      addToast('Student account created successfully! Welcome to SkillSphere.', 'success');
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || err.message?.includes('500')
          ? 'Cannot reach the SkillSphere backend server. Please verify the backend is running on http://localhost:5000.'
          : err.message || 'Registration failed');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '520px' }}>
      <div className="auth-header">
        <div className="auth-logo-box">
          <Layers size={28} />
        </div>
        <h1 className="auth-title">Create Student Account</h1>
        <p className="auth-subtitle">Start tracking your competencies and curate your placement portfolio</p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">
            Full Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <User
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="reg-name"
              name="name"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. Jordan Lee"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">
            Student Email Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. jordan.lee@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">
            Password (min 6 characters) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Lock
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="reg-password"
              name="password"
              type="password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-institution">
              College / University
            </label>
            <div style={{ position: 'relative' }}>
              <Building
                size={16}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                id="reg-institution"
                name="institution"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem' }}
                placeholder="University Institute"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-department">
              Department / Major
            </label>
            <div style={{ position: 'relative' }}>
              <GraduationCap
                size={16}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                id="reg-department"
                name="department"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem' }}
                placeholder="Computer Science"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-grad">
            Graduation Year
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar
              size={16}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="reg-grad"
              name="graduationYear"
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.2rem' }}
              placeholder="2026"
              value={formData.graduationYear}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
        >
          {submitting ? 'Creating account...' : 'Complete Registration'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
        Already registered?{' '}
        <Link to="/login" style={{ fontWeight: 600, color: '#4f46e5' }}>
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default Register;
