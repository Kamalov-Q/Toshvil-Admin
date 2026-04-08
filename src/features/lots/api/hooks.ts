import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import type { CreateLotDto, UpdateLotDto, Lot } from '../schemas/schemas';
import { toast } from '../../../utils/toast';

export interface GetLotsParams {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    tradeType?: string;
    districtId?: string;
    search?: string;
}

export interface LotsResponse {
    data: Lot[];
    total: number;
    page: number;
    limit: number;
}

// Get all lots with pagination and filters
export const useLots = (params: GetLotsParams = {}) => {
    return useQuery<LotsResponse>({
        queryKey: ['lots', params],
        queryFn: async () => {
            const response = await apiClient.get<LotsResponse>('/lots/admin/all', {
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.status && { status: params.status }),
                    ...(params.paymentType && { paymentType: params.paymentType }),
                    ...(params.tradeType && { tradeType: params.tradeType }),
                    ...(params.districtId && { districtId: params.districtId }),
                    ...(params.search && { search: params.search }),
                },
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
    });
};

// Get single lot by ID
export const useLot = (id: string) => {
    return useQuery<Lot>({
        queryKey: ['lot', id],
        queryFn: async () => {
            const response = await apiClient.get<Lot>(`/lots/admin/${id}`);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Create new lot
export const useCreateLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateLotDto) => {
            const response = await apiClient.post<Lot>('/lots/admin', data);
            return response.data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            // Add to cache
            queryClient.setQueryData(['lot', data.id], data);
            toast.success(`Lot #${data.lotNumber} muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Lot yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
            console.error('Create lot error:', error);
        },
    });
};

// Update existing lot
export const useUpdateLot = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateLotDto) => {
            const response = await apiClient.patch<Lot>(`/lots/admin/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            queryClient.invalidateQueries({ queryKey: ['lot', id] });
            // Update cache
            queryClient.setQueryData(['lot', id], data);
            toast.success(`Lot #${data.lotNumber} muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Lotni yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
            console.error('Update lot error:', error);
        },
    });
};

// Delete lot
export const useDeleteLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/lots/admin/${id}`);
        },
        onSuccess: () => {
            // Invalidate all lots queries
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            toast.success('Lot muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Lotni o\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
            console.error('Delete lot error:', error);
        },
    });
};