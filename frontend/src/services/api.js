import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async (token) => {
    try {
      const response = await API.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  }
};

// Tasks API functions
export const tasksAPI = {
  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await API.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create task' };
    }
  },

  // Get all tasks for user
  getTasks: async (filters = {}) => {
    try {
      const response = await API.get('/tasks', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tasks' };
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await API.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task status' };
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await API.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update task' };
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await API.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete task' };
    }
  },

  // Get task statistics
  getTaskStats: async () => {
    try {
      const response = await API.get('/tasks/stats/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stats' };
    }
  }
};

export default API;