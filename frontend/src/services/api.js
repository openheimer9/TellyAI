import axios from 'axios';

const base = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? '' : 'http://localhost:4000');

export const api = {
  async post(path, body) {
    const { data } = await axios.post(`${base}${path}`, body);
    return { data };
  },
  async postForm(path, form) {
    const { data } = await axios.post(`${base}${path}`, form);
    return { data };
  },
  async postXml(path, body) {
    const res = await axios.post(`${base}${path}`, body, { responseType: 'text' });
    return res.data;
  },
};


