import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../../components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { FileUploader } from './FileUploader';
import {
    CreateLotSchema,
    UpdateLotSchema,
    type CreateLotDto,
    type UpdateLotDto,
    type Lot,
    STATUS_OPTIONS,
    TRADE_TYPE_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
    LAND_RIGHT_TYPE_OPTIONS,
} from '../schemas/schemas';
import { useCreateLot, useUpdateLot } from '../api/hooks';
import { AlertCircle, Loader, Save, X } from 'lucide-react';
import { useDistricts } from '@/features/lots/districts/api/hooks';

interface LotModalProps {
    lot?: Lot;
    onClose: () => void;
}

const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 16);
    } catch {
        return '';
    }
};

export default function LotModal({ lot, onClose }: LotModalProps) {
    const isEditing = !!lot;
    const createMutation = useCreateLot();
    const updateMutation = useUpdateLot(lot?.id || '');
    const { data: districtData } = useDistricts({ limit: 100 });
    const [activeTab, setActiveTab] = useState('basic');

    const form = useForm<CreateLotDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateLotSchema : CreateLotSchema) as any,
        mode: 'onChange',
        defaultValues: lot ? {
            ...lot,
            tradeDate: formatDateForInput(lot.tradeDate),
            applicationDeadline: formatDateForInput(lot.applicationDeadline),
            lotNumber: lot.lotNumber ?? 0,
            landArea: lot.landArea ? parseFloat(String(lot.landArea)) : 0,
            jobsToCreate: lot.jobsToCreate ?? 0,
            buildingArea: lot.buildingArea ? parseFloat(String(lot.buildingArea)) : 0,
            latitude: lot.latitude ? parseFloat(String(lot.latitude)) : 0,
            longitude: lot.longitude ? parseFloat(String(lot.longitude)) : 0,
            imageUrls: lot.images?.map(img => img.url) ?? lot.imageUrls ?? [],
        } : {
            titleUz: '',
            titleRu: '',
            titleEn: '',
            lotNumber: 0,
            lotCode: '',
            status: 'active',
            paymentType: 'muddatli_bolib_tolash',
            paymentMonths: 12,
            tradeType: 'tender',
            tradeDate: new Date().toISOString().slice(0, 16),
            applicationDeadline: new Date().toISOString().slice(0, 16),
            tradeLocationUz: '',
            tradeLocationRu: '',
            tradeLocationEn: '',
            addressUz: '',
            addressRu: '',
            addressEn: '',
            region: '',
            landRightType: 'ijara',
            leaseYears: 1,
            permittedUseUz: '',
            permittedUseRu: '',
            permittedUseEn: '',
            landCategoryUz: '',
            landCategoryRu: '',
            landCategoryEn: '',
            jobsToCreate: 0,
            requiredInvestmentUz: '',
            requiredInvestmentRu: '',
            requiredInvestmentEn: '',
            hasGas: false,
            hasElectricity: false,
            hasWater: false,
            hasSewage: false,
            landArea: 0,
            distanceToRoad: '',
            locationAddressUz: '',
            locationAddressRu: '',
            locationAddressEn: '',
            hasBuilding: false,
            buildingArea: 0,
            noteUz: '',
            noteRu: '',
            noteEn: '',
            usageWarningUz: '',
            usageWarningRu: '',
            usageWarningEn: '',
            customerName: '',
            customerType: '',
            customerDistrict: '',
            customerAddress: '',
            customerPhone: '',
            customerExtraPhone: '',
            customerEmail: '',
            latitude: 0,
            longitude: 0,
            geoPolygon: { type: 'Polygon', coordinates: [] },
            districtId: '',
            imageUrls: [],
        },
    });

    const onSubmit = async (data: CreateLotDto) => {
        try {
            if (isEditing) {
                await updateMutation.mutateAsync(data as UpdateLotDto);
            } else {
                await createMutation.mutateAsync(data);
            }
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;
    const errorCount = Object.keys(form.formState.errors).length;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Validation Error Summary */}
                {errorCount > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">
                                {errorCount} field{errorCount !== 1 ? 's have' : ' has'} error{errorCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Please scroll to each tab and fix the errors below
                            </p>
                        </div>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap w-full h-auto bg-gray-100 p-1 gap-1 mb-4">
                        <TabsTrigger value="basic" className="relative">
                            Basic
                            {Object.keys(form.formState.errors).some((key) =>
                                ['titleUz', 'titleRu', 'titleEn', 'lotNumber', 'lotCode', 'status', 'districtId', 'region'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="trade" className="relative">
                            Trade
                            {Object.keys(form.formState.errors).some((key) =>
                                ['tradeType', 'tradeDate', 'applicationDeadline', 'tradeLocationUz', 'paymentType', 'paymentMonths'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="land" className="relative">
                            Land
                            {Object.keys(form.formState.errors).some((key) =>
                                ['landArea', 'distanceToRoad', 'landRightType', 'leaseYears', 'permittedUseUz', 'latitude'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="investment" className="relative">
                            Investment
                            {Object.keys(form.formState.errors).some((key) =>
                                ['requiredInvestmentUz', 'jobsToCreate'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="additional">Additional</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: BASIC INFORMATION */}
                    <TabsContent value="basic" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Lot Titles</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot title in Uzbek" className="focus:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="titleRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (RU) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot title in Russian" className="focus:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="titleEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (EN) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot title in English" className="focus:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Lot Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="lotNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lot Number *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="e.g., 1"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lotCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lot Code *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., LOT-001" className="focus:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Location</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="districtId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue placeholder="Select a district" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-60">
                                                    {districtData?.data && districtData.data.length > 0 ? (
                                                        districtData.data.map((district) => (
                                                            <SelectItem key={district.id} value={district.id}>
                                                                {district.nameUz} ({district.type})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            No districts available
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="region"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., Tashkent City"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: TRADE INFORMATION */}
                    <TabsContent value="trade" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Trade Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tradeType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trade Type *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {TRADE_TYPE_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tradeDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trade Date & Time *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="applicationDeadline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Application Deadline *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tradeLocationUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trade Location (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Location in Uzbek"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tradeLocationRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trade Location (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Location in Russian"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tradeLocationEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trade Location (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Location in English"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Payment Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="paymentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Type *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PAYMENT_TYPE_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="paymentMonths"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Months *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="Number of months"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 3: LAND INFORMATION */}
                    <TabsContent value="land" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Land Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="landArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Area (m²) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="e.g., 5000.50"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="distanceToRoad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Distance to Road *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., 100 meters"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="landRightType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Right Type *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LAND_RIGHT_TYPE_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="leaseYears"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lease Years *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="e.g., 25"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jobsToCreate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Jobs to Create *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="Number of jobs"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Permitted Use</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="permittedUseUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permitted Use (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Use in Uzbek"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="permittedUseRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permitted Use (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Use in Russian"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="permittedUseEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permitted Use (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Use in English"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Land Category</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="landCategoryUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Category (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Category in Uzbek"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="landCategoryRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Category (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Category in Russian"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="landCategoryEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Land Category (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Category in English"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Infrastructure</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name="hasGas"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-5 w-5 border-gray-300"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Has Gas
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hasElectricity"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-5 w-5 border-gray-300"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Has Electricity
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hasWater"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-5 w-5 border-gray-300"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Has Water
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hasSewage"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-5 w-5 border-gray-300"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Has Sewage
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>



                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">GPS Coordinates</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.000001"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="e.g., 41.2995"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.000001"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="e.g., 69.2401"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Addresses</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Physical Address</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="addressUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Address (UZ) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Address in Uzbek"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="addressRu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Address (RU) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Address in Russian"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="addressEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Address (EN) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Address in English"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Location Address</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="locationAddressUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Location (UZ) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Location in Uzbek"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="locationAddressRu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Location (RU) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Location in Russian"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="locationAddressEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Location (EN) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Location in English"
                                                            className="focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 4: INVESTMENT INFORMATION */}
                    <TabsContent value="investment" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Investment Requirements</h3>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-blue-700">
                                    Specify the investment amounts required for this lot in different currencies or formats.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="requiredInvestmentUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Required Investment (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., 100,000,000 USD"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="requiredInvestmentRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Required Investment (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., 100,000,000 USD"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="requiredInvestmentEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Required Investment (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., 100,000,000 USD"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 5: ADDITIONAL INFORMATION */}
                    <TabsContent value="additional" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Customer Information</h3>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Customer Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Customer name"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Customer Type</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., Individual, Company"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Customer Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="+998 XX XXX XX XX"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerExtraPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Extra Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="+998 XX XXX XX XX"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Customer Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        {...field}
                                                        placeholder="customer@example.com"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerDistrict"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Customer District</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="District name"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="customerAddress"
                                    render={({ field }) => (
                                        <FormItem className="mt-4">
                                            <FormLabel>Customer Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Full address"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Notes & Warnings</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="noteUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Note (UZ)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Note in Uzbek"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="noteRu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Note (RU)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Note in Russian"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="noteEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Note (EN)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Note in English"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Usage Warnings</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="usageWarningUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Warning (UZ)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Warning in Uzbek"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="usageWarningRu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Warning (RU)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Warning in Russian"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="usageWarningEn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Warning (EN)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Warning in English"
                                                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-red-600" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Building Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="hasBuilding"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="h-5 w-5 border-gray-300"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Has Building
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('hasBuilding') && (
                                    <FormField
                                        control={form.control}
                                        name="buildingArea"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Building Area (m²)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder="e.g., 2000"
                                                        className="focus:ring-blue-500"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-600" />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Images</h3>
                            <FileUploader
                                control={form.control}
                                name="imageUrls"
                                folder="lots"
                                accept="image/*"
                                multiple={true}
                                label="Upload Lot Images"
                                description="You can upload multiple images to showcase the lot (PNG, JPG, GIF up to 10MB each)"
                                maxSize={10}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Form Actions */}
                <div className="flex gap-2 justify-end pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEditing ? 'Update Lot' : 'Create Lot'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}