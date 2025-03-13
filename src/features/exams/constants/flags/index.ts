/**
 * Exams Feature Flags
 * 
 * Defines all feature flags related to the exams feature.
 */

/**
 * Feature flags for the Exams feature
 */
export enum ExamFeatureFlag {
  // Core functionality flags
  ENABLE_EXAM_CREATION = 'exams:enable-creation',
  ENABLE_EXAM_EDITING = 'exams:enable-editing',
  ENABLE_EXAM_DELETION = 'exams:enable-deletion',
  
  // Paper type flags
  ENABLE_MODEL_PAPERS = 'exams:enable-model-papers',
  ENABLE_PAST_PAPERS = 'exams:enable-past-papers',
  ENABLE_SUBJECT_PAPERS = 'exams:enable-subject-papers',
  ENABLE_PRACTICE_PAPERS = 'exams:enable-practice-papers',
  
  // Advanced features
  ENABLE_ANALYTICS = 'exams:enable-analytics',
  ENABLE_EXPORT = 'exams:enable-export',
  ENABLE_QUESTION_BANKING = 'exams:enable-question-banking',
  
  // Experiment flags
  EXPERIMENTAL_NEW_EXAM_UI = 'exams:experimental-new-ui',
  EXPERIMENTAL_QUESTION_EDITOR = 'exams:experimental-question-editor'
}

/**
 * Default status for features (which ones are enabled by default)
 */
export const EXAM_FEATURE_FLAGS = {
  [ExamFeatureFlag.ENABLE_EXAM_CREATION]: true,
  [ExamFeatureFlag.ENABLE_EXAM_EDITING]: true,
  [ExamFeatureFlag.ENABLE_EXAM_DELETION]: true,
  
  [ExamFeatureFlag.ENABLE_MODEL_PAPERS]: true,
  [ExamFeatureFlag.ENABLE_PAST_PAPERS]: true,
  [ExamFeatureFlag.ENABLE_SUBJECT_PAPERS]: true,
  [ExamFeatureFlag.ENABLE_PRACTICE_PAPERS]: true,
  
  [ExamFeatureFlag.ENABLE_ANALYTICS]: true,
  [ExamFeatureFlag.ENABLE_EXPORT]: true,
  [ExamFeatureFlag.ENABLE_QUESTION_BANKING]: false,
  
  [ExamFeatureFlag.EXPERIMENTAL_NEW_EXAM_UI]: false,
  [ExamFeatureFlag.EXPERIMENTAL_QUESTION_EDITOR]: false
};
