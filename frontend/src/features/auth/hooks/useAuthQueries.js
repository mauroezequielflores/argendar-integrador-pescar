import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset, resendPasswordReset, resetPasswordConfirm } from '../services/auth.service';

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
};

export const useResendPasswordReset = () => {
  return useMutation({
    mutationFn: resendPasswordReset,
  });
};

export const useResetPasswordConfirm = () => {
  return useMutation({
    mutationFn: resetPasswordConfirm,
  });
};
