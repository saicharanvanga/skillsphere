import React from 'react';
import { Menu, Plus, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="menu-toggle-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <span className="navbar-title">
          Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}! 👋
        </span>
      </div>

      <div className="navbar-right">
        <button
          onClick={() => navigate('/portfolio')}
          className="quick-action-btn"
          title="Preview your public portfolio"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">Preview Portfolio</span>
        </button>

        <button
          onClick={() => navigate('/skills?action=add')}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
