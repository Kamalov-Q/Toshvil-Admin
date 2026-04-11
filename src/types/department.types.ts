import { z } from 'zod';

export const CreateDepartmentSchema = z.object({
    nameUz: z.string().min(1, 'Name UZ is required').max(255),
    nameRu: z.string().min(1, 'Name RU is required').max(255),
    nameEn: z.string().min(1, 'Name EN is required').max(255),
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export type CreateDepartmentDto = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentDto = z.infer<typeof UpdateDepartmentSchema>;

export interface Department {
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDepartmentsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface DepartmentsResponse {
    data: Department[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
