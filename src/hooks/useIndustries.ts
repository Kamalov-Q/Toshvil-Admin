import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getIndustries, 
    getIndustry, 
    createIndustry, 
    updateIndustry, 
    deleteIndustry 
} from '../api/industries.api';
import type { UpdateIndustryDto } from '../api/industries.api';
import type { GetIndustriesParams } from '../types/industry.types';

import { toast } from '../utils/toast';

export const useIndustries = (params: GetIndustriesParams = {}) => {
    return useQuery({
        queryKey: ['industries', params],
        queryFn: () => getIndustries(params),
    });
};

export const useIndustry = (id: string) => {
    return useQuery({
        queryKey: ['industry', id],
        queryFn: () => getIndustry(id),
        enabled: !!id,
    });
};

export const useCreateIndustry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIndustry,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['industries'] });
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success(`"${data.nameUz}" sanoat zonasi muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Sanoat zonasini yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateIndustry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateIndustryDto }) => updateIndustry(id, data),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['industries'] });
            queryClient.invalidateQueries({ queryKey: ['industry', id] });
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success(`"${data.nameUz}" sanoat zonasi muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Sanoat zonasini yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteIndustry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteIndustry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['industries'] });
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success('Sanoat zonasi muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Sanoat zonasini o\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};
