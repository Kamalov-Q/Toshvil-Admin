import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import type { CreateNewsDto, UpdateNewsDto, News } from '../schemas/schema';
import { toast } from '../../../utils/toast';

export interface GetNewsParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    isPublished?: boolean;
}

export interface NewsResponse {
    data: News[];
    total: number;
    page: number;
    limit: number;
}

// Get all news with pagination and filters
export const useNews = (params: GetNewsParams = {}) => {
    return useQuery<NewsResponse>({
        queryKey: ['news', params],
        queryFn: async () => {
            const response = await apiClient.get<NewsResponse>('/news/admin/all', {
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.category && { category: params.category }),
                    ...(params.search && { search: params.search }),
                    ...(params.isPublished !== undefined && { isPublished: params.isPublished }),
                },
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
};

// Get single news item
export const useNewsItem = (id: string) => {
    return useQuery<News>({
        queryKey: ['news', id],
        queryFn: async () => {
            const response = await apiClient.get<News>(`/news/admin/${id}`);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Create new news
export const useCreateNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateNewsDto) => {
            const response = await apiClient.post<News>('/news/admin', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            queryClient.setQueryData(['news', data.id], data);
            toast.success(`News "${data.titleUz}" created successfully`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to create news';
            toast.error(errorMessage);
            console.error('Create news error:', error);
        },
    });
};

// Update news
export const useUpdateNews = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateNewsDto) => {
            const response = await apiClient.patch<News>(`/news/admin/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            queryClient.invalidateQueries({ queryKey: ['news', id] });
            queryClient.setQueryData(['news', id], data);
            toast.success(`News "${data.titleUz}" updated successfully`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to update news';
            toast.error(errorMessage);
            console.error('Update news error:', error);
        },
    });
};

// Delete news
export const useDeleteNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/news/admin/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            toast.success('News deleted successfully');
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Failed to delete news';
            toast.error(errorMessage);
            console.error('Delete news error:', error);
        },
    });
};

// Bulk publish/unpublish
export const usePublishNews = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (isPublished: boolean) => {
            const response = await apiClient.patch<News>(`/news/admin/${id}`, {
                isPublished,
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            queryClient.setQueryData(['news', id], data);
            toast.success(
                `News ${data.isPublished ? 'published' : 'unpublished'} successfully`
            );
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Failed to update news status';
            toast.error(errorMessage);
        },
    });
};