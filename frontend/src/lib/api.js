import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let cachedSession = null;
let lastSessionCheck = 0;
const SESSION_CACHE_TIME = 60000; // 1 minute

// Add request interceptor: attach Supabase session token or Bypass token
api.interceptors.request.use(async (config) => {
  try {
    const now = Date.now();
    let session = cachedSession;

    // 1. Only re-fetch if cache is expired or missing
    if (!session || (now - lastSessionCheck > SESSION_CACHE_TIME)) {
      const { data } = await supabase.auth.getSession();
      session = data.session;
      cachedSession = session;
      lastSessionCheck = now;
    }

    // 1. If we have a real session, use it
    if (session?.access_token) {
      config.headers.Authorization = session.access_token;
    } 
    // 2. Otherwise, check for Developer Admin Bypass
    else {
      const bypassToken = localStorage.getItem('admin_bypass_token');
      if (bypassToken) {
        config.headers.Authorization = bypassToken;
      }
    }
  } catch (error) {
    console.error("Auth interceptor error:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;
