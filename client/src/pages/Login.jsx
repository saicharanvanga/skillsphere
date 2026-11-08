import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const getFriendlyError = (err, defaultMsg) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    if (
      err.code === 'ERR_NETWORK' ||
      err.message?.includes('Network Error') ||
      err.message?.includes('500')
    ) {
      return 'Cannot reach the SkillSphere backend server. Please make sure the backend is running on http://localhost:5000.';
    }
    return err.message || defaultMsg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login(email, password);
      addToast('Welcome back! Logged in successfully.', 'success');
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err, 'Login failed. Please check your credentials.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('student@skillsphere.edu');
    setPassword('Password123!');
    try {
      setSubmitting(true);
      setError('');
      await login('student@skillsphere.edu', 'Password123!');
      addToast('Logged in with Demo Student account!', 'success');
      navigate('/');
    } catch (err) {
      setError(getFriendlyError(err, 'Demo login failed. Please ensure the backend is running.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo-box">
          <Layers size={28} />
        </div>
        <h1 className="auth-title">Welcome to SkillSphere</h1>
        <p className="auth-subtitle">Sign in to track your skills and build your placement portfolio</p>
      </div>

      {/* Demo Account Quick Access */}
      <div className="demo-login-box">
        <div className="demo-login-title">Quick Demo Access</div>
        <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem' }}>
          Explore immediately with pre-loaded skills, projects, and certifications.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={submitting}
          className="btn-demo-quick"
        >
          ⚡ One-Click Demo Login
        </button>
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
          <label className="form-label" htmlFor="login-email">
            College / Student Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="login-email"
              type="email"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. student@skillsphere.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
        >
          {submitting ? 'Signing in...' : 'Sign In to Dashboard'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ fontWeight: 600, color: '#4f46e5' }}>
          Create student account
        </Link>
      </div>
    </div>
  );
};

export default Login;
