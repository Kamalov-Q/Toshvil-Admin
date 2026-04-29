import { z } from 'zod';

export const CreateAuctionSchema = z.object({
  nameUz: z.string().min(1, 'Name UZ is required').max(255),
  nameRu: z.string().min(1, 'Name RU is required').max(255),
  nameEn: z.string().optional(),
  path: z.string().min(1, 'Path is required'),
  districtIds: z.array(z.string().uuid()).optional().default([]),
});

export const UpdateAuctionSchema = CreateAuctionSchema.partial();

export type CreateAuctionDto = z.infer<typeof CreateAuctionSchema>;
export type UpdateAuctionDto = z.infer<typeof UpdateAuctionSchema>;

export interface Auction {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn?: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  districts?: Array<{
    id: string;
    nameUz: string;
    nameRu: string;
    nameEn?: string;
  }>;
}
