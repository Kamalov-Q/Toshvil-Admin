import { z } from 'zod';

export const CreateIndustrySchema = z.object({
    nameUz: z.string().min(1, 'Name UZ is required').max(255),
    nameRu: z.string().min(1, 'Name RU is required').max(255),
    nameEn: z.string().min(1, 'Name EN is required').max(255),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    districtId: z.string().uuid('Tuman tanlanishi shart'),
});

export const UpdateIndustrySchema = CreateIndustrySchema.partial();

export type CreateIndustryDto = z.infer<typeof CreateIndustrySchema>;
export type UpdateIndustryDto = z.infer<typeof UpdateIndustrySchema>;

export type Industry = {
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    latitude: number;
    longitude: number;
    districtId: string;
    mapLinks?: {
        googleMaps: string;
        yandexMaps: string;
    };
    createdAt: string;
    updatedAt: string;
};

export interface GetIndustriesParams {
    page?: number;
    limit?: number;
    districtId?: string;
    name?: string;
}

export interface IndustriesResponse {
    data: Industry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
