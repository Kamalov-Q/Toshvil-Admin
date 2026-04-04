import { apiClient } from "@/api/axios";
import type { CreateLotDto, Lot, UpdateLotDto } from "../schemas/schemas";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GetLotsParams {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    tradeType?: string;
    districtId: string;
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
                params
            });
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lots'] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            queryClient.invalidateQueries({ queryKey: ['lot', id] });
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
            queryClient.invalidateQueries({ queryKey: ['lots'] });
        },
    });
};