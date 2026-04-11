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
    CreatePositionSchema,
    UpdatePositionSchema,
    type CreatePositionDto,
    type UpdatePositionDto,
    type Position,
} from '@/types/position.types';
import { useCreatePosition, useUpdatePosition } from '@/hooks/usePositions';
import { useDepartments } from '@/hooks/useDepartments';

interface PositionFormProps {
    initialData?: Position;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function PositionForm({
    initialData,
    onSuccess,
    onCancel,
}: PositionFormProps) {
    const isEditing = !!initialData;
    const createMutation = useCreatePosition();
    const updateMutation = useUpdatePosition(initialData?.id || '');
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const { data: departmentsData, isLoading: departmentsLoading } = useDepartments({ limit: 100 });

    const form = useForm<CreatePositionDto>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEditing ? UpdatePositionSchema : CreatePositionSchema) as any,
        defaultValues: initialData || {
            nameUz: '',
            nameRu: '',
            nameEn: '',
            departmentId: '',
        },
    });

    const onSubmit = useCallback(
        async (data: CreatePositionDto) => {
            try {
                if (isEditing) {
                    await updateMutation.mutateAsync(data as UpdatePositionDto);
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
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bo'lim</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    disabled={departmentsLoading}
                                >
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
                        name="nameUz"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lavozim nomi (UZ)</FormLabel>
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
                                <FormLabel>Lavozim nomi (RU)</FormLabel>
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
                                <FormLabel>Lavozim nomi (EN)</FormLabel>
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
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
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
