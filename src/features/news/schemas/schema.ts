import { z } from 'zod';

// Enums
export const NewsCategoryEnum = z.enum([
    'announcements',
    'events',
    'technology',
    'press_release',
    'other',
]);

// Create News DTO
export const CreateNewsSchema = z.object({
    titleUz: z.string().min(1, 'Title UZ is required').max(255),
    titleRu: z.string().min(1, 'Title RU is required').max(255),
    titleEn: z.string().min(1, 'Title EN is required').max(255),

    descriptionUz: z.string().min(10, 'Description UZ must be at least 10 characters'),
    descriptionRu: z.string().min(10, 'Description RU must be at least 10 characters'),
    descriptionEn: z.string().min(10, 'Description EN must be at least 10 characters'),

    shortDescriptionUz: z.string().min(1, 'Short description UZ is required').max(200),
    shortDescriptionRu: z.string().min(1, 'Short description RU is required').max(200),
    shortDescriptionEn: z.string().min(1, 'Short description EN is required').max(200),

    image: z.string().url('Image must be a valid URL'),
    category: NewsCategoryEnum,
    isPublished: z.boolean().default(false),
});

// Update News DTO
export const UpdateNewsSchema = CreateNewsSchema.partial();

// Type Exports
export type CreateNewsDto = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsDto = z.infer<typeof UpdateNewsSchema>;
export type News = CreateNewsDto & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

// Constants for UI
export const NEWS_CATEGORY_OPTIONS = [
    { value: 'announcements', label: 'Announcements', color: 'bg-blue-100 text-blue-800' },
    { value: 'events', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'technology', label: 'Technology', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'press_release', label: 'Press Release', color: 'bg-red-100 text-red-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
];

// Helper functions
export const getCategoryLabel = (category: string): string => {
    const option = NEWS_CATEGORY_OPTIONS.find((opt) => opt.value === category);
    return option?.label || category;
};

export const getCategoryColor = (category: string): string => {
    const option = NEWS_CATEGORY_OPTIONS.find((opt) => opt.value === category);
    return option?.color || 'bg-gray-100 text-gray-800';
};