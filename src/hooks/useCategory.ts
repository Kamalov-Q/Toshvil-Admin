import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { toast } from '../utils/toast';
import { 
    type Category, 
    type CategoryResponse, 
    type CreateCategoryDto, 
    type UpdateCategoryDto 
} from '../types/category.types';

export const useCategories = (params?: { page: number; limit: number; search?: string }) => {
    return useQuery<CategoryResponse>({
        queryKey: ['categories', params],
        queryFn: async () => {
            const { data } = await apiClient.get('/category', { params });
            return data;
        },
    });
};

export const useCategory = (id: string) => {
    return useQuery<Category>({
        queryKey: ['category', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/category/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCategoryDto) => {
            const { data } = await apiClient.post('/category/admin', payload);
            return data;
        },
        onSuccess: () => {
            toast.success('Kategoriya muvaffaqiyatli yaratildi');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Kategoriyani yaratishda xatolik yuz berdi');
        },
    });
};

export const useUpdateCategory = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateCategoryDto) => {
            const { data } = await apiClient.patch(`/category/admin/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            toast.success('Kategoriya muvaffaqiyatli yangilandi');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', id] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Kategoriyani yangilashda xatolik yuz berdi');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.delete(`/category/admin/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success('Kategoriya muvaffaqiyatli o\'chirildi');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Kategoriyani o\'chirishda xatolik yuz berdi');
        },
    });
};
