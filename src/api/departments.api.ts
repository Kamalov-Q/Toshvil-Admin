import { apiClient } from './axios';
import type { 
    Department, 
    DepartmentsResponse, 
    GetDepartmentsParams,
    CreateDepartmentDto,
    UpdateDepartmentDto
} from '../types/department.types';

export const getDepartments = async (params: GetDepartmentsParams = {}) => {
    const response = await apiClient.get<DepartmentsResponse>('/departments', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
        },
    });
    return response.data;
};

export const getDepartment = async (id: string) => {
    const response = await apiClient.get<Department>(`/departments/${id}`);
    return response.data;
};

export const createDepartment = async (data: CreateDepartmentDto) => {
    const response = await apiClient.post<Department>('/departments', data);
    return response.data;
};

export const updateDepartment = async (id: string, data: UpdateDepartmentDto) => {
    const response = await apiClient.patch<Department>(`/departments/${id}`, data);
    return response.data;
};

export const deleteDepartment = async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
};
