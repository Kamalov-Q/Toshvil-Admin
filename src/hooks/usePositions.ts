import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getPositions, 
    getPosition, 
    createPosition, 
    updatePosition, 
    deletePosition 
} from '../api/positions.api';
import type {
    UpdatePositionDto, 
    GetPositionsParams 
} from '../types/position.types';
import { toast } from '../utils/toast';

export const usePositions = (params: GetPositionsParams = {}) => {
    return useQuery({
        queryKey: ['positions', params],
        queryFn: () => getPositions(params),
    });
};

export const usePosition = (id: string) => {
    return useQuery({
        queryKey: ['position', id],
        queryFn: () => getPosition(id),
        enabled: !!id,
    });
};

export const useCreatePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPosition,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            toast.success(`"${data.nameUz}" lavozimi muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Lavozimni yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdatePosition = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePositionDto) => updatePosition(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            queryClient.invalidateQueries({ queryKey: ['position', id] });
            toast.success(`"${data.nameUz}" lavozimi muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Lavozimni yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeletePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            toast.success('Lavozim muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Lavozimni o\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};
