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
import { AlertCircle, Loader, Save, X } from 'lucide-react';
import {
    CreateDistrictSchema,
    UpdateDistrictSchema,
    type CreateDistrictDto,
    type UpdateDistrictDto,
    type District,
    DISTRICT_TYPE_OPTIONS,
} from '../../../types/district.types';
import { useCreateDistrict, useUpdateDistrict } from '../../../hooks/useDistricts';
import { FileUploader } from '@/features/lots/components/FileUploader';

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
    const createMutation = useCreateDistrict();
    const updateMutation = useUpdateDistrict(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CreateDistrictDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateDistrictSchema : CreateDistrictSchema) as any,
        mode: 'onChange',
        defaultValues: initialData || {
            nameUz: '',
            nameRu: '',
            nameEn: '',
            type: 'tuman',
            hokimNameUz: '',
            hokimNameRu: '',
            hokimNameEn: '',
            hokimPhoto: '',
            hokimDocumentUz: '',
            hokimDocumentRu: '',
            hokimDocumentEn: '',
            addressUz: '',
            addressRu: '',
            addressEn: '',
            phone: '',
            email: '',
            website: '',
            eXat: '',
            receptionDaysUz: '',
            receptionDaysRu: '',
            receptionDaysEn: '',
            latitude: 41.2995,
            longitude: 69.2401,
            sortOrder: 0,
        },
    });

    const errorCount = Object.keys(form.formState.errors).length;

    const onSubmit = useCallback(
        async (data: CreateDistrictDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdateDistrictDto);
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

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">Umumiy</TabsTrigger>
                        <TabsTrigger value="hokim">Hokim ma'lumotlari</TabsTrigger>
                        <TabsTrigger value="contact">Aloqa</TabsTrigger>
                        <TabsTrigger value="media">Media va hujjatlar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <FormField
                                control={form.control}
                                name="sortOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Saralash tartibi</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="nameUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomi (UZ)</FormLabel>
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
                                        <FormLabel>Nomi (RU)</FormLabel>
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
                                        <FormLabel>Nomi (EN)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="hokim" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="hokimNameUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hokim ismi (UZ)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hokimNameRu"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hokim ismi (RU)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hokimNameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hokim ismi (EN)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="receptionDaysUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qabul kunlari (UZ)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="receptionDaysRu"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qabul kunlari (RU)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="receptionDaysEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qabul kunlari (EN)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefon raqami</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
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
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Veb-sayt (ixtiyoriy)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="eXat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-Xat (ixtiyoriy)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="addressUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manzil (UZ)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="addressRu"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manzil (RU)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="addressEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manzil (EN)</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kenglik (Latitude)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                step="0.0001"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
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
                                        <FormLabel>Uzunlik (Longitude)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                step="0.0001"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="hokimPhoto"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                control={form.control}
                                                name="hokimPhoto"
                                                accept="image/*"
                                                folder="districts"
                                                label="Hokim rasmini yuklash"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hokimDocumentUz"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                control={form.control}
                                                name="hokimDocumentUz"
                                                accept=".pdf,.doc,.docx"
                                                folder="districts"
                                                label="Hujjat yuklash (UZ)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hokimDocumentRu"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                control={form.control}
                                                name="hokimDocumentRu"
                                                accept=".pdf,.doc,.docx"
                                                folder="districts"
                                                label="Hujjat yuklash (RU)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hokimDocumentEn"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUploader
                                                control={form.control}
                                                name="hokimDocumentEn"
                                                accept=".pdf,.doc,.docx"
                                                folder="districts"
                                                label="Hujjat yuklash (EN)"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                </Tabs>

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
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
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
