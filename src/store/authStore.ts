import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
    id: string;
    email: string;
    role: 'admin' | 'super_admin';
    firstName?: string;
    lastName?: string;
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    hydrate: () => void;
    updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            hydrate: () => {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                const userStr = localStorage.getItem('user');

                if (accessToken && refreshToken && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        set({
                            user,
                            accessToken,
                            refreshToken,
                            isAuthenticated: true,
                        });
                    } catch (error) {
                        console.error('Failed to parse stored user:', error);
                        get().logout();
                    }
                }
            },

            updateUser: (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...updates };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    set({ user: updatedUser });
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);