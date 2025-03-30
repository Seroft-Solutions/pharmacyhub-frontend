/**
 * Exams Preparation Feature
 * 
 * This feature module follows the Feature-First Organization pattern
 * and fully leverages core modules as the foundation.
 * 
 * The exams-preparation feature allows users to create, take, and manage exams
 * with support for premium content via payment integration.
 */

// Public API exports

// Components - only export what's meant to be used by other features or app pages
export * from './components/atoms';
export * from './components/molecules';
export * from './components/organisms';
export * from './components/templates';
export * from './components/guards';

// API/Data hooks
export * from './api';

// Types that might be needed by other features
export * from './types';

// Feature-specific hooks
export * from './hooks';
