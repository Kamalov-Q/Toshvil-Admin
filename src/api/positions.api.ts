import { apiClient } from './axios';
import type { 
    Position, 
    PositionsResponse, 
    GetPositionsParams,
    CreatePositionDto,
    UpdatePositionDto
} from '../types/position.types';

export const getPositions = async (params: GetPositionsParams = {}) => {
    const response = await apiClient.get<PositionsResponse>('/positions', {
        params: {
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
            ...(params.departmentId && { departmentId: params.departmentId }),
        },
    });
    return response.data;
};

export const getPosition = async (id: string) => {
    const response = await apiClient.get<Position>(`/positions/${id}`);
    return response.data;
};

export const createPosition = async (data: CreatePositionDto) => {
    const response = await apiClient.post<Position>('/positions', data);
    return response.data;
};

export const updatePosition = async (id: string, data: UpdatePositionDto) => {
    const response = await apiClient.patch<Position>(`/positions/${id}`, data);
    return response.data;
};

export const deletePosition = async (id: string) => {
    const response = await apiClient.delete(`/positions/${id}`);
    return response.data;
};
