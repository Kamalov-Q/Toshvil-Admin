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
import { Save } from 'lucide-react';
import { 
    CreateIndustrySchema, 
    UpdateIndustrySchema, 
    type CreateIndustryDto, 
    type Industry 
} from '../../../types/industry.types';
import { useCreateIndustry, useUpdateIndustry } from '../../../hooks/useIndustries';
import { useDistricts } from '../../../hooks/useDistricts';
import { useEffect } from 'react';

interface IndustryFormProps {
    initialData?: Industry;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function IndustryForm({
    initialData,
    onSuccess,
    onCancel,
}: IndustryFormProps) {
    const isEditing = !!initialData;
    
    const { data: districtsData } = useDistricts({ limit: 100 });
    const createMutation = useCreateIndustry();
    const updateMutation = useUpdateIndustry(initialData?.id || '');
    
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateIndustryDto>({
        resolver: zodResolver(isEditing ? UpdateIndustrySchema : CreateIndustrySchema) as any,
        defaultValues: {
            nameUz: '',
            nameRu: '',
            nameEn: '',
            latitude: 0,
            longitude: 0,
            districtId: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                nameUz: initialData.nameUz,
                nameRu: initialData.nameRu,
                nameEn: initialData.nameEn,
                latitude: Number(initialData.latitude),
                longitude: Number(initialData.longitude),
                districtId: initialData.districtId,
            });
        }
    }, [initialData, form]);

    const onSubmit = useCallback(
        async (data: CreateIndustryDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data);
                } else {
                    await createMutation.mutateAsync(data);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="nameUz"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nomi (UZ)</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Sanoat zonasi nomi (uz)" />
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
                                    <Input {...field} placeholder="Sanoat zonasi nomi (ru)" />
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
                                    <Input {...field} placeholder="Sanoat zonasi nomi (en)" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="districtId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tuman / Shahar</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tumanni tanlang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {districtsData?.data?.map((district) => (
                                            <SelectItem key={district.id} value={district.id}>
                                                {district.nameUz}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.000001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.000001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Bekor qilish
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                        {isLoading ? 'Saqlanmoqda...' : <><Save className="w-4 h-4 mr-2" /> Saqlash</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
