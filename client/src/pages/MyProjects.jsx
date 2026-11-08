import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, AlertTriangle } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import Modal from '../components/common/Modal';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects();
      if (res.success) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSaveProject = async (formData, id) => {
    if (id) {
      const res = await projectService.updateProject(id, formData);
      if (res.success) {
        addToast(`Project "${res.project.title}" updated successfully!`, 'success');
        fetchProjects();
      }
    } else {
      const res = await projectService.createProject(formData);
      if (res.success) {
        addToast(`Project "${res.project.title}" added to your portfolio!`, 'success');
        fetchProjects();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await projectService.deleteProject(deleteTarget._id);
      if (res.success) {
        addToast('Project deleted successfully', 'info');
        setDeleteTarget(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete project.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Projects & Practical Work</h1>
          <p className="page-subtitle">
            Curate capstone projects, open-source repositories, and software applications for recruiters.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#64748b' }}>Loading project repository...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={(p) => {
                setSelectedProject(p);
                setIsModalOpen(true);
              }}
              onDelete={(p) => setDeleteTarget(p)}
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
            <Briefcase size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No projects added yet
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Highlight your best development work, academic projects, or hackathon prototypes with live links and GitHub repos.
          </p>
          <button
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Your First Project</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={selectedProject}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Project"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
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
              {deleting ? 'Deleting...' : 'Delete Project'}
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
              Are you sure you want to remove "{deleteTarget?.title}"?
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              This will remove this project from your public placement portfolio.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProjects;
