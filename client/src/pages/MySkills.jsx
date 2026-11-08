import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Award, AlertTriangle } from 'lucide-react';
import SkillCard from '../components/skills/SkillCard';
import SkillModal from '../components/skills/SkillModal';
import SkillFilterBar from '../components/skills/SkillFilterBar';
import Modal from '../components/common/Modal';
import { skillService } from '../services/skillService';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState('All');
  const [proficiencyLevel, setProficiencyLevel] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [deleteSkillTarget, setDeleteSkillTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (category !== 'All') params.category = category;
      if (proficiencyLevel !== 'All') params.proficiencyLevel = proficiencyLevel;
      if (status !== 'All') params.status = status;
      if (sort !== 'newest') params.sort = sort;

      const res = await skillService.getSkills(params);
      if (res.success) {
        setSkills(res.skills);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      addToast('Failed to load skills.', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, proficiencyLevel, status, sort, addToast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Open Add modal if url contains ?action=add
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setSelectedSkill(null);
      setIsAddEditOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle Save (Create / Update)
  const handleSaveSkill = async (formData, id) => {
    if (id) {
      const res = await skillService.updateSkill(id, formData);
      if (res.success) {
        addToast(`Skill "${res.skill.name}" updated successfully!`, 'success');
        fetchSkills();
      }
    } else {
      const res = await skillService.createSkill(formData);
      if (res.success) {
        addToast(`Skill "${res.skill.name}" added to your profile!`, 'success');
        fetchSkills();
      }
    }
  };

  // Quick progress update from stepper
  const handleUpdateProgress = async (id, newProgress) => {
    try {
      // Optimistic UI update
      setSkills((prev) =>
        prev.map((s) =>
          s._id === id
            ? {
                ...s,
                progress: newProgress,
                status:
                  newProgress === 100
                    ? 'Completed'
                    : newProgress > 0
                    ? 'Learning'
                    : 'Not Started',
              }
            : s
        )
      );

      const res = await skillService.updateProgress(id, newProgress);
      if (res.success) {
        addToast(`Progress updated to ${newProgress}%`, 'success', 2000);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      addToast('Failed to update progress. Reverting changes...', 'error');
      fetchSkills();
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteSkillTarget) return;
    try {
      setDeleting(true);
      const res = await skillService.deleteSkill(deleteSkillTarget._id);
      if (res.success) {
        addToast(`Skill removed successfully`, 'info');
        setDeleteSkillTarget(null);
        fetchSkills();
      }
    } catch (err) {
      console.error('Delete error:', err);
      addToast('Failed to delete skill.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setProficiencyLevel('All');
    setStatus('All');
    setSort('newest');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Technical & Professional Skills</h1>
          <p className="page-subtitle">
            Manage your skill inventory, set proficiencies, and update learning milestones.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedSkill(null);
            setIsAddEditOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <SkillFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        proficiencyLevel={proficiencyLevel}
        onProficiencyChange={setProficiencyLevel}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        onReset={handleResetFilters}
      />

      {/* Skill List Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ color: '#64748b' }}>Loading skills...</p>
          </div>
        </div>
      ) : skills.length > 0 ? (
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              onEdit={(s) => {
                setSelectedSkill(s);
                setIsAddEditOpen(true);
              }}
              onDelete={(s) => setDeleteSkillTarget(s)}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Award size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No skills found
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            {search || category !== 'All' || proficiencyLevel !== 'All' || status !== 'All'
              ? 'Try adjusting your search criteria or resetting the active filters.'
              : 'Start tracking your competencies by adding your first technical or soft skill.'}
          </p>
          {search || category !== 'All' || proficiencyLevel !== 'All' || status !== 'All' ? (
            <button onClick={handleResetFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedSkill(null);
                setIsAddEditOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Your First Skill</span>
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <SkillModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setSelectedSkill(null);
        }}
        onSave={handleSaveSkill}
        initialSkill={selectedSkill}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteSkillTarget}
        onClose={() => setDeleteSkillTarget(null)}
        title="Confirm Removal"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteSkillTarget(null)}
              className="btn btn-secondary"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="btn btn-danger"
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Delete Skill'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.4rem' }}>
              Are you sure you want to remove "{deleteSkillTarget?.name}"?
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              This action will remove the skill and its historical progress from your portfolio and dashboard metrics.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MySkills;
