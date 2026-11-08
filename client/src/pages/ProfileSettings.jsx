import React, { useState, useEffect } from 'react';
import { User, Mail, Building, GraduationCap, Calendar, Github, Linkedin, Globe, Twitter, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    institution: '',
    department: '',
    graduationYear: '',
    avatar: '',
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
      twitter: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        institution: user.institution || '',
        department: user.department || '',
        graduationYear: user.graduationYear || '',
        avatar: user.avatar || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          portfolio: user.socialLinks?.portfolio || '',
          twitter: user.socialLinks?.twitter || '',
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const field = name.replace('social_', '');
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateUserProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Profile & Placement Settings</h1>
          <p className="page-subtitle">
            Update your student biography, educational background, and external portfolio links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          Personal Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prof-name">
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="prof-name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-email">
              Email Address (Read-only)
            </label>
            <input
              id="prof-email"
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prof-headline">
            Professional Headline
          </label>
          <input
            id="prof-headline"
            name="headline"
            type="text"
            className="form-input"
            placeholder="e.g. Full-Stack Developer | Pre-Final Year CSE Student"
            value={formData.headline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prof-bio">
            Student Biography
          </label>
          <textarea
            id="prof-bio"
            name="bio"
            className="form-textarea"
            rows={3}
            placeholder="Brief statement highlighting your engineering passions and career aspirations..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="prof-avatar">
            Avatar Image URL
          </label>
          <input
            id="prof-avatar"
            name="avatar"
            type="url"
            className="form-input"
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.avatar}
            onChange={handleChange}
          />
          <div className="form-hint">Enter an image URL for your profile picture</div>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          Academic Background
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prof-institution">
              College / University
            </label>
            <input
              id="prof-institution"
              name="institution"
              type="text"
              className="form-input"
              value={formData.institution}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-dept">
              Department / Major
            </label>
            <input
              id="prof-dept"
              name="department"
              type="text"
              className="form-input"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label className="form-label" htmlFor="prof-grad">
            Graduation Year
          </label>
          <input
            id="prof-grad"
            name="graduationYear"
            type="text"
            className="form-input"
            value={formData.graduationYear}
            onChange={handleChange}
          />
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          Social & Portfolio Links
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="prof-github">
              GitHub Profile URL
            </label>
            <input
              id="prof-github"
              name="social_github"
              type="url"
              className="form-input"
              placeholder="https://github.com/username"
              value={formData.socialLinks.github}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-linkedin">
              LinkedIn Profile URL
            </label>
            <input
              id="prof-linkedin"
              name="social_linkedin"
              type="url"
              className="form-input"
              placeholder="https://linkedin.com/in/username"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-portfolio">
              Personal Website / Blog
            </label>
            <input
              id="prof-portfolio"
              name="social_portfolio"
              type="url"
              className="form-input"
              placeholder="https://yourdomain.dev"
              value={formData.socialLinks.portfolio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prof-twitter">
              Twitter / X Profile URL
            </label>
            <input
              id="prof-twitter"
              name="social_twitter"
              type="url"
              className="form-input"
              placeholder="https://x.com/username"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <Save size={16} />
            <span>{submitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
