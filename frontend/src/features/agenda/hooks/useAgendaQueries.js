import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendaService } from '../services/agenda.service';
import { agendaKeys } from '../constants/agenda.queryKeys';

export const useTurnos = (tab) =>
  useQuery({
    queryKey: agendaKeys.turnos(tab),
    queryFn: () => agendaService.getTurnos(tab),
    staleTime: 1000 * 60 * 1, // 1 minuto, volátil
    enabled: tab === 'proximos' || tab === 'historial',
  });

export const useSolicitudes = () =>
  useQuery({
    queryKey: agendaKeys.solicitudes(),
    queryFn: () => agendaService.getSolicitudes(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

export const useCrearSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agendaService.crearSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agendaKeys.solicitudes() });
    },
  });
};
