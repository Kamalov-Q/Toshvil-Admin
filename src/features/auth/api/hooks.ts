import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginDto, LoginResponse, RefreshResponse } from '../schemas/schema';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/axios';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: async (credentials: LoginDto) => {
            const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            setAuth(data?.admin as any, data.accessToken, data.refreshToken);
            toast.success(`Welcome back, ${data.admin.email}!`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Login failed. Please check your credentials.';
            toast.error(errorMessage);
            console.error('Login error:', error);
        },
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/auth/logout');
        },
        onSuccess: () => {
            logout();
            toast.success('Logged out successfully');
            window.location.href = '/login';
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Logout failed';
            toast.error(errorMessage);
            logout(); // Still logout locally
        },
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async (refreshToken: string) => {
            const response = await apiClient.post<RefreshResponse>('/auth/refresh', {
                refreshToken,
            });
            return response.data;
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Token refresh failed';
            console.error('Refresh token error:', errorMessage);
        },
    });
};

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/dashboard');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};