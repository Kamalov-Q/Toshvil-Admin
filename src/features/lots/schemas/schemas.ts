import { z } from 'zod'

// Enums
export const LotStatusEnum = z.enum(['active', 'upcoming', 'completed', 'cancelled']);
export const PaymentTypeEnum = z.enum(['muddatli_bolib_tolash', 'bir_vaqtda']);
export const TradeTypeEnum = z.enum(['tender', 'auksion']);
export const LandRightTypeEnum = z.enum(['ijara', 'mulk']);

// Geo Polygon Schema
export const GeoPolygonSchema = z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

// Create Lot DTO
export const CreateLotSchema = z.object({
    titleUz: z.string().min(1, 'Title UZ is required'),
    titleRu: z.string().min(1, 'Title RU is required'),
    titleEn: z.string().min(1, 'Title EN is required'),
    lotNumber: z.number().min(1, 'Lot number must be positive'),
    lotCode: z.string().min(1, 'Lot code is required'),
    status: LotStatusEnum,
    paymentType: PaymentTypeEnum,
    paymentMonths: z.number().min(1),
    tradeType: TradeTypeEnum,
    tradeDate: z.string().datetime(),
    applicationDeadline: z.string().datetime(),
    tradeLocationUz: z.string().min(1),
    tradeLocationRu: z.string().min(1),
    tradeLocationEn: z.string().min(1),
    addressUz: z.string().min(1),
    addressRu: z.string().min(1),
    addressEn: z.string().min(1),
    region: z.string().min(1),
    landRightType: LandRightTypeEnum,
    leaseYears: z.number().min(1),
    permittedUseUz: z.string().min(1),
    permittedUseRu: z.string().min(1),
    permittedUseEn: z.string().min(1),
    landCategoryUz: z.string().min(1),
    landCategoryRu: z.string().min(1),
    landCategoryEn: z.string().min(1),
    jobsToCreate: z.number().min(0),
    requiredInvestmentUz: z.string().min(1),
    requiredInvestmentRu: z.string().min(1),
    requiredInvestmentEn: z.string().min(1),
    hasGas: z.boolean(),
    hasElectricity: z.boolean(),
    hasWater: z.boolean(),
    hasSewage: z.boolean(),
    landArea: z.number().min(0),
    distanceToRoad: z.string(),
    locationAddressUz: z.string().min(1),
    locationAddressRu: z.string().min(1),
    locationAddressEn: z.string().min(1),
    hasBuilding: z.boolean(),
    buildingArea: z.number().min(0).optional(),
    noteUz: z.string().optional(),
    noteRu: z.string().optional(),
    noteEn: z.string().optional(),
    usageWarningUz: z.string().optional(),
    usageWarningRu: z.string().optional(),
    usageWarningEn: z.string().optional(),
    customerName: z.string().optional(),
    customerType: z.string().optional(),
    customerDistrict: z.string().optional(),
    customerAddress: z.string().optional(),
    customerPhone: z.string().optional(),
    customerExtraPhone: z.string().optional(),
    customerEmail: z.string().email().optional(),
    latitude: z.number(),
    longitude: z.number(),
    geoPolygon: GeoPolygonSchema,
    districtId: z.string().uuid(),
    imageUrls: z.array(z.string().url()).default([]),
});


export const UpdateLotSchema = CreateLotSchema.partial();

export type CreateLotDto = z.infer<typeof CreateLotSchema>;
export type UpdateLotDto = z.infer<typeof UpdateLotSchema>;
export type Lot = CreateLotDto & { id: string; createdAt: string; updatedAt: string };
