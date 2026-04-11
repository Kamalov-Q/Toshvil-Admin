import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getLeaderships, 
    getLeadership, 
    createLeadership, 
    updateLeadership, 
    deleteLeadership,
    getManagers,
    getManager,
    createManager,
    updateManager,
    deleteManager
} from '../api/management.api';
import type {
    UpdateLeadershipDto, 
    UpdateManagerDto,
    GetManagementParams 
} from '../types/management.types';
import { toast } from '../utils/toast';

// Leadership Hooks
export const useLeaderships = (params: GetManagementParams = {}) => {
    return useQuery({
        queryKey: ['leaderships', params],
        queryFn: () => getLeaderships(params),
    });
};

export const useLeadership = (id: string) => {
    return useQuery({
        queryKey: ['leadership', id],
        queryFn: () => getLeadership(id),
        enabled: !!id,
    });
};

export const useCreateLeadership = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLeadership,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leaderships'] });
            toast.success(`"${data.name}" muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateLeadership = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateLeadershipDto) => updateLeadership(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leaderships'] });
            queryClient.invalidateQueries({ queryKey: ['leadership', id] });
            toast.success(`"${data.name}" muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteLeadership = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLeadership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaderships'] });
            toast.success('Muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'O\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

// Manager Hooks
export const useManagers = (params: GetManagementParams = {}) => {
    return useQuery({
        queryKey: ['managers', params],
        queryFn: () => getManagers(params),
    });
};

export const useManager = (id: string) => {
    return useQuery({
        queryKey: ['manager', id],
        queryFn: () => getManager(id),
        enabled: !!id,
    });
};

export const useCreateManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createManager,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['managers'] });
            toast.success(`"${data.name}" muvaffaqiyatli yaratildi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Yaratishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useUpdateManager = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateManagerDto) => updateManager(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['managers'] });
            queryClient.invalidateQueries({ queryKey: ['manager', id] });
            toast.success(`"${data.name}" muvaffaqiyatli yangilandi`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Yangilashda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};

export const useDeleteManager = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteManager,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['managers'] });
            toast.success('Muvaffaqiyatli o\'chirildi');
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'O\'chirishda xatolik yuz berdi';
            toast.error(errorMessage);
        },
    });
};
