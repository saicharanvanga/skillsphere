import api from './api';

export const certService = {
  getCertifications: async () => {
    const res = await api.get('/certifications');
    return res.data;
  },

  getCertificationById: async (id) => {
    const res = await api.get(`/certifications/${id}`);
    return res.data;
  },

  createCertification: async (certData) => {
    const res = await api.post('/certifications', certData);
    return res.data;
  },

  updateCertification: async (id, certData) => {
    const res = await api.put(`/certifications/${id}`, certData);
    return res.data;
  },

  deleteCertification: async (id) => {
    const res = await api.delete(`/certifications/${id}`);
    return res.data;
  },
};
