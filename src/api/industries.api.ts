import { apiClient } from './axios';
import type { Industry, GetIndustriesParams, IndustriesResponse } from '../types/industry.types';

export interface CreateIndustryDto {
    nameUz: string;
    nameRu?: string;
    nameEn?: string;
    latitude: number;
    longitude: number;
    districtId: string;
}

export type UpdateIndustryDto = Partial<CreateIndustryDto>;

export const getIndustries = async (params: GetIndustriesParams = {}): Promise<IndustriesResponse> => {
    const response = await apiClient.get<IndustriesResponse>('/industries', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.districtId && { districtId: params.districtId }),
            ...(params.name && { name: params.name }),
        },
    });
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
