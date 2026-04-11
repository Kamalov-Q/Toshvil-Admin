import { z } from 'zod';
import type { Department } from './department.types';

export const CreatePositionSchema = z.object({
    nameUz: z.string().min(1, 'Name UZ is required').max(255),
    nameRu: z.string().min(1, 'Name RU is required').max(255),
    nameEn: z.string().min(1, 'Name EN is required').max(255),
    departmentId: z.string().uuid('Invalid department ID'),
});

export const UpdatePositionSchema = CreatePositionSchema.partial();

export type CreatePositionDto = z.infer<typeof CreatePositionSchema>;
export type UpdatePositionDto = z.infer<typeof UpdatePositionSchema>;

export interface Position {
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    departmentId: string;
    department?: Department;
    createdAt: string;
    updatedAt: string;
}

export interface GetPositionsParams {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
}

export interface PositionsResponse {
    data: Position[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
