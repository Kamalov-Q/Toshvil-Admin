import { z } from 'zod';

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
    // Basic Information
    titleUz: z.string().min(1, 'Title UZ is required').max(255),
    titleRu: z.string().min(1, 'Title RU is required').max(255),
    titleEn: z.string().min(1, 'Title EN is required').max(255),
    lotNumber: z.number().min(1, 'Lot number must be positive').int(),
    lotCode: z.string().min(1, 'Lot code is required').max(50),
    status: LotStatusEnum,

    // Payment Information
    paymentType: PaymentTypeEnum,
    paymentMonths: z.number().min(1, 'Payment months must be at least 1').int(),

    // Trade Information
    tradeType: TradeTypeEnum,
    tradeDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        'Invalid trade date format'
    ),
    applicationDeadline: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        'Invalid deadline format'
    ),
    tradeLocationUz: z.string().min(1, 'Trade location UZ is required'),
    tradeLocationRu: z.string().min(1, 'Trade location RU is required'),
    tradeLocationEn: z.string().min(1, 'Trade location EN is required'),

    // Address Information
    addressUz: z.string().min(1, 'Address UZ is required'),
    addressRu: z.string().min(1, 'Address RU is required'),
    addressEn: z.string().min(1, 'Address EN is required'),
    region: z.string().min(1, 'Region is required'),
    locationAddressUz: z.string().min(1, 'Location address UZ is required'),
    locationAddressRu: z.string().min(1, 'Location address RU is required'),
    locationAddressEn: z.string().min(1, 'Location address EN is required'),

    // Land Information
    landRightType: LandRightTypeEnum,
    leaseYears: z.number().min(1, 'Lease years must be at least 1').int(),
    permittedUseUz: z.string().min(1, 'Permitted use UZ is required'),
    permittedUseRu: z.string().min(1, 'Permitted use RU is required'),
    permittedUseEn: z.string().min(1, 'Permitted use EN is required'),
    landCategoryUz: z.string().min(1, 'Land category UZ is required'),
    landCategoryRu: z.string().min(1, 'Land category RU is required'),
    landCategoryEn: z.string().min(1, 'Land category EN is required'),
    landArea: z.number().min(0.1, 'Land area must be greater than 0'),
    distanceToRoad: z.string().min(1, 'Distance to road is required'),

    // Investment Information
    jobsToCreate: z.number().min(0, 'Jobs to create cannot be negative').int(),
    requiredInvestmentUz: z.string().min(1, 'Required investment UZ is required'),
    requiredInvestmentRu: z.string().min(1, 'Required investment RU is required'),
    requiredInvestmentEn: z.string().min(1, 'Required investment EN is required'),

    // Infrastructure
    hasGas: z.boolean().default(false),
    hasElectricity: z.boolean().default(false),
    hasWater: z.boolean().default(false),
    hasSewage: z.boolean().default(false),

    // Building
    hasBuilding: z.boolean().default(false),
    buildingArea: z.number().min(0).optional(),

    // Coordinates
    latitude: z.number().refine(
        (lat) => lat >= -90 && lat <= 90,
        'Latitude must be between -90 and 90'
    ),
    longitude: z.number().refine(
        (lng) => lng >= -180 && lng <= 180,
        'Longitude must be between -180 and 180'
    ),

    // Geo Polygon
    geoPolygon: GeoPolygonSchema,

    // District Reference (IMPORTANT)
    districtId: z.string().uuid('District ID must be a valid UUID'),

    // Optional Fields
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
    customerEmail: z.string().email().optional().or(z.literal('')),

    // Images
    imageUrls: z.array(z.string().url()).default([]),
});

// Update Lot DTO - All fields optional
export const UpdateLotSchema = CreateLotSchema.partial();

// Type Exports
export type CreateLotDto = z.infer<typeof CreateLotSchema>;
export type UpdateLotDto = z.infer<typeof UpdateLotSchema>;
export type Lot = CreateLotDto & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

// Constants for UI
export const STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-300' },
];

export const TRADE_TYPE_OPTIONS = [
    { value: 'tender', label: 'Tender' },
    { value: 'auksion', label: 'Auction' },
];

export const PAYMENT_TYPE_OPTIONS = [
    { value: 'muddatli_bolib_tolash', label: 'Installment Payment' },
    { value: 'bir_vaqtda', label: 'One-time Payment' },
];

export const LAND_RIGHT_TYPE_OPTIONS = [
    { value: 'ijara', label: 'Lease (Ijara)' },
    { value: 'mulk', label: 'Ownership (Mulk)' },
];

// Helper functions
export const getStatusColor = (status: string): string => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.label || status;
};

export const getTradeTypeLabel = (type: string): string => {
    const option = TRADE_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
};

export const getPaymentTypeLabel = (type: string): string => {
    const option = PAYMENT_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
};

export const getLandRightTypeLabel = (type: string): string => {
    const option = LAND_RIGHT_TYPE_OPTIONS.find((opt) => opt.value === type);
    return option?.label || type;
};