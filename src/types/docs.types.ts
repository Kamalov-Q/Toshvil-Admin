import { z } from 'zod';
import { CategorySchema } from './category.types';

export const DocsSchema = z.object({
    id: z.string().uuid().optional(),
    titleUz: z.string().min(1, 'Title (UZ) is required'),
    titleRu: z.string().min(1, 'Title (RU) is required'),
    titleEn: z.string().min(1, 'Title (EN) is required'),
    descriptionUz: z.string().optional(),
    descriptionRu: z.string().optional(),
    descriptionEn: z.string().optional(),
    url: z.string().min(1, 'File URL is required'),
    categoryId: z.string().uuid('Valid Category is required'),
    category: CategorySchema.optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Doc = z.infer<typeof DocsSchema>;

export const CreateDocsSchema = DocsSchema.omit({
    id: true,
    category: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateDocsDto = z.infer<typeof CreateDocsSchema>;

export const UpdateDocsSchema = CreateDocsSchema.partial();
export type UpdateDocsDto = z.infer<typeof UpdateDocsSchema>;

export interface DocsResponse {
    data: Doc[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
