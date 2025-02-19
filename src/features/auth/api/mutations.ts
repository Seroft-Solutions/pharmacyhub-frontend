import { useMutation } from '@tanstack/react-query';
import { AuthService } from './authService';
import {
  LoginCredentials,
  RegistrationData,
  ResetPasswordData,
  PasswordRecoveryRequest,
  VerificationRequest
} from '../model/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      AuthService.login(credentials.email, credentials.password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegistrationData) => 
      AuthService.registerUser(userData),
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (request: PasswordRecoveryRequest) => 
      AuthService.requestPasswordReset(request.email),
  });
};

export const useValidateResetToken = () => {
  return useMutation({
    mutationFn: (token: string) => 
      AuthService.validateResetToken(token),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => 
      AuthService.completePasswordReset(data.token, data.password),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (request: VerificationRequest) => 
      AuthService.verifyEmail(request.token),
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => 
      AuthService.resendVerificationEmail(email),
  });
};