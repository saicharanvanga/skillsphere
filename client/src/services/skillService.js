import api from './api';

export const skillService = {
  getSkills: async (params = {}) => {
    const res = await api.get('/skills', { params });
    return res.data;
  },

  getSkillById: async (id) => {
    const res = await api.get(`/skills/${id}`);
    return res.data;
  },

  createSkill: async (skillData) => {
    const res = await api.post('/skills', skillData);
    return res.data;
  },

  updateSkill: async (id, skillData) => {
    const res = await api.put(`/skills/${id}`, skillData);
    return res.data;
  },

  updateProgress: async (id, progress) => {
    const res = await api.patch(`/skills/${id}/progress`, { progress });
    return res.data;
  },

  deleteSkill: async (id) => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },
};
