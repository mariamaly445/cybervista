import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getProfile: () => API.get('/auth/profile'),
};

// Security Score API
export const scoreAPI = {
  calculateScore: () => API.post('/scores/calculate'),
  getScores: () => API.get('/scores'),
};

// Vulnerability Scan API
export const scanAPI = {
  getScans: () => API.get('/scans'),
  scheduleScan: (scanData) => API.post('/scans/schedule', scanData),
};

// Compliance API
export const complianceAPI = {
  getChecklist: (standard) => API.get(`/compliance/${standard}`),
  updateItem: (standard, itemId, data) => API.put(`/compliance/${standard}/item/${itemId}`, data),
};

// Fraud Detection API
export const fraudAPI = {
  getAlerts: () => API.get('/alerts'),
  createAlert: (alertData) => API.post('/alerts', alertData),
};

// Identity Verification API
export const identityAPI = {
  getStatus: () => API.get('/identity/status'),
  uploadDocument: (documentData) => API.post('/identity/upload', documentData),
  submitVerification: () => API.post('/identity/verify'),
};

// Error handling helper
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    return 'No response from server. Check if backend is running.';
  } else {
    return error.message || 'An error occurred';
  }
};

export default API;
