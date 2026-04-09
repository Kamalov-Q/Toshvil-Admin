import { z } from 'zod';

export const DistrictTypeEnum = z.enum(['tuman', 'shahar']);

export const CreateDistrictSchema = z.object({
    slug: z.string().optional(),
    nameUz: z.string().min(1, 'Name UZ is required').max(255),
    nameRu: z.string().min(1, 'Name RU is required').max(255),
    nameEn: z.string().min(1, 'Name EN is required').max(255),
    type: DistrictTypeEnum,
    hokimNameUz: z.string().min(1, 'Hokim name UZ is required'),
    hokimNameRu: z.string().min(1, 'Hokim name RU is required'),
    hokimNameEn: z.string().min(1, 'Hokim name EN is required'),
    hokimPhoto: z.string().url('Hokim photo must be a valid URL').optional().or(z.literal('')).nullable(),
    hokimDocumentUz: z.string().url('Document UZ must be a valid URL').optional().or(z.literal('')).nullable(),
    hokimDocumentRu: z.string().url('Document RU must be a valid URL').optional().or(z.literal('')).nullable(),
    hokimDocumentEn: z.string().url('Document EN must be a valid URL').optional().or(z.literal('')).nullable(),
    addressUz: z.string().min(1, 'Address UZ is required'),
    addressRu: z.string().min(1, 'Address RU is required'),
    addressEn: z.string().min(1, 'Address EN is required'),
    phone: z.string().min(1, 'Phone is required'),
    website: z.string().url('Website must be a valid URL').optional().or(z.literal('')),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    eXat: z.string().optional().or(z.literal('')),
    receptionDaysUz: z.string().min(1, 'Reception days UZ is required'),
    receptionDaysRu: z.string().min(1, 'Reception days RU is required'),
    receptionDaysEn: z.string().min(1, 'Reception days EN is required'),
    latitude: z.coerce.number().refine(
        (lat) => lat >= -90 && lat <= 90,
        'Latitude must be between -90 and 90'
    ),
    longitude: z.coerce.number().refine(
        (lng) => lng >= -180 && lng <= 180,
        'Longitude must be between -180 and 180'
    ),
    sortOrder: z.coerce.number().min(0, 'Sort order must be non-negative'),
});

export const UpdateDistrictSchema = CreateDistrictSchema.partial();

export type CreateDistrictDto = z.infer<typeof CreateDistrictSchema>;
export type UpdateDistrictDto = z.infer<typeof UpdateDistrictSchema>;
export type District = CreateDistrictDto & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

export interface GetDistrictsParams {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
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