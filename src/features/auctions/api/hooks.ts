
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/axios';
import type { Auction, CreateAuctionDto, UpdateAuctionDto } from '../schemas/schemas';
import { toast } from '../../../utils/toast';

export interface GetAuctionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AuctionsResponse {
  data: Auction[];
  total: number;
  page: number;
  limit: number;
}

export const useAuctions = (params: GetAuctionsParams = {}) => {
  return useQuery<AuctionsResponse>({
    queryKey: ['auctions', params],
    queryFn: async () => {
      const response = await apiClient.get<AuctionsResponse>('/auctions', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.search && { search: params.search }),
        },
      });
      return response.data;
    },
  });
};

export const useAuction = (id: string) => {
  return useQuery<Auction>({
    queryKey: ['auction', id],
    queryFn: async () => {
      const response = await apiClient.get<Auction>(`/auctions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAuctionDto) => {
      const response = await apiClient.post<Auction>('/auctions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success('Auksion muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

export const useUpdateAuction = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAuctionDto) => {
      const response = await apiClient.patch<Auction>(`/auctions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', id] });
      toast.success('Auksion muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

export const useDeleteAuction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/auctions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success('Auksion o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};
