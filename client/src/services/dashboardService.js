import api from './api';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  getMyPortfolio: async () => {
    const res = await api.get('/portfolio/me');
    return res.data;
  },

  getPublicPortfolio: async (userId) => {
    const res = await api.get(`/portfolio/public/${userId}`);
    return res.data;
  },
};
