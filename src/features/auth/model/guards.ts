import { ReactNode } from 'react';
import { Permission } from './types';

export interface GuardProps {
  children: ReactNode;
}

export interface FeatureGuardProps extends GuardProps {
  permissions: Permission[];
}