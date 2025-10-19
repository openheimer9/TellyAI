import axios from 'axios';

const base = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://your-backend-url.vercel.app' : 'http://localhost:4000');

export const api = {
  async post(path, body) {
    const { data } = await axios.post(`${base}${path}`, body);
    return { data };
  },
  
  async postForm(path, formData) {
    const { data } = await axios.post(`${base}${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data };
  }
};


