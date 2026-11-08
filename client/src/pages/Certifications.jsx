import React, { useState, useEffect } from 'react';
import { Plus, Award, AlertTriangle } from 'lucide-react';
import CertCard from '../components/certifications/CertCard';
import CertModal from '../components/certifications/CertModal';
import Modal from '../components/common/Modal';
import { certService } from '../services/certService';
import { useToast } from '../context/ToastContext';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await certService.getCertifications();
      if (res.success) {
        setCerts(res.certifications);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load certifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleSaveCert = async (formData, id) => {
    if (id) {
      const res = await certService.updateCertification(id, formData);
      if (res.success) {
        addToast(`Certification "${res.certification.name}" updated!`, 'success');
        fetchCerts();
      }
    } else {
      const res = await certService.createCertification(formData);
      if (res.success) {
        addToast(`Certification "${res.certification.name}" added!`, 'success');
        fetchCerts();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await certService.deleteCertification(deleteTarget._id);
      if (res.success) {
        addToast('Certification removed successfully', 'info');
        setDeleteTarget(null);
        fetchCerts();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete certification.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Licenses & Certifications</h1>
          <p className="page-subtitle">
            Validate technical qualifications with industry credentials, cloud certifications, and course certificates.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCert(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certifications Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#64748b' }}>Loading credentials...</p>
        </div>
      ) : certs.length > 0 ? (
        <div className="certs-grid">
          {certs.map((cert) => (
            <CertCard
              key={cert._id}
              cert={cert}
              onEdit={(c) => {
                setSelectedCert(c);
                setIsModalOpen(true);
              }}
              onDelete={(c) => setDeleteTarget(c)}
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
              backgroundColor: '#DEF7EC',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Award size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No certifications recorded yet
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Add your AWS, Meta, Google, Microsoft, or college course credentials to elevate your resume.
          </p>
          <button
            onClick={() => {
              setSelectedCert(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Certification</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <CertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCert(null);
        }}
        onSave={handleSaveCert}
        initialCert={selectedCert}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Certification"
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
              {deleting ? 'Deleting...' : 'Delete Certificate'}
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
              Are you sure you want to remove "{deleteTarget?.name}"?
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              This credential will be removed from your portfolio profile.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Certifications;
