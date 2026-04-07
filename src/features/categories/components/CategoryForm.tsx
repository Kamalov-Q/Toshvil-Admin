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
    CreateCategorySchema,
    UpdateCategorySchema,
    type CreateCategoryDto,
    type UpdateCategoryDto,
    type Category,
} from '@/types/category.types';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategory';

interface CategoryFormProps {
    initialData?: Category;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CategoryForm({
    initialData,
    onSuccess,
    onCancel,
}: CategoryFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateCategoryDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateCategorySchema : CreateCategorySchema) as any,
        mode: 'onChange',
        defaultValues: initialData || {
            nameUz: '',
            nameRu: '',
            nameEn: '',
        },
    });

    const onSubmit = useCallback(
        async (data: CreateCategoryDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdateCategoryDto);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="nameUz"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (UZ)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameRu"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (RU)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nameEn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name (EN)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-3 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        {isLoading ? (
                            <><Loader className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" />{isEditing ? 'Update Category' : 'Create Category'}</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
