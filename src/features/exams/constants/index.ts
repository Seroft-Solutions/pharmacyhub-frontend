/**
 * Exams Feature Constants
 * 
 * Defines the exams feature's permissions, feature flags, and requirements.
 */
import { defineFeature } from '@/features/rbac/registry';
import { Role } from '@/features/rbac/constants/roles';
import { registerFeature } from '@/features/rbac/registry';

// Feature definition
export const EXAMS_FEATURE = defineFeature(
  'exams',
  'Examinations',
  'Create, manage, take, and grade exams and assessments'
);

import {
  ExamPermission,
  EXAMS_ADMIN_PERMISSIONS,
  EXAMS_COMMON_PERMISSIONS
} from './permissions';


import {
  ExamFeatureFlag,
  EXAM_FEATURE_FLAGS
} from './flags';


import { EXAMS_REQUIRED_ROLES } from './roles';



/**
 * Feature initializer
 * Call this to register the feature with the registry
 */
export function initializeExamsFeature() {
  // Register this feature with the registry
  registerFeature(
    EXAMS_FEATURE,
    ExamPermission,
    EXAMS_REQUIRED_ROLES,
    ExamFeatureFlag,
    EXAM_FEATURE_FLAGS
  );
  
  console.log('Exams feature registered');
}
