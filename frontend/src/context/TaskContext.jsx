import React, { createContext, useState, useContext, useEffect } from 'react';
import { tasksAPI } from '../services/api';

// Create Task Context
const TaskContext = createContext();

// Custom hook to use task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

// Task Provider Component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch all tasks for user
  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await tasksAPI.getTasks(filters);
      if (response.success) {
        setTasks(response.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      if (response.success) {
        setTasks(prev => [response.task, ...prev]);
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, message: error.message };
    }
  };

  // Update task
const updateTask = async (taskId, taskData) => {
  try {
    const response = await tasksAPI.updateTask(taskId, taskData);
    if (response.success) {
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId ? response.task : task
        )
      );
      return { success: true, message: response.message };
    }
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, message: error.message };
  }
};

  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await tasksAPI.updateTaskStatus(taskId, status);
      if (response.success) {
        setTasks(prev => 
          prev.map(task => 
            task._id === taskId ? response.task : task
          )
        );
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      return { success: false, message: error.message };
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await tasksAPI.deleteTask(taskId);
      if (response.success) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, message: error.message };
    }
  };

  // Fetch task statistics
  const fetchTaskStats = async () => {
    try {
      const response = await tasksAPI.getTaskStats();
      if (response.success) {
        setStats(response);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, []);

  // Context value
  const value = {
    tasks,
    loading,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    fetchTaskStats
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;