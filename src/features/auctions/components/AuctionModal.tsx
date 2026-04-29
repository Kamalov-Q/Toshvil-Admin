import { useCallback, useEffect } from 'react';
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
  CreateAuctionSchema,
  UpdateAuctionSchema,
  type CreateAuctionDto,
  type UpdateAuctionDto,
  type Auction,
} from '../schemas/schemas';
import { useCreateAuction, useUpdateAuction } from '../api/hooks';
import { useDistricts } from '@/hooks/useDistricts';
import MultiSelect from '@/components/ui/multi-select';

interface AuctionModalProps {
  auction?: Auction;
  onClose: () => void;
}

export default function AuctionModal({ auction, onClose }: AuctionModalProps) {
  const isEditing = !!auction;
  const createMutation = useCreateAuction();
  const updateMutation = useUpdateAuction(auction?.id || '');
  const { data: districtsData } = useDistricts({ limit: 100 });

  const form = useForm<CreateAuctionDto>({
    resolver: zodResolver(isEditing ? UpdateAuctionSchema : CreateAuctionSchema) as any,
    defaultValues: {
      nameUz: '',
      nameRu: '',
      nameEn: '',
      path: '',
      districtIds: [],
    },
  });

  useEffect(() => {
    if (auction) {
      form.reset({
        nameUz: auction.nameUz,
        nameRu: auction.nameRu,
        nameEn: auction.nameEn || '',
        path: auction.path,
        districtIds: auction.districts?.map((d) => d.id) || [],
      });
    }
  }, [auction, form]);

  const onSubmit = useCallback(
    async (data: CreateAuctionDto) => {
      try {
        if (isEditing) {
          await updateMutation.mutateAsync(data as UpdateAuctionDto);
        } else {
          await createMutation.mutateAsync(data);
        }
        onClose();
      } catch (error) {
        console.error('Auction form error:', error);
      }
    },
    [isEditing, createMutation, updateMutation, onClose]
  );

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="nameUz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomi (UZ)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Auksion nomi (o'zbekcha)" />
                </FormControl>
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
                <FormControl>
                  <Input {...field} placeholder="Auksion nomi (ruscha)" />
                </FormControl>
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
                <FormControl>
                  <Input {...field} placeholder="Auksion nomi (inglizcha)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Havola (Path)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="/auksion/yol" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="districtIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tumanlar</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={districtsData?.data?.map((d: any) => ({ label: d.nameUz, value: d.id })) || []}
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

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            Bekor qilish
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? 'Saqlash' : 'Yaratish'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
