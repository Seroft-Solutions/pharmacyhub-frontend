import { FC } from 'react';

interface AuthLoadingProps {
  message?: string;
}

export const AuthLoading: FC<AuthLoadingProps> = ({
  message = 'Authenticating...'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="relative">
          {/* Spinner */}
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4 mx-auto"></div>
        </div>
        <p className="text-gray-600 text-lg">
          {message}
        </p>
      </div>
    </div>
  );
};

// Create a specialized version for initial auth check
export const InitialAuthCheck: FC = () => (
  <AuthLoading message="Checking authentication..." />
);

// Create a loading state for permission checks
export const PermissionCheck: FC = () => (
  <AuthLoading message="Verifying permissions..." />
);

// Create a loading state for token refresh
export const TokenRefresh: FC = () => (
  <AuthLoading message="Refreshing session..." />
);

// Create a loading state for profile loading
export const ProfileLoading: FC = () => (
  <AuthLoading message="Loading profile..." />
);