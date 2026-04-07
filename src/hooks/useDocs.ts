import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { toast } from '../utils/toast';
import { 
    type DocsResponse, 
    type CreateDocsDto, 
    type UpdateDocsDto 
} from '../types/docs.types';

export const useDocs = (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) => {
    return useQuery<DocsResponse>({
        queryKey: ['docs', params],
        queryFn: async () => {
            // Note: Use the admin endpoint to get all docs
            const { data } = await apiClient.get('/docs/admin/all', { params });
            return data;
        },
    });
};

export const useCreateDoc = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateDocsDto) => {
            const { data } = await apiClient.post('/docs/admin', payload);
            return data;
        },
        onSuccess: () => {
            toast.success('Document created successfully');
            queryClient.invalidateQueries({ queryKey: ['docs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create document');
        },
    });
};

export const useUpdateDoc = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateDocsDto) => {
            const { data } = await apiClient.patch(`/docs/admin/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            toast.success('Document updated successfully');
            queryClient.invalidateQueries({ queryKey: ['docs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update document');
        },
    });
};

export const useDeleteDoc = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.delete(`/docs/admin/${id}`);
            return data;
        },
        onSuccess: () => {
            toast.success('Document deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['docs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete document');
        },
    });
};
