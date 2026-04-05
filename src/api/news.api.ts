import type { NewsCreateDto, NewsUpdateDto, NewsListResponse, NewsSingleResponse, NewsQueryParams } from '../types/news.types';
import { apiClient } from './axios';

const API_BASE = '/news'

/**
 * Get all news with pagination and filters
 */
export const getNewsList = async (params: NewsQueryParams): Promise<NewsListResponse> => {
    const response = await apiClient.get<NewsListResponse>(`${API_BASE}/admin/all`, {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.category && { category: params.category }),
            ...(params.search && { search: params.search }),
            ...(params.isPublished !== undefined && { isPublished: params.isPublished }),
        },
    });
    return response.data;
};

/**
 * Get single news by ID
 */
export const getNewsById = async (id: string): Promise<NewsSingleResponse> => {
    const response = await apiClient.get<NewsSingleResponse>(`${API_BASE}/admin/${id}`);
    return response.data;
};

/**
 * Create new news
 */
export const createNews = async (data: NewsCreateDto): Promise<NewsSingleResponse> => {
    const response = await apiClient.post<NewsSingleResponse>(`${API_BASE}/admin`, data);
    return response.data;
};

/**
 * Update news
 */
export const updateNews = async (
    id: string,
    data: NewsUpdateDto
): Promise<NewsSingleResponse> => {
    const response = await apiClient.patch<NewsSingleResponse>(
        `${API_BASE}/admin/${id}`,
        data
    );
    return response.data;
};

/**
 * Delete news
 */
export const deleteNews = async (id: string): Promise<void> => {
    await apiClient.delete(`${API_BASE}/admin/${id}`);
};

/**
 * Publish/Unpublish news
 */
export const toggleNewsPublish = async (
    id: string,
    isPublished: boolean
): Promise<NewsSingleResponse> => {
    const response = await apiClient.patch<NewsSingleResponse>(
        `${API_BASE}/admin/${id}`,
        { isPublished }
    );
    return response.data;
};

/**
 * Get news count by category
 */
export const getNewsCategoryStats = async (): Promise<Record<string, number>> => {
    const response = await apiClient.get<Record<string, number>>(
        `${API_BASE}/admin/stats/category`
    );
    return response.data;
};

/**
 * Bulk delete news
 */
export const bulkDeleteNews = async (ids: string[]): Promise<void> => {
    await apiClient.post(`${API_BASE}/admin/bulk-delete`, { ids });
};

/**
 * Bulk publish news
 */
export const bulkPublishNews = async (
    ids: string[],
    isPublished: boolean
): Promise<void> => {
    await apiClient.post(`${API_BASE}/admin/bulk-publish`, { ids, isPublished });
};