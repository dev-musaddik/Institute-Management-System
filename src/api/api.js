import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000', // your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});
