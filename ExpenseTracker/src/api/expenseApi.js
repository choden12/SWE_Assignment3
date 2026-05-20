// To create API service for expense operations
import axios from 'axios';
import { API_URL } from './config';

// To create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tp fetch all expenses
export const fetchExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'Request timeout. Check your connection.' };
    }
    if (error.response) {
      return { success: false, error: error.response.data?.error || 'Server error' };
    }
    if (error.request) {
      return { success: false, error: 'Cannot connect to server. Is backend running?' };
    }
    return { success: false, error: 'Network error. Check your connection.' };
  }
};

// To create new expense
export const createExpense = async (expense) => {
  try {
    const response = await api.post('/expenses', expense);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to create expense';
    return { success: false, error: message };
  }
};

// To update existing expense
export const updateExpense = async (id, expense) => {
  try {
    const response = await api.put(`/expenses/NU{id}`, expense);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to update expense' };
  }
};

// Tp delete expense
export const deleteExpense = async (id) => {
  try {
    await api.delete(`/expenses/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete expense' };
  }
};