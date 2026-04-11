import { z } from 'zod';
import type { Department } from './department.types';
import type { Position } from './position.types';
import type { District } from './district.types';

export const CreateLeadershipSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    image: z.string().url('Image must be a valid URL').optional().or(z.literal('')).nullable(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
    phone: z.string().optional().or(z.literal('')).nullable(),
    departmentId: z.string().uuid('Invalid department ID'),
    positionId: z.string().uuid('Invalid position ID'),
    districtIds: z.array(z.string().uuid('Invalid district ID')).min(1, 'At least one district is required'),
});

export const UpdateLeadershipSchema = CreateLeadershipSchema.partial();

export const CreateManagerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    image: z.string().url('Image must be a valid URL').optional().or(z.literal('')).nullable(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')).nullable(),
    phone: z.string().optional().or(z.literal('')).nullable(),
    districtIds: z.array(z.string().uuid('Invalid district ID')).min(1, 'At least one district is required'),
});

export const UpdateManagerSchema = CreateManagerSchema.partial();

export type CreateLeadershipDto = z.infer<typeof CreateLeadershipSchema>;
export type UpdateLeadershipDto = z.infer<typeof UpdateLeadershipSchema>;
export type CreateManagerDto = z.infer<typeof CreateManagerSchema>;
export type UpdateManagerDto = z.infer<typeof UpdateManagerSchema>;

export interface Leadership {
    id: string;
    name: string;
    image?: string;
    email?: string;
    phone?: string;
    departmentId: string;
    positionId: string;
    department?: Department;
    position?: Position;
    districts?: District[];
    createdAt: string;
    updatedAt: string;
}

export interface Manager {
    id: string;
    name: string;
    image?: string;
    email?: string;
    phone?: string;
    districts?: District[];
    createdAt: string;
    updatedAt: string;
}

export interface GetManagementParams {
    page?: number;
    limit?: number;
    search?: string;
    districtId?: string;
    departmentId?: string;
    positionId?: string;
}

export interface LeadershipResponse {
    data: Leadership[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ManagerResponse {
    data: Manager[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
