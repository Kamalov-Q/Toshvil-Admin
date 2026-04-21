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
        
        // Return local time formatted as YYYY-MM-DDTHH:mm
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            districtId: lot.districtId || (lot as any).district?.id || '',
            tradeDate: formatDateForInput(lot.tradeDate),
            applicationDeadline: formatDateForInput(lot.applicationDeadline),
            tradeType: 'tender',
            landRightType: 'ijara',
            landArea: lot.landArea ? parseFloat(String(lot.landArea)) : 0,
            jobsToCreate: lot.jobsToCreate ?? 0,
            requiredInvestment: lot.requiredInvestment ? parseFloat(String(lot.requiredInvestment)) : 0,
            hasRoad: lot.hasRoad ?? false,
            hasBuilding: lot.hasBuilding ?? false,
            buildingArea: lot.buildingArea ? parseFloat(String(lot.buildingArea)) : 0,
            latitude: lot.latitude ? parseFloat(String(lot.latitude)) : 0,
            longitude: lot.longitude ? parseFloat(String(lot.longitude)) : 0,
            imageUrls: lot.images?.map(img => img.url) ?? lot.imageUrls ?? [],
            lotNumber: (lot as any).lotNumber ?? 0,
        } : {
            titleUz: '',
            titleRu: '',
            titleEn: '',
            status: 'active',
            tradeType: 'tender',
            tradeDate: new Date().toISOString().slice(0, 16),
            applicationDeadline: new Date().toISOString().slice(0, 16),
            tradeLocationUz: '',
            tradeLocationRu: '',
            tradeLocationEn: '',
            addressUz: '',
            addressRu: '',
            addressEn: '',
            landRightType: 'ijara',
            leaseYears: 1,
            permittedUseUz: '',
            permittedUseRu: '',
            permittedUseEn: '',
            landCategoryUz: '',
            landCategoryRu: '',
            landCategoryEn: '',
            jobsToCreate: 0,
            requiredInvestment: 0,
            hasRoad: false,
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
            lotNumber: 0,
        },
    });

    const selectedDistrictId = form.watch('districtId');
    const selectedDistrict = districtData?.data?.find(d => d.id === selectedDistrictId);

    const onSubmit = async (data: CreateLotDto) => {
        try {
            const submissionData = {
                ...data,
                lotNumber: Number(data.lotNumber),
            };
            if (isEditing) {
                await updateMutation.mutateAsync(submissionData as UpdateLotDto);
            } else {
                await createMutation.mutateAsync(submissionData as CreateLotDto);
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
                                {errorCount} ta maydonda xatolik bor
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Iltimos, har bir tabdagi belgilangan maydonlarni tekshiring
                            </p>
                        </div>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex flex-wrap w-full h-auto bg-gray-100 p-1 gap-1 mb-4">
                        <TabsTrigger value="basic" className="relative">
                            Asosiy
                            {Object.keys(form.formState.errors).some((key) =>
                                ['titleUz', 'titleRu', 'titleEn', 'status', 'districtId'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="trade" className="relative">
                            Savdo
                            {Object.keys(form.formState.errors).some((key) =>
                                ['tradeType', 'tradeDate', 'applicationDeadline', 'tradeLocationUz', 'requiredInvestment'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="land" className="relative">
                            Yer
                            {Object.keys(form.formState.errors).some((key) =>
                                ['landArea', 'distanceToRoad', 'landRightType', 'leaseYears', 'permittedUseUz', 'latitude'].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>

                        <TabsTrigger value="additional">Qo'shimcha</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: BASIC INFORMATION */}
                    <TabsContent value="basic" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Lot nomlari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nomi (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot nomi (o'zbekcha)" className="focus:ring-blue-500" />
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
                                            <FormLabel>Nomi (RU) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot nomi (ruscha)" className="focus:ring-blue-500" />
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
                                            <FormLabel>Nomi (EN) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Lot nomi (inglizcha)" className="focus:ring-blue-500" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Lot tafsilotlari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="lotNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lot raqami *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    placeholder="masalan, 123"
                                                    className="focus:ring-blue-500"
                                                />
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
                                            <FormLabel>Holati *</FormLabel>
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
                            <h3 className="font-semibold text-lg text-gray-900">Joylashuv</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="districtId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tuman *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue placeholder="Tumanni tanlang" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent position="popper" className="max-h-60 w-full">
                                                    {districtData?.data && districtData.data.length > 0 ? (
                                                        districtData.data.map((district) => (
                                                            <SelectItem key={district.id} value={district.id}>
                                                                {district.nameUz} ({district.type})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>
                                                            Tumanlar mavjud emas
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
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
                            <h3 className="font-semibold text-lg text-gray-900">Savdo tafsilotlari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tradeDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Savdo sanasi va vaqti *</FormLabel>
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
                                            <FormLabel>Ariza topshirish muddati *</FormLabel>
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
                                            <FormLabel>Savdo joyi (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Savdo o'tkaziladigan joy (o'zbekcha)"
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
                                            <FormLabel>Savdo joyi (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Место проведения торгов (на русском)"
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
                                            <FormLabel>Savdo joyi (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Trade location (in English)"
                                                    className="focus:ring-blue-500"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-200 mt-6">
                            <h3 className="font-semibold text-lg text-gray-900">Investitsiya talablari</h3>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-blue-700">
                                    Ushbu lot uchun talab qilinadigan investitsiya miqdorini ko'rsating.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="requiredInvestment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Talab qilinadigan investitsiya (USD) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="masalan, 100000"
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
                            <h3 className="font-semibold text-lg text-gray-900">Yer tafsilotlari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="landArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Yer maydoni (GA) *</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder="masalan, 5000.50"
                                                        className="focus:ring-blue-500"
                                                    />
                                                    {selectedDistrict && (
                                                        <p className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded border border-green-100 flex items-center gap-2">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Tanlangan tumanda {selectedDistrict.emptyArea} GA bo'sh maydon mavjud.
                                                        </p>
                                                    )}
                                                </div>
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
                                            <FormLabel>Avtomagistral yo'lgacha bo'lgan masofa *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="masalan, 100 metr"
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
                                    name="leaseYears"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ijaraga berish yillari *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="masalan, 25"
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
                                            <FormLabel>Yaratiladigan ish o'rinlari *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="Yaratiladigan ish o'rinlari soni"
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
                            <h3 className="font-semibold text-lg text-gray-900">Ruxsat etilgan foydalanish</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="permittedUseUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ruxsat etilgan foydalanish (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Ruxsat etilgan foydalanish maqsadlari"
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
                                            <FormLabel>Ruxsat etilgan foydalanish (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Разрешенное использование"
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
                                            <FormLabel>Ruxsat etilgan foydalanish (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Permitted use"
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
                            <h3 className="font-semibold text-lg text-gray-900">Yer toifasi</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="landCategoryUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Yer toifasi (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Yer toifasi (o'zbekcha)"
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
                                            <FormLabel>Yer toifasi (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Категория земли (на русском)"
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
                                            <FormLabel>Yer toifasi (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Land category (in English)"
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
                            <h3 className="font-semibold text-lg text-gray-900">Infratuzilma</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name="hasRoad"
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
                                                Avtomobil yo'li
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
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
                                                Tabiiy gaz
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
                                                Elektr energiyasi
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
                                                Ichimlik suvi
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
                                                Oqava suv tizimi
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>



                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">GPS koordinatalari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kenglik (Latitude) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.000001"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="masalan, 41.2995"
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
                                            <FormLabel>Uzunlik (Longitude) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.000001"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    placeholder="masalan, 69.2401"
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
                            <h3 className="font-semibold text-lg text-gray-900">Manzillar</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Jismoniy manzil</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="addressUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Manzil (UZ) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Manzil (o'zbekcha)"
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
                                                    <FormLabel className="text-xs">Manzil (RU) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Manzil (ruscha)"
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
                                                    <FormLabel className="text-xs">Manzil (EN) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Manzil (inglizcha)"
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
                                    <p className="text-sm font-medium text-gray-700 mb-2">Joylashuv manzili</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="locationAddressUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Joylashuv (UZ) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Joylashuv (o'zbekcha)"
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
                                                    <FormLabel className="text-xs">Joylashuv (RU) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Joylashuv (ruscha)"
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
                                                    <FormLabel className="text-xs">Joylashuv (EN) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Joylashuv (inglizcha)"
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

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Bino ma'lumotlari</h3>

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
                                                Bino
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
                                                <FormLabel>Bino maydoni (m²)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder="masalan, 2000"
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
                    </TabsContent>

                    {/* TAB 5: ADDITIONAL INFORMATION */}
                    <TabsContent value="additional" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Buyurtmachi ma'lumotlari</h3>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Buyurtmachi nomi</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Mijoz nomi"
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
                                                <FormLabel>Buyurtmachi turi</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="masalan, Jismoniy shaxs, Kompaniya"
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
                                                <FormLabel>Buyurtmachi telefoni</FormLabel>
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
                                                <FormLabel>Qo'shimcha telefon</FormLabel>
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
                                                <FormLabel>Buyurtmachi elektron pochtasi</FormLabel>
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
                                                <FormLabel>Buyurtmachi tumani</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Tuman nomi"
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
                                            <FormLabel>Buyurtmachi manzili</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="To'liq manzil"
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
                            <h3 className="font-semibold text-lg text-gray-900">Eslatmalar va ogohlantirishlar</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Eslatmalar</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="noteUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Eslatma (UZ)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Eslatma (o'zbekcha)"
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
                                                    <FormLabel className="text-xs">Eslatma (RU)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Eslatma (ruscha)"
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
                                                    <FormLabel className="text-xs">Eslatma (EN)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Eslatma (inglizcha)"
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
                                    <p className="text-sm font-medium text-gray-700 mb-2">Foydalanish bo'yicha ogohlantirishlar</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="usageWarningUz"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Ogohlantirish (UZ)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Ogohlantirish (o'zbekcha)"
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
                                                    <FormLabel className="text-xs">Ogohlantirish (RU)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Ogohlantirish (ruscha)"
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
                                                    <FormLabel className="text-xs">Ogohlantirish (EN)</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Ogohlantirish (inglizcha)"
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
                            <h3 className="font-semibold text-lg text-gray-900">Rasmlar</h3>
                            <FileUploader
                                control={form.control}
                                name="imageUrls"
                                folder="lots"
                                accept="image/*"
                                multiple={true}
                                label="Lot rasmlarini yuklash"
                                description="Lotni namoyish qilish uchun bir nechta rasmlarni yuklashingiz mumkin (PNG, JPG, GIF, har biri 10MB gacha)"
                                maxSize={50}
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
                        Bekor qilish
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                {isEditing ? 'Yangilanmoqda...' : 'Yaratilmoqda...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEditing ? 'Lotni yangilash' : 'Lotni yaratish'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}