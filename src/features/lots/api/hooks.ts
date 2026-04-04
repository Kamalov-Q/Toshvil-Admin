import { apiClient } from "@/api/axios";
import type { CreateLotDto, Lot, UpdateLotDto } from "../schemas/schemas";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GetLotsParams {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    tradeType?: string;
    districtId?: string;
    search?: string;
}

interface LotsResponse {
    data: Lot[],
    total: number;
    page: number;
    limit: number;
}

// Get all lots with pagination and filters
export const useLots = (params: GetLotsParams) => {
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
                    ...(params.search && { search: params.search })
                }
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000 // 10 minutes
    });
};

export const useLot = (id: string) => {
    return useQuery<Lot>({
        queryKey: ['lot', id],
        queryFn: async () => {
            const response = await apiClient.get<Lot>(`/lots/admin/${id}`);
            return response.data
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}

// Create Lot 
export const useCreateLot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateLotDto) => {
            const response = await apiClient.post<Lot>('/lots/admin', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lots'] });

            // Adding to cache
            queryClient.setQueryData(['lot', data.id], data);
        },
        onError: (error: any) => {
            console.error('Create lot error: ', error.response.data || error.message);
        },
    });
};

// Update lot 
export const useUpdateLot = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateLotDto) => {
            const response = await apiClient.patch(`/lots/admin/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            queryClient.invalidateQueries({ queryKey: ['lot', id] });

            // Updating the cache
            queryClient.setQueryData(['lot', id], data);
        },
        onError: (error: any) => {
            console.error('Update lot error: ', error.response.data || error.message);
        }
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
            queryClient.invalidateQueries({ queryKey: ['lots'] });
        },
        onError: (error: any) => {
            console.error('Delete lot error: ', error.response.data || error.message);
        }
    });
};