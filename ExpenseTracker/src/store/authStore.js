// for authentication state management using Zustand
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // For dummy users database (in production, this would be on backend)
  users: [
    { id: '1', email: 'user@example.com', password: 'password123', name: 'Demo User' },
    { id: '2', email: 'test@test.com', password: 'test123', name: 'Test User' }
  ],
  
  // For Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    //For Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // To Find user
    const user = get().users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // To remove password before storing
      const { password, ...userWithoutPassword } = user;
      set({ 
        user: userWithoutPassword, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    } else {
      set({ 
        error: 'Invalid email or password', 
        isLoading: false 
      });
      return { success: false, error: 'Invalid email or password' };
    }
  },
  
  // For Signup function
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // To Check if user exists
    const existingUser = get().users.find(u => u.email === email);
    
    if (existingUser) {
      set({ error: 'Email already exists', isLoading: false });
      return { success: false, error: 'Email already exists' };
    }
    
    // To Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    set(state => ({
      users: [...state.users, newUser],
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      isAuthenticated: true,
      isLoading: false
    }));
    
    await AsyncStorage.setItem('user', JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name }));
    return { success: true };
  },
  
  // For Logout function
  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('user');
  },
  
  // Check authentication on app start
  checkAuth: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        set({ user: JSON.parse(user), isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }
}));

export default useAuthStore;