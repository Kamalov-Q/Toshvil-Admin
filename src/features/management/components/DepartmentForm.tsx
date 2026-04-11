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
    CreateDepartmentSchema,
    UpdateDepartmentSchema,
    type CreateDepartmentDto,
    type UpdateDepartmentDto,
    type Department,
} from '@/types/department.types';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';

interface DepartmentFormProps {
    initialData?: Department;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function DepartmentForm({
    initialData,
    onSuccess,
    onCancel,
}: DepartmentFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateDepartmentDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateDepartmentSchema : CreateDepartmentSchema) as any,
        defaultValues: initialData || {
            nameUz: '',
            nameRu: '',
            nameEn: '',
        },
    });

    const onSubmit = useCallback(
        async (data: CreateDepartmentDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdateDepartmentDto);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="nameUz"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bo'lim nomi (UZ)</FormLabel>
                                <FormControl><Input {...field} placeholder="O'zbekcha nom" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameRu"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bo'lim nomi (RU)</FormLabel>
                                <FormControl><Input {...field} placeholder="Ruscha nom" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameEn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bo'lim nomi (EN)</FormLabel>
                                <FormControl><Input {...field} placeholder="Inglizcha nom" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Bekor qilish
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
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
