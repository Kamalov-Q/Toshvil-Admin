import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getDepartments, 
    getDepartment, 
    createDepartment, 
    updateDepartment, 
    deleteDepartment 
} from '../api/departments.api';
import type {
    UpdateDepartmentDto, 
    GetDepartmentsParams 
} from '../types/department.types';
import { toast } from '../utils/toast';

export const useDepartments = (params: GetDepartmentsParams = {}) => {
    return useQuery({
        queryKey: ['departments', params],
        queryFn: () => getDepartments(params),
    });
};

export const useDepartment = (id: string) => {
    return useQuery({
        queryKey: ['department', id],
        queryFn: () => getDepartment(id),
        enabled: !!id,
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDepartment,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success(`"${data.nameUz}" bo'limi muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Bo\'limni yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateDepartment = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDepartmentDto) => updateDepartment(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            queryClient.invalidateQueries({ queryKey: ['department', id] });
            toast.success(`"${data.nameUz}" bo'limi muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Bo\'limni yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success('Bo\'lim muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Bo\'limni o\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};
