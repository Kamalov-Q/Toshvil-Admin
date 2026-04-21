import { z } from 'zod';

export const DistrictTypeEnum = z.enum(['tuman', 'shahar']);

export const IndustrialItemSchema = z.object({
    nameUz: z.string().min(1, 'Name UZ is required'),
    nameRu: z.string().min(1, 'Name RU is required'),
    nameEn: z.string().min(1, 'Name EN is required'),
});

export const CreateDistrictSchema = z.object({
    slug: z.string().optional(),
    nameUz: z.string().min(1, 'Name UZ is required').max(255),
    nameRu: z.string().min(1, 'Name RU is required').max(255),
    nameEn: z.string().min(1, 'Name EN is required').max(255),
    type: DistrictTypeEnum,
    totalArea: z.coerce.number().min(0.01, 'Total area must be greater than 0'),
    industrialZones: z.coerce.number().min(0).default(0),
    industrialEnterprises: z.coerce.number().min(0).default(0)
});

export const UpdateDistrictSchema = CreateDistrictSchema.partial();

export type CreateDistrictDto = z.infer<typeof CreateDistrictSchema>;
export type UpdateDistrictDto = z.infer<typeof UpdateDistrictSchema>;
export type District = Omit<CreateDistrictDto, 'industrialZones' | 'industrialEnterprises'> & {
    id: string;
    occupiedArea: number;
    emptyArea: number;
    industrialZones: number;
    industrialEnterprises: number;
    createdAt: string;
    updatedAt: string;
};

export interface GetDistrictsParams {
    page?: number;
    limit?: number;
    type?: string;
    name?: string;
    departmentId?: string;
    positionId?: string;
}

export interface DistrictsResponse {
    data: District[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const DISTRICT_TYPE_OPTIONS = [
    { value: 'tuman', label: 'District (Tuman)' },
    { value: 'shahar', label: 'City (Shahar)' },
];

export const getDistrictTypeLabel = (type: string): string => {
    const option = DISTRICT_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
};