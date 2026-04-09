import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader, Save, X } from 'lucide-react';
import {
    NewsCreateSchema,
    NewsUpdateSchema,
   type  NewsCreateDto,
    type NewsUpdateDto,
    type News,
    NewsCategoryEnum,
} from '@/types/news.types';
import { useCreateNews, useUpdateNews } from '@/hooks/useNewsQueries';
import { FileUploader } from '@/features/lots/components/FileUploader';

interface NewsFormProps {
    initialData?: News;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const NEWS_CATEGORIES = [
    { value: NewsCategoryEnum.ANNOUNCEMENTS, label: 'Announcements' },
    { value: NewsCategoryEnum.EVENTS, label: 'Events' },
    { value: NewsCategoryEnum.TECHNOLOGY, label: 'Technology' },
    { value: NewsCategoryEnum.PRESS_RELEASE, label: 'Press Release' },
    { value: NewsCategoryEnum.OTHER, label: 'Other' },
];

export default function NewsForm({
    initialData,
    onSuccess,
    onCancel,
}: NewsFormProps) {
    const isEditing = !!initialData;
    const createNews = useCreateNews();
    const updateNews = useUpdateNews(initialData?.id || '');
    const isLoading = createNews.isPending || updateNews.isPending;

    const form = useForm<NewsCreateDto | NewsUpdateDto>({
        resolver: zodResolver(isEditing ? NewsUpdateSchema : NewsCreateSchema),
        defaultValues: initialData || {
            titleUz: '',
            titleRu: '',
            titleEn: '',
            descriptionUz: '',
            descriptionRu: '',
            descriptionEn: '',
            shortDescriptionUz: '',
            shortDescriptionRu: '',
            shortDescriptionEn: '',
            image: '',
            category: NewsCategoryEnum.ANNOUNCEMENTS,
            isPublished: false,
        },
    });

    const errorCount = Object.keys(form.formState.errors).length;

    const onSubmit = useCallback(
        async (data: NewsCreateDto | NewsUpdateDto) => {
            try {
                if (isEditing) {
                    await updateNews.mutateAsync(data as NewsUpdateDto);
                } else {
                    await createNews.mutateAsync(data as NewsCreateDto);
                }
                onSuccess?.();
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
        [isEditing, createNews, updateNews, onSuccess]
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Summary */}
                {errorCount > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">
                                {errorCount} field{errorCount !== 1 ? 's have' : ' has'} error
                                {errorCount !== 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Please review the highlighted fields below
                            </p>
                        </div>
                    </div>
                )}

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    {/* Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                        {/* Titles */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Titles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Title (UZ)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Yangilik sarlavhasi (o'zbekcha)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="titleRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Title (RU)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Заголовок новости (на русском)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="titleEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Title (EN)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="News title (in English)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Short Descriptions */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">
                                Short Descriptions
                            </h3>
                            <p className="text-sm text-gray-600">
                                Brief descriptions for news lists (max 200 characters)
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Short Description (UZ)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Qisqacha tavsif (o'zbekcha)"
                                                    maxLength={200}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Short Description (RU)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Краткое описание (на русском)"
                                                    maxLength={200}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Short Description (EN)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Short description (in English)"
                                                    maxLength={200}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Full Descriptions */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">
                                Full Descriptions
                            </h3>
                            <p className="text-sm text-gray-600">
                                Detailed descriptions for the full article
                            </p>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="descriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Description (UZ)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="To'liq matn (o'zbekcha)"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="descriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Description (RU)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Полный текст (на русском)"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="descriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel required>Description (EN)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Full description (in English)"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Media Tab */}
                    <TabsContent value="media" className="space-y-6">
                        <h3 className="font-semibold text-lg text-gray-900">Featured Image</h3>
                        <p className="text-sm text-gray-600">
                            Main image displayed with the news article
                        </p>

                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <FileUploader
                                            control={form.control}
                                            name="image"
                                            accept="image/*"
                                            folder="news"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Category</h3>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel required>News Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {NEWS_CATEGORIES.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">
                                Publication Status
                            </h3>

                            <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="flex-1">
                                            <FormLabel className="font-semibold cursor-pointer">
                                                Publish this news
                                            </FormLabel>
                                            <FormDescription>
                                                {field.value
                                                    ? 'This news is published and visible to the public'
                                                    : 'This news is in draft mode and not visible'}
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="space-y-6">
                                {/* Preview Image */}
                                {form.getValues('image') && (
                                    <div className="rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={form.getValues('image')}
                                            alt="Preview"
                                            className="w-full h-96 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Preview Content */}
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                        {form.getValues('titleUz')}
                                    </h1>

                                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                                        <span>
                                            Category:{' '}
                                            {NEWS_CATEGORIES.find(
                                                (c) => c.value === form.getValues('category')
                                            )?.label || 'Unknown'}
                                        </span>
                                        <span>
                                            Status:{' '}
                                            {form.getValues('isPublished') ? 'Published' : 'Draft'}
                                        </span>
                                    </div>

                                    <p className="text-lg text-gray-700 mb-6">
                                        {form.getValues('shortDescriptionUz')}
                                    </p>

                                    <div className="prose prose-sm max-w-none">
                                        <p>{form.getValues('descriptionUz')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Form Actions */}
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
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                {isEditing ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {isEditing ? 'Update News' : 'Create News'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}