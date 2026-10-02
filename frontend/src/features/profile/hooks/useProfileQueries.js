import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { profileKeys } from '../constants/profile.queryKeys';

export const useClientProfile = () => {
  return useQuery({
    queryKey: profileKeys.client(),
    queryFn: profileService.getClientProfile,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateClientProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.client() });
    },
  });
};

export const useProfessionalProfile = () => {
  return useQuery({
    queryKey: profileKeys.professional(),
    queryFn: profileService.getProfessionalProfile,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfessionalProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateProfessionalProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.professional() });
    },
  });
};

export const usePublicProfessionalProfile = (id) => {
  return useQuery({
    queryKey: profileKeys.public(id),
    queryFn: () => profileService.getPublicProfessionalProfile(id),
    staleTime: 1000 * 60 * 15, // 15 min
    enabled: !!id,
  });
};

export const useProfileSettings = (role) => {
  return useQuery({
    queryKey: profileKeys.settings(role),
    queryFn: () => profileService.getSettings(role),
    staleTime: 1000 * 60 * 5,
    enabled: !!role,
  });
};

export const useUpdateProfileSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateSettings,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.settings(variables.role) });
    },
  });
};
