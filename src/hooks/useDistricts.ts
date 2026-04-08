import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getDistricts, 
    getDistrict, 
    createDistrict, 
    updateDistrict, 
    deleteDistrict 
} from '../api/districts.api';
import type {
    UpdateDistrictDto, 
    GetDistrictsParams 
} from '../types/district.types';
import { toast } from '../utils/toast';

export const useDistricts = (params: GetDistrictsParams = {}) => {
    return useQuery({
        queryKey: ['districts', params],
        queryFn: () => getDistricts(params),
        staleTime: 10 * 60 * 1000, // 10 minutes (stale time)
        gcTime: 30 * 60 * 1000, // 30 minutes (cache time)
    });
};

export const useDistrict = (id: string) => {
    return useQuery({
        queryKey: ['district', id],
        queryFn: () => getDistrict(id),
        enabled: !!id,
    });
};

export const useCreateDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDistrict,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success(`"${data.nameUz}" tumani muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Tumanni yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateDistrict = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDistrictDto) => updateDistrict(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            queryClient.invalidateQueries({ queryKey: ['district', id] });
            toast.success(`"${data.nameUz}" tumani muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Tumanni yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDistrict,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            toast.success('Tuman muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Tumanni o\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};
