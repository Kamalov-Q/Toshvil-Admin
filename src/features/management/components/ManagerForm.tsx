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
import { Loader, Save, X } from 'lucide-react';
import {
    CreateManagerSchema,
    UpdateManagerSchema,
    type CreateManagerDto,
    type UpdateManagerDto,
    type Manager,
} from '@/types/management.types';
import { useCreateManager, useUpdateManager } from '@/hooks/useManagement';
import { useDistricts } from '@/hooks/useDistricts';
import { FileUploader } from '@/features/lots/components/FileUploader';
import MultiSelect from '@/components/ui/multi-select';

interface ManagerFormProps {
    initialData?: Manager;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ManagerForm({
    initialData,
    onSuccess,
    onCancel,
}: ManagerFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreateManager();
    const updateMutation = useUpdateManager(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const { data: districtsData } = useDistricts({ limit: 100 });
    
    const form = useForm<CreateManagerDto>({
        resolver: zodResolver(isEditing ? UpdateManagerSchema : CreateManagerSchema) as any,
        defaultValues: {
            name: initialData?.name || '',
            image: initialData?.image || null,
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            districtIds: initialData?.districts?.map(d => d.id) || [],
        },
    });

    const onSubmit = useCallback(
        async (values: any) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(values as UpdateManagerDto);
                } else {
                    await createMutation.mutateAsync(values as CreateManagerDto);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Rasm</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            control={form.control}
                                            name="image"
                                            accept="image/*"
                                            folder="management"
                                            label="Mas'ul rasmini yuklash"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>F.I.O.</FormLabel>
                                    <FormControl><Input {...field} placeholder="Toliq ism sharifi" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefon</FormLabel>
                                        <FormControl><Input {...field} value={field.value || ''} placeholder="+998" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input {...field} value={field.value || ''} placeholder="example@..." /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="districtIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tumanlar / Shaharlar</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={districtsData?.data?.map(d => ({ label: d.nameUz, value: d.id })) || []}
                                            selected={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Tumanlarni tanlang"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Bekor qilish
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-md">
                        {isLoading ? (
                            <><Loader className="w-4 h-4 mr-2 animate-spin" />Saqlanmoqda...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" />{isEditing ? 'Yangilash' : 'Yaratish'}</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
