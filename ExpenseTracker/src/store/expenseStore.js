// For expense state management using Zustand
import { create } from 'zustand';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenseApi';

const useExpenseStore = create((set, get) => ({
  // State
  expenses: [],
  categories: [
    { id: '1', name: 'Food',  color: '#FF6B6B' },
    { id: '2', name: 'Transport',  color: '#4ECDC4' },
    { id: '3', name: 'Shopping',  color: '#45B7D1' },
    { id: '4', name: 'Entertainment',  color: '#96CEB4' },
    { id: '5', name: 'Bills',  color: '#FFEAA7' },
  ],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  
  // For Load all expenses
  loadExpenses: async () => {
    set({ loading: true, error: null });
    const result = await fetchExpenses();
    if (result.success) {
      set({ expenses: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },
  
  // For Add new expense
  addExpense: async (expenseData) => {
    set({ loading: true, error: null });
    const result = await createExpense(expenseData);
    if (result.success) {
      set(state => ({ 
        expenses: [result.data, ...state.expenses],
        loading: false 
      }));
      return { success: true };
    } else {
      set({ error: result.error, loading: false });
      return { success: false, error: result.error };
    }
  },
  
  // To Update expense
  updateExpense: async (id, expenseData) => {
    set({ loading: true, error: null });
    const result = await updateExpense(id, expenseData);
    if (result.success) {
      set(state => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...expenseData } : e),
        loading: false
      }));
      return { success: true };
    } else {
      set({ error: result.error, loading: false });
      return { success: false, error: result.error };
    }
  },
  
  // To delete expense
deleteExpense: async (id) => {
  set({ loading: true, error: null });
  try {
    const result = await deleteExpense(id); // This calls your API
    if (result.success) {
      set(state => ({
        expenses: state.expenses.filter(e => e.id !== id),
        loading: false
      }));
      return { success: true };
    } else {
      set({ error: result.error, loading: false });
      return { success: false, error: result.error };
    }
  } catch (error) {
    set({ error: 'Failed to delete expense', loading: false });
    return { success: false };
  }
},
  
  // For Search and Filter
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  clearFilters: () => set({ searchQuery: '', selectedCategory: null }),
  
  // Get filtered expenses
  getFilteredExpenses: () => {
    const { expenses, searchQuery, selectedCategory } = get();
    let filtered = [...expenses];
    
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(e => e.categoryId === selectedCategory);
    }
    
    return filtered;
  },
  
  getTotalExpenses: () => {
    const filtered = get().getFilteredExpenses();
    return filtered.reduce((sum, e) => sum + e.amount, 0);
  }
}));

export default useExpenseStore;