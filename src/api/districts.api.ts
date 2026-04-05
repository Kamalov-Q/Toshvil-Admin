import { apiClient } from './axios';
import type { 
    District, 
    DistrictsResponse, 
    GetDistrictsParams,
    CreateDistrictDto,
    UpdateDistrictDto
} from '../types/district.types';

export const getDistricts = async (params: GetDistrictsParams = {}) => {
    const response = await apiClient.get<DistrictsResponse>('/districts', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.type && { type: params.type }),
            ...(params.search && { search: params.search }),
        },
    });
    return response.data;
};

export const getDistrict = async (id: string) => {
    const response = await apiClient.get<District>(`/districts/${id}`);
    return response.data;
};

export const createDistrict = async (data: CreateDistrictDto) => {
    const response = await apiClient.post<District>('/districts/admin', data);
    return response.data;
};

export const updateDistrict = async (id: string, data: UpdateDistrictDto) => {
    const response = await apiClient.patch<District>(`/districts/admin/${id}`, data);
    return response.data;
};

export const deleteDistrict = async (id: string) => {
    const response = await apiClient.delete(`/districts/admin/${id}`);
    return response.data;
};
