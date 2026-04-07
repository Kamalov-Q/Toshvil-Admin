import { z } from 'zod';

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    nameUz: z.string().min(1, 'Name (UZ) is required'),
    nameRu: z.string().min(1, 'Name (RU) is required'),
    nameEn: z.string().min(1, 'Name (EN) is required'),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

export interface CategoryResponse {
    data: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
