import { create } from "zustand";

interface UIState {
    isDarkMode: boolean;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isDarkMode: localStorage.getItem('theme') === 'dark',
    sidebarOpen: true,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',

    toggleTheme: () => {
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark');
            return { theme: newTheme, isDarkMode: newTheme === 'dark' };
        });
    },

    toggleSidebar() {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    setSidebarOpen(open) {
        set({ sidebarOpen: open })
    },

}))