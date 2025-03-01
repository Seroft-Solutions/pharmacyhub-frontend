/**
 * Exams Feature Flags
 * 
 * Defines feature flags for the exams feature with clear, easy-to-configure settings.
 */

/**
 * Feature flags for exam creation and management
 */
export enum ExamFeatureFlag {
  // Core exam features
  TIMED_EXAMS = 'exams:timed',
  RANDOMIZED_QUESTIONS = 'exams:randomized',
  QUESTION_FEEDBACK = 'exams:question-feedback',
  PARTIAL_GRADING = 'exams:partial-grading',
  
  // Advanced features
  ADVANCED_QUESTION_TYPES = 'exams:advanced-questions',
  EXAM_CERTIFICATES = 'exams:certificates',
  EXAM_STATISTICS = 'exams:statistics',
  PROCTORING = 'exams:proctoring'
}

/**
 * Default values for all feature flags
 * Each flag has a separate, clearly named constant for easier configuration
 */

// Basic features - enabled by default
export const FEATURE_TIMED_EXAMS_ENABLED = true;
export const FEATURE_RANDOMIZED_QUESTIONS_ENABLED = true;
export const FEATURE_QUESTION_FEEDBACK_ENABLED = true;
export const FEATURE_PARTIAL_GRADING_ENABLED = true;

// Advanced features - some disabled by default
export const FEATURE_ADVANCED_QUESTION_TYPES_ENABLED = true;
export const FEATURE_EXAM_CERTIFICATES_ENABLED = true;
export const FEATURE_EXAM_STATISTICS_ENABLED = true;
export const FEATURE_PROCTORING_ENABLED = false;  // Disabled by default

/**
 * Feature flag metadata with names, descriptions, and default settings
 */
export const EXAM_FEATURE_FLAGS = {
  [ExamFeatureFlag.TIMED_EXAMS]: {
    name: 'Timed Exams',
    description: 'Allow setting time limits for exams',
    defaultEnabled: FEATURE_TIMED_EXAMS_ENABLED
  },
  [ExamFeatureFlag.RANDOMIZED_QUESTIONS]: {
    name: 'Randomized Questions',
    description: 'Randomly order questions for each exam session',
    defaultEnabled: FEATURE_RANDOMIZED_QUESTIONS_ENABLED
  },
  [ExamFeatureFlag.QUESTION_FEEDBACK]: {
    name: 'Question Feedback',
    description: 'Allow feedback and explanations for each question',
    defaultEnabled: FEATURE_QUESTION_FEEDBACK_ENABLED
  },
  [ExamFeatureFlag.PARTIAL_GRADING]: {
    name: 'Partial Grading',
    description: 'Allow partial credit for partially correct answers',
    defaultEnabled: FEATURE_PARTIAL_GRADING_ENABLED
  },
  [ExamFeatureFlag.ADVANCED_QUESTION_TYPES]: {
    name: 'Advanced Question Types',
    description: 'Enable complex question types like matching, ordering, and drag-drop',
    defaultEnabled: FEATURE_ADVANCED_QUESTION_TYPES_ENABLED
  },
  [ExamFeatureFlag.EXAM_CERTIFICATES]: {
    name: 'Completion Certificates',
    description: 'Generate certificates for completed exams',
    defaultEnabled: FEATURE_EXAM_CERTIFICATES_ENABLED
  },
  [ExamFeatureFlag.EXAM_STATISTICS]: {
    name: 'Exam Statistics',
    description: 'Show detailed statistics and analytics for exam results',
    defaultEnabled: FEATURE_EXAM_STATISTICS_ENABLED
  },
  [ExamFeatureFlag.PROCTORING]: {
    name: 'Exam Proctoring',
    description: 'Monitor and prevent cheating during exams',
    defaultEnabled: FEATURE_PROCTORING_ENABLED
  }
};
