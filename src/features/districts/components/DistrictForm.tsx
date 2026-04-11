import { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Save, Plus, Trash2, Building2, Map, Activity } from 'lucide-react';
import {
    CreateDistrictSchema,
    UpdateDistrictSchema,
    type CreateDistrictDto,
    type UpdateDistrictDto,
    type District,
    type IndustrialItem,
    DISTRICT_TYPE_OPTIONS,
} from '../../../types/district.types';
import { useCreateDistrict, useUpdateDistrict, useDistrict } from '../../../hooks/useDistricts';
import { useEffect } from 'react';

interface DistrictFormProps {
    initialData?: District;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function DistrictForm({
    initialData,
    onSuccess,
    onCancel,
}: DistrictFormProps) {
    const isEditing = !!initialData;
    
    // Fetch full district data if editing to ensure we have all industrial arrays
    const { data: fullDistrictData, isLoading: isFetchingFull } = useDistrict(initialData?.id || '');
    const districtData = fullDistrictData || initialData;

    const createMutation = useCreateDistrict();
    const updateMutation = useUpdateDistrict(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending || isFetchingFull;

    const form = useForm<CreateDistrictDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateDistrictSchema : CreateDistrictSchema) as any,
        mode: 'onChange',
        defaultValues: {
            nameUz: '',
            nameRu: '',
            nameEn: '',
            type: 'tuman',
            totalArea: 0,
            industrialZones: [],
            industrialEnterprises: [],
            slug: '',
        },
    });

    const {
        fields: zones,
        append: addZone,
        remove: removeZone,
        replace: replaceZones,
    } = useFieldArray({
        control: form.control,
        name: 'industrialZones',
    });

    const {
        fields: enterprises,
        append: addEnterprise,
        remove: removeEnterprise,
        replace: replaceEnterprises,
    } = useFieldArray({
        control: form.control,
        name: 'industrialEnterprises',
    });

    // Reset form when full data is loaded or initialData changes
    useEffect(() => {
        if (districtData && !isFetchingFull) {
            console.log('--- FORM DATA LOAD START ---');
            console.log('Original districtData:', districtData);
            
            const mapIndustrialItems = (items: any) => {
                if (!items || !Array.isArray(items)) return [];
                return items.map((item: any) => {
                    // Deeply extract the first non-array object
                    let data = item;
                    while (Array.isArray(data) && data.length > 0) {
                        data = data[0];
                    }
                    const obj = (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
                    
                    return {
                        nameUz: obj.nameUz || obj.name_uz || '',
                        nameRu: obj.nameRu || obj.name_ru || '',
                        nameEn: obj.nameEn || obj.name_en || '',
                    };
                }).filter((item: any) => item.nameUz || item.nameRu || item.nameEn);
            };

            const rawData = districtData as any;
            const cleanZones = mapIndustrialItems(districtData.industrialZones || rawData.industrial_zones);
            const cleanEnterprises = mapIndustrialItems(districtData.industrialEnterprises || rawData.industrial_enterprises);

            console.log('Processed for form - cleanZones:', cleanZones);
            console.log('Processed for form - cleanEnterprises:', cleanEnterprises);

            const formData = {
                nameUz: districtData.nameUz || '',
                nameRu: districtData.nameRu || '',
                nameEn: districtData.nameEn || '',
                type: (districtData.type as CreateDistrictDto['type']) || 'tuman',
                totalArea: districtData.totalArea ? Number(districtData.totalArea) : 0,
                slug: districtData.slug || '',
                industrialZones: cleanZones,
                industrialEnterprises: cleanEnterprises,
            };

            form.reset(formData);
            
            // Forces useFieldArray to catch up with the reset data
            replaceZones(cleanZones);
            replaceEnterprises(cleanEnterprises);
            
            console.log('--- FORM DATA LOAD COMPLETE ---');
        }
    }, [districtData, isFetchingFull, form, replaceZones, replaceEnterprises]);

    const errorCount = Object.keys(form.formState.errors).length;

    const onSubmit = useCallback(
        async (data: CreateDistrictDto) => {
            try {
                const formatIndustrialItem = (item: IndustrialItem) => ({
                    nameUz: item.nameUz || '',
                    nameRu: item.nameRu || '',
                    nameEn: item.nameEn || '',
                });

                const cleanZones = (data.industrialZones || [])
                    .filter((item: IndustrialItem) => 
                        item && (
                            (item.nameUz && item.nameUz.trim() !== '') || 
                            (item.nameRu && item.nameRu.trim() !== '') || 
                            (item.nameEn && item.nameEn.trim() !== '')
                        )
                    )
                    .map(formatIndustrialItem);

                const cleanEnterprises = (data.industrialEnterprises || [])
                    .filter((item: IndustrialItem) => 
                        item && (
                            (item.nameUz && item.nameUz.trim() !== '') || 
                            (item.nameRu && item.nameRu.trim() !== '') || 
                            (item.nameEn && item.nameEn.trim() !== '')
                        )
                    )
                    .map(formatIndustrialItem);
                const baseData = {
                    nameUz: data.nameUz,
                    nameRu: data.nameRu || '',
                    nameEn: data.nameEn || '',
                    type: data.type,
                    totalArea: Number(data.totalArea) || 0,
                    industrialZones: cleanZones,
                    industrialEnterprises: cleanEnterprises,
                };

                if (isEditing) {
                    const updateData = {
                        ...baseData,
                    };
                    console.log('--- PATCH SUBMISSION START ---');
                    console.log('Payload:', JSON.parse(JSON.stringify(updateData)));
                    await updateMutation.mutateAsync(updateData as UpdateDistrictDto);
                } else {
                    const createData = {
                        ...baseData,
                        industries: cleanEnterprises.length,
                        slug: data.slug || undefined,
                    };
                    console.log('--- POST SUBMISSION START ---');
                    console.log('Payload:', JSON.parse(JSON.stringify(createData)));
                    await createMutation.mutateAsync(createData as CreateDistrictDto);
                }
                onSuccess?.();
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
        [isEditing, createMutation, updateMutation, onSuccess, districtData?.id]
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {errorCount > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">
                                {errorCount} ta maydonda xatolik bor
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Iltimos, belgilangan maydonlarni tekshiring
                            </p>
                        </div>
                    </div>
                )}

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Umumiy ma'lumotlar
                        </TabsTrigger>
                        <TabsTrigger value="industries" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Sanoat va Maydon
                        </TabsTrigger>
                    </TabsList>

                    {/* General Information Tab */}
                    <TabsContent value="general" className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuman turi</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Turni tanlang" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {DISTRICT_TYPE_OPTIONS.map((opt) => (
                                                    <SelectItem value={opt.value} key={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="nameUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomi (UZ)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Tuman nomi (o'zbekcha)" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameRu"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomi (RU)</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} placeholder="Tuman nomi (ruscha)" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomi (EN)</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} placeholder="Tuman nomi (inglizcha)" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* Industries and Area Tab */}
                    <TabsContent value="industries" className="space-y-8 pt-4">
                        {/* Area Stats */}
                        <div className="p-4 bg-gray-50 border rounded-lg max-w-md">
                            <FormField
                                control={form.control}
                                name="totalArea"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Umumiy yer maydoni (GA)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                value={field.value ?? ''}
                                                step="0.01"
                                                placeholder="0.00"
                                                className="bg-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Industrial Zones Repeater */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Map className="w-5 h-5 text-blue-600" />
                                    Sanoat zonalari
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addZone({ nameUz: '', nameRu: '', nameEn: '' })}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Qo'shish
                                </Button>
                            </div>
                            
                            {zones.length === 0 && (
                                <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed rounded-lg">
                                    Hech qanday sanoat zonasi qo'shilmagan
                                </p>
                            )}

                            <div className="space-y-4">
                                {zones.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeZone(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                                            <FormField
                                                control={form.control}
                                                name={`industrialZones.${index}.nameUz`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (UZ)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Sanoat zonasi nomi" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`industrialZones.${index}.nameRu`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (RU)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Название промзоны" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`industrialZones.${index}.nameEn`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (EN)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Industrial zone name" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Industrial Enterprises Repeater */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-green-600" />
                                    Sanoat korxonalari
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addEnterprise({ nameUz: '', nameRu: '', nameEn: '' })}
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Qo'shish
                                </Button>
                            </div>

                            {enterprises.length === 0 && (
                                <p className="text-sm text-gray-500 italic py-4 text-center border-2 border-dashed rounded-lg">
                                    Hech qanday sanoat korxonasi qo'shilmagan
                                </p>
                            )}

                            <div className="space-y-4">
                                {enterprises.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeEnterprise(index)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                                            <FormField
                                                control={form.control}
                                                name={`industrialEnterprises.${index}.nameUz`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (UZ)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Korxona nomi" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`industrialEnterprises.${index}.nameRu`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (RU)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Название предприятия" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`industrialEnterprises.${index}.nameEn`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs text-gray-500">Nomi (EN)</FormLabel>
                                                        <FormControl><Input {...field} value={field.value ?? ''} placeholder="Enterprise name" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saqlanmoqda...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Saqlash
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
