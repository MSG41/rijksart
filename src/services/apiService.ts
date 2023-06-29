import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const BASE_URL = import.meta.env.VITE_APP_API_URL;

export default {
  async get(path: string, params: Record<string, string | number>) {
    params = { ...params, key: API_KEY, format: 'json' };
    const response = await axios.get(`${BASE_URL}${path}`, { params });
    return response.data;
  },
};
