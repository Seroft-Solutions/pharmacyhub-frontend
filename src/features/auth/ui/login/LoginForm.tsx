import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../hooks';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to login. Please check your credentials.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
          disabled={isLoggingIn}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Password"
          disabled={isLoggingIn}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
