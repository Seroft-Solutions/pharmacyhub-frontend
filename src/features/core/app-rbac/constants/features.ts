/**
 * Feature codes for RBAC
 * These match the backend feature codes
 */
export const FEATURES = {
  // Core features
  DASHBOARD: 'dashboard',
  
  // User management features
  USER_MANAGEMENT: 'user_management',
  USER_VIEW: 'user_view',
  USER_CREATE: 'user_create',
  USER_EDIT: 'user_edit',
  USER_DELETE: 'user_delete',
  
  // Exam features
  EXAM_MANAGEMENT: 'exam_management',
  EXAM_VIEW: 'exam_view',
  EXAM_CREATE: 'exam_create',
  EXAM_EDIT: 'exam_edit',
  EXAM_DELETE: 'exam_delete',
  EXAM_TAKE: 'exam_take',
  EXAM_GRADE: 'exam_grade',
  
  // Paper type features
  PAPER_MANAGEMENT: 'paper_management',
  PRACTICE_PAPERS: 'practice_papers',
  MODEL_PAPERS: 'model_papers',
  PAST_PAPERS: 'past_papers',
  SUBJECT_PAPERS: 'subject_papers'
};

/**
 * Feature group mapping
 * Maps a feature group to its child features
 */
export const FEATURE_GROUPS = {
  [FEATURES.USER_MANAGEMENT]: [
    FEATURES.USER_VIEW,
    FEATURES.USER_CREATE,
    FEATURES.USER_EDIT,
    FEATURES.USER_DELETE
  ],
  [FEATURES.EXAM_MANAGEMENT]: [
    FEATURES.EXAM_VIEW,
    FEATURES.EXAM_CREATE,
    FEATURES.EXAM_EDIT,
    FEATURES.EXAM_DELETE,
    FEATURES.EXAM_TAKE,
    FEATURES.EXAM_GRADE
  ],
  [FEATURES.PAPER_MANAGEMENT]: [
    FEATURES.PRACTICE_PAPERS,
    FEATURES.MODEL_PAPERS,
    FEATURES.PAST_PAPERS,
    FEATURES.SUBJECT_PAPERS
  ]
};

/**
 * Feature display names
 * Human-readable names for features
 */
export const FEATURE_NAMES = {
  [FEATURES.DASHBOARD]: 'Dashboard',
  
  [FEATURES.USER_MANAGEMENT]: 'User Management',
  [FEATURES.USER_VIEW]: 'View Users',
  [FEATURES.USER_CREATE]: 'Create Users',
  [FEATURES.USER_EDIT]: 'Edit Users',
  [FEATURES.USER_DELETE]: 'Delete Users',
  
  [FEATURES.EXAM_MANAGEMENT]: 'Exam Management',
  [FEATURES.EXAM_VIEW]: 'View Exams',
  [FEATURES.EXAM_CREATE]: 'Create Exams',
  [FEATURES.EXAM_EDIT]: 'Edit Exams',
  [FEATURES.EXAM_DELETE]: 'Delete Exams',
  [FEATURES.EXAM_TAKE]: 'Take Exams',
  [FEATURES.EXAM_GRADE]: 'Grade Exams',
  
  [FEATURES.PAPER_MANAGEMENT]: 'Paper Management',
  [FEATURES.PRACTICE_PAPERS]: 'Practice Papers',
  [FEATURES.MODEL_PAPERS]: 'Model Papers',
  [FEATURES.PAST_PAPERS]: 'Past Papers',
  [FEATURES.SUBJECT_PAPERS]: 'Subject Papers'
};