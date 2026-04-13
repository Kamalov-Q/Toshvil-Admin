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
import { Loader, Save, X } from 'lucide-react';
import {
    CreateLeadershipSchema,
    UpdateLeadershipSchema,
    type CreateLeadershipDto,
    type UpdateLeadershipDto,
    type Leadership,
} from '@/types/management.types';
import { useCreateLeadership, useUpdateLeadership } from '@/hooks/useManagement';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useDistricts } from '@/hooks/useDistricts';
import { FileUploader } from '@/features/lots/components/FileUploader';
import MultiSelect from '@/components/ui/multi-select'; // Assuming this exists or I'll create/use simple multi-select

interface LeadershipFormProps {
    initialData?: Leadership;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function LeadershipForm({
    initialData,
    onSuccess,
    onCancel,
}: LeadershipFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreateLeadership();
    const updateMutation = useUpdateLeadership(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const { data: departmentsData } = useDepartments({ limit: 100 });
    const { data: districtsData } = useDistricts({ limit: 100 });
    
    const form = useForm<CreateLeadershipDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdateLeadershipSchema : CreateLeadershipSchema) as any,
        defaultValues: {
            nameUz: initialData?.nameUz || '',
            nameRu: initialData?.nameRu || '',
            nameEn: initialData?.nameEn || '',
            image: initialData?.image || null,
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            departmentId: initialData?.departmentId || '',
            positionId: initialData?.positionId || '',
            districtIds: initialData?.districts?.map(d => d.id) || [],
        },
    });

    const selectedDeptId = form.watch('departmentId');
    const { data: positionsData, isLoading: positionsLoading } = usePositions({ 
        departmentId: selectedDeptId,
        limit: 100 
    });

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdateLeadershipDto);
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
                                            label="Xodim rasmini yuklash"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="nameUz"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>F.I.O. (UZ)</FormLabel>
                                        <FormControl><Input {...field} placeholder="To'liq ism sharifi" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameRu"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ф.И.О. (RU)</FormLabel>
                                        <FormControl><Input {...field} placeholder="Полное имя" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name (EN)</FormLabel>
                                        <FormControl><Input {...field} placeholder="Full name" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bo'lim</FormLabel>
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        form.setValue('positionId', '');
                                    }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Bo'limni tanlang" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departmentsData?.data?.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.nameUz}
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
                            name="positionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lavozim</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        disabled={!selectedDeptId || positionsLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={selectedDeptId ? "Lavozimni tanlang" : "Oldin bo'limni tanlang"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {positionsData?.data?.map((pos) => (
                                                <SelectItem key={pos.id} value={pos.id}>
                                                    {pos.nameUz}
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
                            name="districtIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tumanlar / Shaharlar</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={districtsData?.data?.map(d => ({ label: d.nameUz, value: d.id })) || []}
                                            selected={field.value}
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
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md">
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
