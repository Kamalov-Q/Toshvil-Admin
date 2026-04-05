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
import { FileUploader } from '../../lots/components/FileUploader';
import {
    CreateNewsSchema,
    UpdateNewsSchema,
    type CreateNewsDto,
    type UpdateNewsDto,
    type News,
    NEWS_CATEGORY_OPTIONS,
} from '../schemas/schema';
import { useCreateNews, useUpdateNews } from '../api/hooks';
import { AlertCircle, Loader, Save, X } from 'lucide-react';

interface NewsModalProps {
    news?: News;
    onClose: () => void;
}

export default function NewsModal({ news, onClose }: NewsModalProps) {
    const isEditing = !!news;
    const createMutation = useCreateNews();
    const updateMutation = useUpdateNews(news?.id || '');
    const [activeTab, setActiveTab] = useState('content');

    const form = useForm<CreateNewsDto | UpdateNewsDto>({
        resolver: zodResolver(isEditing ? UpdateNewsSchema : CreateNewsSchema),
        mode: 'onChange',
        defaultValues: news || {
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
            category: 'announcements',
            isPublished: false,
        },
    });

    const onSubmit = async (data: CreateNewsDto | UpdateNewsDto) => {
        try {
            if (isEditing) {
                await updateMutation.mutateAsync(data as UpdateNewsDto);
            } else {
                await createMutation.mutateAsync(data as CreateNewsDto);
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="content" className="relative">
                            Content
                            {Object.keys(form.formState.errors).some((key) =>
                                [
                                    'titleUz',
                                    'titleRu',
                                    'titleEn',
                                    'shortDescriptionUz',
                                    'shortDescriptionRu',
                                    'shortDescriptionEn',
                                    'descriptionUz',
                                    'descriptionRu',
                                    'descriptionEn',
                                ].includes(key)
                            ) && (
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="media" className="relative">
                            Media
                            {Object.keys(form.formState.errors).some((key) => ['image'].includes(key)) && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: CONTENT */}
                    <TabsContent value="content" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Titles</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="News title in Uzbek"
                                                    className="focus:ring-blue-500"
                                                />
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
                                                <Input
                                                    {...field}
                                                    placeholder="News title in Russian"
                                                    className="focus:ring-blue-500"
                                                />
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
                                                <Input
                                                    {...field}
                                                    placeholder="News title in English"
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
                            <h3 className="font-semibold text-lg text-gray-900">Short Descriptions</h3>
                            <p className="text-sm text-gray-600">
                                Brief descriptions shown in news lists (max 200 characters)
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description (UZ) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Short description in Uzbek"
                                                    maxLength={200}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {field.value?.length || 0}/200
                                            </div>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description (RU) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Short description in Russian"
                                                    maxLength={200}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {field.value?.length || 0}/200
                                            </div>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description (EN) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={3}
                                                    placeholder="Short description in English"
                                                    maxLength={200}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {field.value?.length || 0}/200
                                            </div>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Full Descriptions</h3>
                            <p className="text-sm text-gray-600">
                                Detailed descriptions for the full news article
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="descriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (UZ) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={5}
                                                    placeholder="Detailed description in Uzbek"
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="descriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (RU) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={5}
                                                    placeholder="Detailed description in Russian"
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="descriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (EN) *</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    {...field}
                                                    rows={5}
                                                    placeholder="Detailed description in English"
                                                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: MEDIA */}
                    <TabsContent value="media" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Featured Image</h3>
                            <p className="text-sm text-gray-600">
                                The main image displayed with the news article
                            </p>

                            <FormField
                                control={form.control}
                                name="image"
                                render={({field}) => (
                                    <FormItem>
                                        <FileUploader
                                            control={form.control}
                                            name="image"
                                            folder="news"
                                            accept="image/*"
                                            multiple={false}
                                            label="Upload Featured Image"
                                            description="PNG, JPG, GIF up to 10MB. Recommended size: 1200x600px"
                                            maxSize={10}
                                        />
                                        <FormMessage className="text-xs text-red-600" />
                                        {field.value && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                                                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                    <img
                                                        src={field.value}
                                                        alt="Preview"
                                                        className="w-full h-64 object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* TAB 3: SETTINGS */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Category</h3>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>News Category *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-blue-500">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {NEWS_CATEGORY_OPTIONS.map((option) => (
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

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Publication Status</h3>

                            <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="h-5 w-5 border-blue-300"
                                            />
                                        </FormControl>
                                        <div className="flex-1">
                                            <FormLabel className="font-semibold cursor-pointer text-blue-900">
                                                Publish this news
                                            </FormLabel>
                                            <p className="text-xs text-blue-700 mt-1">
                                                {field.value
                                                    ? 'This news is published and visible to the public'
                                                    : 'This news is in draft mode and not visible to the public'}
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Information</h4>
                            {isEditing && news && (
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(news.createdAt).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">Last Updated:</span>{' '}
                                        {new Date(news.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
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
                                {isEditing ? 'Update News' : 'Create News'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}