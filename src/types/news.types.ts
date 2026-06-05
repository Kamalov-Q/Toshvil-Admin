import { z } from 'zod';

// News Category Enum
export const NewsCategoryEnum = {
    ANNOUNCEMENTS: 'announcements',
    EVENTS: 'events',
    TECHNOLOGY: 'technology',
    PRESS_RELEASE: 'press_release',
    OTHER: 'other',
} as const;

export type NewsCategoryEnum = typeof NewsCategoryEnum[keyof typeof NewsCategoryEnum];

// Zod Schemas for Validation
export const NewsCreateSchema = z.object({
    titleUz: z
        .string()
        .min(1, 'Title (UZ) is required')
        .max(255, 'Title must be less than 255 characters'),
    titleRu: z
        .string()
        .min(1, 'Title (RU) is required')
        .max(255, 'Title must be less than 255 characters'),
    titleEn: z
        .string()
        .min(1, 'Title (EN) is required')
        .max(255, 'Title must be less than 255 characters'),

    descriptionUz: z
        .string()
        .min(10, 'Description (UZ) must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),
    descriptionRu: z
        .string()
        .min(10, 'Description (RU) must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),
    descriptionEn: z
        .string()
        .min(10, 'Description (EN) must be at least 10 characters')
        .max(5000, 'Description must be less than 5000 characters'),

    shortDescriptionUz: z
        .string()
        .min(1, 'Short description (UZ) is required')
        .max(200, 'Short description must be less than 200 characters'),
    shortDescriptionRu: z
        .string()
        .min(1, 'Short description (RU) is required')
        .max(200, 'Short description must be less than 200 characters'),
    shortDescriptionEn: z
        .string()
        .min(1, 'Short description (EN) is required')
        .max(200, 'Short description must be less than 200 characters'),

    images: z
        .array(z.string().url('Image must be a valid URL'))
        .min(1, 'At least one image is required')
        .max(10, 'Maximum 10 images are allowed'),

    category: z.nativeEnum(NewsCategoryEnum),
    isPublished: z.boolean().default(false),
});

export const NewsUpdateSchema = NewsCreateSchema.partial();

// Type Inference from Zod Schemas
export type NewsCreateDto = z.infer<typeof NewsCreateSchema>;
export type NewsUpdateDto = z.infer<typeof NewsUpdateSchema>;

// News Entity Type (returned from API)
export interface News extends NewsCreateDto {
    id: string;
    createdAt: string;
    updatedAt: string;
}

// API Response Types
export interface NewsListResponse {
    data: News[];
    total: number;
    page: number;
    limit: number;
}

export interface NewsSingleResponse {
    data: News;
}

// Query Parameters Type
export interface NewsQueryParams {
    page?: number;
    limit?: number;
    category?: NewsCategoryEnum;
    search?: string;
    isPublished?: boolean;
}

// UI Helper Types
export interface NewsFilterState {
    search: string;
    category: NewsCategoryEnum | '';
    isPublished: '' | 'true' | 'false';
}

export interface NewsTableColumn {
    id: keyof News | 'actions';
    label: string;
    width?: string;
    sortable?: boolean;
}