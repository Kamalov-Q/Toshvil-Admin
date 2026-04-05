// Re-export district types from the central types file
// so that the lots/districts API hooks can import them
export type {
    CreateDistrictDto,
    UpdateDistrictDto,
} from '../../../../types/district.types';

export { CreateDistrictSchema, UpdateDistrictSchema } from '../../../../types/district.types';

// Inline the District type to match what the backend returns
import type { CreateDistrictDto } from '../../../../types/district.types';

export type District = CreateDistrictDto & {
    id: string;
    createdAt: string;
    updatedAt: string;
};
