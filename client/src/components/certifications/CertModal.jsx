import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const CertModal = ({ isOpen, onClose, onSave, initialCert = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: new Date().toISOString().split('T')[0],
    credentialUrl: '',
    credentialId: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCert) {
      setFormData({
        name: initialCert.name || '',
        issuingOrganization: initialCert.issuingOrganization || '',
        issueDate: initialCert.issueDate
          ? new Date(initialCert.issueDate).toISOString().split('T')[0]
          : '',
        credentialUrl: initialCert.credentialUrl || '',
        credentialId: initialCert.credentialId || '',
      });
    } else {
      setFormData({
        name: '',
        issuingOrganization: '',
        issueDate: new Date().toISOString().split('T')[0],
        credentialUrl: '',
        credentialId: '',
      });
    }
    setErrors({});
  }, [initialCert, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Certification name is required';
    if (!formData.issuingOrganization.trim()) {
      errs.issuingOrganization = 'Issuing organization is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(formData, initialCert?._id);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.message || err.message || 'Error saving certification',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCert ? 'Edit Certification' : 'Add New Certification'}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : initialCert ? 'Update Certificate' : 'Add Certificate'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div
            style={{
              padding: '0.75rem',
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {errors.general}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="cert-name">
            Certification Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="cert-name"
            name="name"
            type="text"
            className="form-input"
            placeholder="e.g. AWS Certified Cloud Practitioner"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cert-org">
            Issuing Organization <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="cert-org"
            name="issuingOrganization"
            type="text"
            className="form-input"
            placeholder="e.g. Amazon Web Services, Meta, Coursera"
            value={formData.issuingOrganization}
            onChange={handleChange}
          />
          {errors.issuingOrganization && (
            <div className="form-error">{errors.issuingOrganization}</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="cert-date">
              Issue Date
            </label>
            <input
              id="cert-date"
              name="issueDate"
              type="date"
              className="form-input"
              value={formData.issueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cert-id">
              Credential ID (Optional)
            </label>
            <input
              id="cert-id"
              name="credentialId"
              type="text"
              className="form-input"
              placeholder="e.g. AWS-123456"
              value={formData.credentialId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="cert-url">
            Credential Verification URL (Optional)
          </label>
          <input
            id="cert-url"
            name="credentialUrl"
            type="url"
            className="form-input"
            placeholder="https://verification.example.com/certificate/123"
            value={formData.credentialUrl}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CertModal;
