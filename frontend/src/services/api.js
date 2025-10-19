import axios from 'axios';

const base = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://telly-ai-5lss-kriyagnis-projects.vercel.app' : 'http://localhost:4000')).replace(/\/$/, '');

export const api = {
  async post(path, body) {
    const { data } = await axios.post(`${base}${path.startsWith('/') ? path : `/${path}`}`, body);
    return { data };
  },
  
  async postForm(path, formData) {
    const { data } = await axios.post(`${base}${path.startsWith('/') ? path : `/${path}`}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data };
  }
};


