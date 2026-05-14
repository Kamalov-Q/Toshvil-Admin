import { apiClient } from './axios';
import type { Industry } from '../types/industry.types';

export interface CreateIndustryDto {
    nameUz: string;
    nameRu?: string;
    nameEn?: string;
    latitude: number;
    longitude: number;
    districtId: string;
}

export type UpdateIndustryDto = Partial<CreateIndustryDto>;

export const getIndustries = async (districtId?: string): Promise<Industry[]> => {
    const params = districtId ? { districtId } : {};
    const response = await apiClient.get('/industries', { params });
    return response.data;
};

export const getIndustry = async (id: string): Promise<Industry> => {
    const response = await apiClient.get(`/industries/${id}`);
    return response.data;
};

export const createIndustry = async (data: CreateIndustryDto): Promise<Industry> => {
    const response = await apiClient.post('/industries', data);
    return response.data;
};

export const updateIndustry = async (id: string, data: UpdateIndustryDto): Promise<Industry> => {
    const response = await apiClient.patch(`/industries/${id}`, data);
    return response.data;
};

export const deleteIndustry = async (id: string): Promise<void> => {
    await apiClient.delete(`/industries/${id}`);
};
