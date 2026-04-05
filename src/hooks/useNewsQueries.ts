import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNewsList,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    toggleNewsPublish,
    getNewsCategoryStats,
    bulkDeleteNews,
    bulkPublishNews,
} from '../api/news.api';
import type { NewsQueryParams, NewsUpdateDto } from '../types/news.types';
import toast from 'react-hot-toast';

// Query Keys
const newsQueryKeys = {
    all: ['news'] as const,
    lists: () => [...newsQueryKeys.all, 'list'] as const,
    list: (filters: NewsQueryParams) => [...newsQueryKeys.lists(), filters] as const,
    details: () => [...newsQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...newsQueryKeys.details(), id] as const,
    stats: () => [...newsQueryKeys.all, 'stats'] as const,
};

/**
 * Fetch news list with filters
 */
export const useNewsList = (params: NewsQueryParams = {}) => {
    return useQuery({
        queryKey: newsQueryKeys.list(params),
        queryFn: () => getNewsList(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Fetch single news by ID
 */
export const useNews = (id: string) => {
    return useQuery({
        queryKey: newsQueryKeys.detail(id),
        queryFn: () => getNewsById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Create news mutation
 */
export const useCreateNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNews,
        onSuccess: (data) => {
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            // Add to cache
            const createdId = data?.data?.id || (data as any)?.id;
            if (createdId) {
                queryClient.setQueryData(newsQueryKeys.detail(createdId), data);
            }
            toast.success('News created successfully');
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to create news';
            toast.error(message);
        },
    });
};

/**
 * Update news mutation
 */
export const useUpdateNews = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NewsUpdateDto) => updateNews(id, data),
        onSuccess: (data) => {
            // Invalidate list and detail queries
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            queryClient.setQueryData(newsQueryKeys.detail(id), data);
            toast.success('News updated successfully');
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update news';
            toast.error(message);
        },
    });
};

/**
 * Delete news mutation
 */
export const useDeleteNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteNews,
        onSuccess: () => {
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            toast.success('News deleted successfully');
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete news';
            toast.error(message);
        },
    });
};

/**
 * Toggle news publish status
 */
export const useToggleNewsPublish = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (isPublished: boolean) => toggleNewsPublish(id, isPublished),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.detail(id),
            });
            toast.success(
                `News ${variables ? 'published' : 'unpublished'} successfully`
            );
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update news status';
            toast.error(message);
        },
    });
};

/**
 * Get news category statistics
 */
export const useNewsCategoryStats = () => {
    return useQuery({
        queryKey: newsQueryKeys.stats(),
        queryFn: getNewsCategoryStats,
        staleTime: 10 * 60 * 1000,
    });
};

/**
 * Bulk delete news
 */
export const useBulkDeleteNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkDeleteNews,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            toast.success('News deleted successfully');
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete news';
            toast.error(message);
        },
    });
};

/**
 * Bulk publish news
 */
export const useBulkPublishNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ ids, isPublished }: { ids: string[]; isPublished: boolean }) =>
            bulkPublishNews(ids, isPublished),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: newsQueryKeys.lists(),
            });
            toast.success('News status updated successfully');
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update news status';
            toast.error(message);
        },
    });
};