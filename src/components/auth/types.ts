import { ReactNode } from 'react';
import { Permission } from '@/types/auth';

export interface GuardProps {
  children: ReactNode;
}

export interface FeatureGuardProps extends GuardProps {
  permissions: Permission[];
}