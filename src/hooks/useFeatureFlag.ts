import {featureFlags} from '@/config/features/feature-flags';
import {useAuth} from './useAuth';

interface FeatureFlag {
  enabled: boolean;
  roles?: string[];
  environments?: string[];
}

interface FeatureFlags {
  [key: string]: FeatureFlag;
}

export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const {user, hasRole} = useAuth();
  const flag = (featureFlags as FeatureFlags)[flagName];

  if (!flag) return false;

  if (flag.roles?.length && !flag.roles.some(role => hasRole(role))) {
    return false;
  }

  if (flag.environments?.length && !flag.environments.includes(process.env.NEXT_PUBLIC_ENVIRONMENT || 'development')) {
    return false;
  }

  return flag.enabled;
}
