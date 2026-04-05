import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateDistrictDto, UpdateDistrictDto, District } from '../../../districts/schemas/schema';
import { apiClient } from '@/api/axios';
import toast from 'react-hot-toast';

export interface GetDistrictsParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
}

export interface DistrictsResponse {
    data: District[];
    total: number;
    page: number;
    limit: number;
}

export const useDistricts = (params: GetDistrictsParams = {}) => {
    return useQuery<DistrictsResponse>({
        queryKey: ['districts', params],
        queryFn: async () => {
            const response = await apiClient.get<DistrictsResponse>('/districts', {
                params: {
                    page: params.page || 1,
                    limit: params.limit || 1000,
                    ...(params.type && { type: params.type }),
                    ...(params.search && { search: params.search }),
                },
            });
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
};

export const useDistrict = (id: string) => {
    return useQuery<District>({
        queryKey: ['district', id],
        queryFn: async () => {
            const response = await apiClient.get<District>(`/districts/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCreateDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateDistrictDto) => {
            const response = await apiClient.post<District>('/districts/admin', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success(`District "${data.nameUz}" created successfully`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Failed to create district';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateDistrict = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateDistrictDto) => {
            const response = await apiClient.patch<District>(`/districts/admin/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            queryClient.invalidateQueries({ queryKey: ['district', id] });
            toast.success(`District "${data.nameUz}" updated successfully`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Failed to update district';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/districts/admin/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success('District deleted successfully');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Failed to delete district';
            toast.error(errorMessage);
        },
    });
};