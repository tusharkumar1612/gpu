import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toasts: Toast[];
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  toasts: [],
  isModalOpen: false,
  modalContent: null,

  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, toast.duration || 5000);
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  openModal: (content) => {
    set({ isModalOpen: true, modalContent: content });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalContent: null });
  },
}));

