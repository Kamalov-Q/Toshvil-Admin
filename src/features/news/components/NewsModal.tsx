import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
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
import { AlertCircle, Loader } from 'lucide-react';

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
                                {errorCount} ta maydonda xatolik bor
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                                Iltimos, har bir tabdagi belgilangan maydonlarni tekshiring
                            </p>
                        </div>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="content">Tarkib</TabsTrigger>
                        <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: CONTENT */}
                    <TabsContent value="content" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Sarlavhalar</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="titleUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sarlavha (UZ) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="O'zbekcha sarlavha"
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
                                            <FormLabel>Sarlavha (RU) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Ruscha sarlavha"
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
                                            <FormLabel>Sarlavha (EN) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Inglizcha sarlavha"
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
                            <h3 className="font-semibold text-lg text-gray-900">Qisqacha tavsif</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionUz"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Qisqacha tavsif (UZ)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Qisqacha tavsifni kiriting..."
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionRu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Qisqacha tavsif (RU)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Ruscha qisqacha tavsifni kiriting..."
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="shortDescriptionEn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Qisqacha tavsif (EN)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Inglizcha qisqacha tavsifni kiriting..."
                                                    className="min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">To'liq tavsif</h3>
                            <FormField
                                control={form.control}
                                name="descriptionUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tavsif (UZ) *</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={5} placeholder="To'liq tavsif (UZ)" className="resize-none" />
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
                                        <FormLabel>Tavsif (RU) *</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={5} placeholder="To'liq tavsif (RU)" className="resize-none" />
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
                                        <FormLabel>Tavsif (EN) *</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={5} placeholder="To'liq tavsif (EN)" className="resize-none" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    {/* TAB 2: MEDIA */}
                    <TabsContent value="media" className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Asosiy rasm</h3>
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
                                            label="Rasm yuklash"
                                            description="PNG, JPG, GIF 10MB gacha."
                                            maxSize={50}
                                        />
                                        <FormMessage className="text-xs text-red-600" />
                                        {field.value && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700">Oldindan ko'rish</p>
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
                            <h3 className="font-semibold text-lg text-gray-900">Kategoriya</h3>
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategoriya</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Kategoriyani tanlang" />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-gray-900">Holati</h3>
                            <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Chop etish</FormLabel>
                                            <p className="text-xs text-gray-500">Ushbu yangilikni hamma ko'ra oladigan qiling</p>
                                        </div>
                                    </FormItem>
                                )}
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
                    >
                        Bekor qilish
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                        {isLoading ? (
                            <><Loader className="w-4 h-4 mr-2 animate-spin" />Saqlanmoqda...</>
                        ) : (
                            <>{isEditing ? 'Yangilash' : 'Chop etish'}</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}