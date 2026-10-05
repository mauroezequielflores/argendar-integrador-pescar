import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '../services/marketplace.service';
import { marketplaceKeys } from '../constants/marketplace.queryKeys';

export const useRequests = (filters) => {
  return useQuery({
    queryKey: [...marketplaceKeys.requests(), filters],
    queryFn: () => marketplaceService.getRequests(filters),
    staleTime: 1000 * 60 * 1, // 1 min
  });
};

export const useRequestDetail = (id) => {
  return useQuery({
    queryKey: marketplaceKeys.requestDetail(id),
    queryFn: () => marketplaceService.getRequestById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: marketplaceService.createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.requests() });
    },
  });
};

export const useProfessionalsMarketplace = (filters) => {
  return useQuery({
    queryKey: ['client', 'marketplace', 'professionals', filters],
    queryFn: () => marketplaceService.getClientProfessionals(filters),
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
