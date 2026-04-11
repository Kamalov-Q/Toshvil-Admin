import { apiClient } from './axios';
import type { 
    Leadership, 
    Manager, 
    LeadershipResponse, 
    ManagerResponse, 
    GetManagementParams,
    CreateLeadershipDto,
    UpdateLeadershipDto,
    CreateManagerDto,
    UpdateManagerDto
} from '../types/management.types';

// Leadership API
export const getLeaderships = async (params: GetManagementParams = {}) => {
    const response = await apiClient.get<LeadershipResponse>('/management/leadership', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
            ...(params.districtId && { districtId: params.districtId }),
            ...(params.departmentId && { departmentId: params.departmentId }),
            ...(params.positionId && { positionId: params.positionId }),
        },
    });
    return response.data;
};

export const getLeadership = async (id: string) => {
    const response = await apiClient.get<Leadership>(`/management/leadership/${id}`);
    return response.data;
};

export const createLeadership = async (data: CreateLeadershipDto) => {
    const response = await apiClient.post<Leadership>('/management/leadership', data);
    return response.data;
};

export const updateLeadership = async (id: string, data: UpdateLeadershipDto) => {
    const response = await apiClient.patch<Leadership>(`/management/leadership/${id}`, data);
    return response.data;
};

export const deleteLeadership = async (id: string) => {
    const response = await apiClient.delete(`/management/leadership/${id}`);
    return response.data;
};

// Manager API
export const getManagers = async (params: GetManagementParams = {}) => {
    const response = await apiClient.get<ManagerResponse>('/management/manager', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
            ...(params.districtId && { districtId: params.districtId }),
        },
    });
    return response.data;
};

export const getManager = async (id: string) => {
    const response = await apiClient.get<Manager>(`/management/manager/${id}`);
    return response.data;
};

export const createManager = async (data: CreateManagerDto) => {
    const response = await apiClient.post<Manager>('/management/manager', data);
    return response.data;
};

export const updateManager = async (id: string, data: UpdateManagerDto) => {
    const response = await apiClient.patch<Manager>(`/management/manager/${id}`, data);
    return response.data;
};

export const deleteManager = async (id: string) => {
    const response = await apiClient.delete(`/management/manager/${id}`);
    return response.data;
};
