import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  UserCheck,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('You have been logged out successfully.', 'info');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/skills', label: 'My Skills', icon: Award },
    { to: '/progress', label: 'Skill Progress', icon: TrendingUp },
    { to: '/projects', label: 'My Projects', icon: Briefcase },
    { to: '/certifications', label: 'Certifications', icon: CheckCircle2 },
    { to: '/portfolio', label: 'Personal Portfolio', icon: UserCheck },
    { to: '/profile', label: 'Profile Settings', icon: Settings },
  ];

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
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onClose}>
            <div className="brand-icon-box">
              <Layers size={22} />
            </div>
            <div>
              <span className="brand-text">SkillSphere</span>
              <span className="brand-badge">PRO</span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Mini Card & Logout */}
        <div className="sidebar-footer">
          <div className="user-mini-card">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="user-avatar-placeholder object-cover"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="user-avatar-placeholder">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="user-mini-info">
              <div className="user-mini-name">{user?.name || 'Student'}</div>
              <div className="user-mini-sub">{user?.email || 'Logged In'}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-sidebar-logout"
            title="Log out from SkillSphere"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
