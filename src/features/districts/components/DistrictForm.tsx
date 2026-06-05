import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
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
import { AlertCircle, Save, Building2, Activity } from 'lucide-react';
import {
    CreateDistrictSchema,
    UpdateDistrictSchema,
    type CreateDistrictDto,
    type UpdateDistrictDto,
    type District,
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
    
    // Fetch full district data if editing
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
            occupiedArea: 0,
            industrialEnterprises: 0,
            slug: '',
        },
    });

    // Reset form when full data is loaded or initialData changes
    useEffect(() => {
        if (districtData && !isFetchingFull) {
            const formData = {
                nameUz: districtData.nameUz || '',
                nameRu: districtData.nameRu || '',
                nameEn: districtData.nameEn || '',
                type: (districtData.type as CreateDistrictDto['type']) || 'tuman',
                totalArea: districtData.totalArea ? Number(districtData.totalArea) : 0,
                slug: districtData.slug || '',
                industrialEnterprises: Number(districtData.industrialEnterprises) || 0,
                occupiedArea: districtData.occupiedArea ? Number(districtData.occupiedArea) : 0,
            };

            form.reset(formData);
        }
    }, [districtData, isFetchingFull, form]);

    const errorCount = Object.keys(form.formState.errors).length;

    const onSubmit = useCallback(
        async (data: CreateDistrictDto) => {
            try {
                const baseData = {
                    ...data,
                    totalArea: Number(data.totalArea) || 0,
                    occupiedArea: Number(data.occupiedArea) || 0,
                    industrialEnterprises: Number(data.industrialEnterprises) || 0,
                };

                if (isEditing) {
                    await updateMutation.mutateAsync(baseData as UpdateDistrictDto);
                } else {
                    const createData = {
                        ...baseData,
                        slug: data.slug || undefined,
                    };
                    await createMutation.mutateAsync(createData as CreateDistrictDto);
                }
                onSuccess?.();
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
        [isEditing, createMutation, updateMutation, onSuccess]
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 border rounded-lg">
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
                                                        step="0.0001"
                                                        placeholder="0.00"
                                                        className="bg-white"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                    <FormField
                                        control={form.control}
                                        name="occupiedArea"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold text-orange-700">Band yer maydoni (GA)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        step="0.0001"
                                                        placeholder="0.00"
                                                        className="bg-white"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                                <FormItem>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-blue-600" />
                                        <FormLabel className="font-semibold text-blue-900 mb-0">Sanoat zonalari soni</FormLabel>
                                    </div>
                                    <div className="h-10 flex items-center px-3 bg-white border rounded-md text-sm font-medium text-blue-700">
                                        {districtData?.industries?.length || 0} ta
                                    </div>
                                    <p className="text-[10px] text-blue-600/70 mt-1">
                                        * Sanoat zonalari ro'yxatidan avtomatik hisoblanadi
                                    </p>
                                </FormItem>
                            </div>

                            {/* Industrial Enterprises Count */}
                            <div className="p-4 bg-green-50/50 border border-green-100 rounded-lg">
                                <FormField
                                    control={form.control}
                                    name="industrialEnterprises"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Building2 className="w-4 h-4 text-green-600" />
                                                <FormLabel className="font-semibold text-green-900 mb-0">Sanoat korxonalari soni</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="0"
                                                    className="bg-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
