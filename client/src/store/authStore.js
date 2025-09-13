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

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/auth/register', userData);
          
          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Registration failed';
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

      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axios.put('/api/auth/profile', userData);
          
          set({
            user: response.data.user,
            isLoading: false,
          });
          
          toast.success('Profile updated successfully!');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Update failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      addToWishlist: async (productId) => {
        try {
          await axios.post(`/api/auth/wishlist/${productId}`);
          
          // Update user's wishlist in state
          const { user } = get();
          if (user && !user.wishlist.includes(productId)) {
            set({
              user: {
                ...user,
                wishlist: [...user.wishlist, productId]
              }
            });
          }
          
          toast.success('Added to wishlist!');
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to add to wishlist';
          toast.error(message);
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          await axios.delete(`/api/auth/wishlist/${productId}`);
          
          // Update user's wishlist in state
          const { user } = get();
          if (user) {
            set({
              user: {
                ...user,
                wishlist: user.wishlist.filter(id => id !== productId)
              }
            });
          }
          
          toast.success('Removed from wishlist!');
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to remove from wishlist';
          toast.error(message);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
