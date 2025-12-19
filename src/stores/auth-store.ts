import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (address: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await delay(1500); // Simulate API call
        
        // Mock successful login
        if (email && password) {
          const mockUser: User = {
            id: '1',
            name: email.split('@')[0],
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            token: 'mock-jwt-token-' + Date.now(),
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('Invalid credentials');
        }
      },

      loginWithWallet: async (address: string) => {
        set({ isLoading: true });
        await delay(1500);
        
        const mockUser: User = {
          id: '2',
          name: `${address.slice(0, 6)}...${address.slice(-4)}`,
          email: `${address.slice(0, 8)}@wallet.eth`,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: mockUser,
          isAuthenticated: true,
          token: 'mock-wallet-token-' + Date.now(),
          isLoading: false,
        });
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        await delay(2000);
        
        if (name && email && password) {
          const mockUser: User = {
            id: '3',
            name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            token: 'mock-jwt-token-' + Date.now(),
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('All fields are required');
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);


