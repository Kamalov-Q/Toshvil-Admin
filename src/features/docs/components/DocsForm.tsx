import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Loader, Save, X } from 'lucide-react';
import {
    CreateDocsSchema,
    UpdateDocsSchema,
    type CreateDocsDto,
    type UpdateDocsDto,
    type Doc,
} from '@/types/docs.types';
import { useCreateDoc, useUpdateDoc } from '@/hooks/useDocs';
import { useCategories } from '@/hooks/useCategory';
import { FileUploader } from '@/features/lots/components/FileUploader';

interface DocsFormProps {
    initialData?: Doc;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function DocsForm({
    initialData,
    onSuccess,
    onCancel,
}: DocsFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreateDoc();
    const updateMutation = useUpdateDoc(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const { data: categoriesData } = useCategories({ page: 1, limit: 100 });
    const categories = categoriesData?.data || [];

    const form = useForm<CreateDocsDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateDocsSchema : CreateDocsSchema) as any,
        mode: 'onChange',
        defaultValues: initialData || {
            titleUz: '',
            titleRu: '',
            titleEn: '',
            descriptionUz: '',
            descriptionRu: '',
            descriptionEn: '',
            categoryId: '',
            url: '',
        },
    });

    const onSubmit = useCallback(
        async (data: CreateDocsDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdateDocsDto);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Kategoriya</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Kategoriyani tanlang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem value={cat.id!} key={cat.id}>
                                                {cat.nameUz}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="titleUz"
                        render={({ field }) => (
                            <FormItem className="col-span-full sm:col-span-1">
                                <FormLabel>Sarlavha (UZ)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="titleRu"
                        render={({ field }) => (
                            <FormItem className="col-span-full sm:col-span-1">
                                <FormLabel>Sarlavha (RU)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="titleEn"
                        render={({ field }) => (
                            <FormItem className="col-span-full sm:col-span-1">
                                <FormLabel>Sarlavha (EN)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="descriptionUz"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Tavsif (UZ) <span className="text-gray-400 font-normal">(Ixtiyoriy)</span></FormLabel>
                                <FormControl><Textarea {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="descriptionRu"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Tavsif (RU) <span className="text-gray-400 font-normal">(Ixtiyoriy)</span></FormLabel>
                                <FormControl><Textarea {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="descriptionEn"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Tavsif (EN) <span className="text-gray-400 font-normal">(Ixtiyoriy)</span></FormLabel>
                                <FormControl><Textarea {...field} value={field.value || ''} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="url"
                        render={() => (
                            <FormItem className="col-span-full">
                                <FormControl>
                                    <FileUploader
                                        control={form.control}
                                        name="url"
                                        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
                                        folder="docs"
                                        label="Hujjatni yuklash"
                                    />
                                </FormControl>
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
