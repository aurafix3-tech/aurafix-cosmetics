import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
          });

          const { token, user } = response.data;
          
          // Check if user is admin
          if (user.role !== 'admin') {
            set({ isLoading: false });
            toast.error('Access denied. Admin privileges required.');
            return { success: false, message: 'Access denied' };
          }
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Remove axios default header
        delete axios.defaults.headers.common['Authorization'];
        
        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('/api/auth/me');
          
          // Check if user is still admin
          if (response.data.role !== 'admin') {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            delete axios.defaults.headers.common['Authorization'];
            return;
          }
          
          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          delete axios.defaults.headers.common['Authorization'];
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
