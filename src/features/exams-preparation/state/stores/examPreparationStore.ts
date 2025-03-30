/**
 * Exam Preparation Store
 * 
 * This store manages the state for exam preparation including:
 * - Tracking study progress
 * - Managing study sessions
 * - Tracking practice questions
 */

import { createStore } from '../storeFactory';
import { Exam, Question } from '../../types/models/exam';
import { calculateExamStatistics, formatTimeVerbose } from '../../utils';

// State interface
interface ExamPreparationState {
  // Study session tracking
  activeExamId: number | null;
  studySessionStarted: boolean;
  studySessionStartTime: Date | null;
  totalStudyTimeSeconds: number;
  lastStudySession: {
    examId: number | null;
    duration: number;
    timestamp: string;
  } | null;
  
  // Study progress
  studiedExams: Record<string, {
    lastStudied: string;
    totalTimeSeconds: number;
    completedSections: string[];
    masteredTopics: string[];
    weakTopics: string[];
  }>;
  
  // Practice questions
  studyPlan: {
    dailyGoalMinutes: number;
    weeklySessions: number;
    focusAreas: string[];
  };
  
  // UI State
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExamPreparationState = {
  // Study session tracking
  activeExamId: null,
  studySessionStarted: false,
  studySessionStartTime: null,
  totalStudyTimeSeconds: 0,
  lastStudySession: null,
  
  // Study progress
  studiedExams: {},
  
  // Practice questions
  studyPlan: {
    dailyGoalMinutes: 30,
    weeklySessions: 3,
    focusAreas: [],
  },
  
  // UI State
  isLoading: false,
  error: null,
};

// Actions interface
interface ExamPreparationActions {
  // Study session actions
  startStudySession: (examId: number) => void;
  pauseStudySession: () => void;
  resumeStudySession: () => void;
  endStudySession: () => void;
  
  // Study progress actions
  markSectionCompleted: (examId: number, sectionId: string) => void;
  markTopicMastered: (examId: number, topic: string) => void;
  markTopicWeak: (examId: number, topic: string) => void;
  
  // Study plan actions
  updateStudyPlan: (plan: Partial<ExamPreparationState['studyPlan']>) => void;
  addFocusArea: (topic: string) => void;
  removeFocusArea: (topic: string) => void;
  
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getStudySessionDuration: () => number;
  getFormattedStudyTime: () => string;
  getTotalStudyTime: () => number;
  getStudyProgress: (examId: number) => number;
  
  // Utility actions
  resetState: () => void;
}

// Create the store
export const useExamPreparationStore = createStore<
  ExamPreparationState,
  ExamPreparationActions
>(
  'examPreparation',
  initialState,
  (set, get) => ({
    // Study session actions
    startStudySession: (examId) => {
      set({
        activeExamId: examId,
        studySessionStarted: true,
        studySessionStartTime: new Date(),
        error: null,
      });
    },
    
    pauseStudySession: () => {
      const { studySessionStartTime, totalStudyTimeSeconds } = get();
      
      if (!studySessionStartTime) return;
      
      const now = new Date();
      const sessionDuration = Math.floor(
        (now.getTime() - studySessionStartTime.getTime()) / 1000
      );
      
      set({
        studySessionStarted: false,
        totalStudyTimeSeconds: totalStudyTimeSeconds + sessionDuration,
        studySessionStartTime: null,
      });
    },
    
    resumeStudySession: () => {
      set({
        studySessionStarted: true,
        studySessionStartTime: new Date(),
      });
    },
    
    endStudySession: () => {
      const { 
        studySessionStartTime, 
        totalStudyTimeSeconds, 
        activeExamId,
        studiedExams
      } = get();
      
      if (!activeExamId) return;
      
      let sessionDuration = 0;
      
      // Calculate session duration if still active
      if (studySessionStartTime) {
        const now = new Date();
        sessionDuration = Math.floor(
          (now.getTime() - studySessionStartTime.getTime()) / 1000
        );
      }
      
      const finalDuration = totalStudyTimeSeconds + sessionDuration;
      
      // Get current exam progress
      const examProgress = studiedExams[activeExamId.toString()] || {
        lastStudied: new Date().toISOString(),
        totalTimeSeconds: 0,
        completedSections: [],
        masteredTopics: [],
        weakTopics: [],
      };
      
      // Update the studied exams record
      set({
        studySessionStarted: false,
        studySessionStartTime: null,
        totalStudyTimeSeconds: 0,
        activeExamId: null,
        lastStudySession: {
          examId: activeExamId,
          duration: finalDuration,
          timestamp: new Date().toISOString(),
        },
        studiedExams: {
          ...studiedExams,
          [activeExamId.toString()]: {
            ...examProgress,
            lastStudied: new Date().toISOString(),
            totalTimeSeconds: examProgress.totalTimeSeconds + finalDuration,
          },
        },
      });
    },
    
    // Study progress actions
    markSectionCompleted: (examId, sectionId) => {
      const { studiedExams } = get();
      
      // Get current exam progress
      const examProgress = studiedExams[examId.toString()] || {
        lastStudied: new Date().toISOString(),
        totalTimeSeconds: 0,
        completedSections: [],
        masteredTopics: [],
        weakTopics: [],
      };
      
      // Add section to completed sections if not already there
      if (!examProgress.completedSections.includes(sectionId)) {
        set({
          studiedExams: {
            ...studiedExams,
            [examId.toString()]: {
              ...examProgress,
              completedSections: [...examProgress.completedSections, sectionId],
            },
          },
        });
      }
    },
    
    markTopicMastered: (examId, topic) => {
      const { studiedExams } = get();
      
      // Get current exam progress
      const examProgress = studiedExams[examId.toString()] || {
        lastStudied: new Date().toISOString(),
        totalTimeSeconds: 0,
        completedSections: [],
        masteredTopics: [],
        weakTopics: [],
      };
      
      // Add topic to mastered topics if not already there
      if (!examProgress.masteredTopics.includes(topic)) {
        set({
          studiedExams: {
            ...studiedExams,
            [examId.toString()]: {
              ...examProgress,
              masteredTopics: [...examProgress.masteredTopics, topic],
              // Remove from weak topics if it was there
              weakTopics: examProgress.weakTopics.filter(t => t !== topic),
            },
          },
        });
      }
    },
    
    markTopicWeak: (examId, topic) => {
      const { studiedExams } = get();
      
      // Get current exam progress
      const examProgress = studiedExams[examId.toString()] || {
        lastStudied: new Date().toISOString(),
        totalTimeSeconds: 0,
        completedSections: [],
        masteredTopics: [],
        weakTopics: [],
      };
      
      // Add topic to weak topics if not already there
      if (!examProgress.weakTopics.includes(topic)) {
        set({
          studiedExams: {
            ...studiedExams,
            [examId.toString()]: {
              ...examProgress,
              weakTopics: [...examProgress.weakTopics, topic],
              // Remove from mastered topics if it was there
              masteredTopics: examProgress.masteredTopics.filter(t => t !== topic),
            },
          },
        });
      }
    },
    
    // Study plan actions
    updateStudyPlan: (plan) => {
      set({
        studyPlan: {
          ...get().studyPlan,
          ...plan,
        },
      });
    },
    
    addFocusArea: (topic) => {
      const { studyPlan } = get();
      
      if (!studyPlan.focusAreas.includes(topic)) {
        set({
          studyPlan: {
            ...studyPlan,
            focusAreas: [...studyPlan.focusAreas, topic],
          },
        });
      }
    },
    
    removeFocusArea: (topic) => {
      const { studyPlan } = get();
      
      set({
        studyPlan: {
          ...studyPlan,
          focusAreas: studyPlan.focusAreas.filter(t => t !== topic),
        },
      });
    },
    
    // UI actions
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    
    // Getters
    getStudySessionDuration: () => {
      const { studySessionStartTime, totalStudyTimeSeconds } = get();
      
      if (!studySessionStartTime) {
        return totalStudyTimeSeconds;
      }
      
      const now = new Date();
      const sessionDuration = Math.floor(
        (now.getTime() - studySessionStartTime.getTime()) / 1000
      );
      
      return totalStudyTimeSeconds + sessionDuration;
    },
    
    getFormattedStudyTime: () => {
      const duration = get().getStudySessionDuration();
      return formatTimeVerbose(duration);
    },
    
    getTotalStudyTime: () => {
      const { studiedExams } = get();
      
      return Object.values(studiedExams).reduce(
        (total, exam) => total + exam.totalTimeSeconds,
        0
      );
    },
    
    getStudyProgress: (examId) => {
      const { studiedExams } = get();
      const examProgress = studiedExams[examId.toString()];
      
      if (!examProgress) return 0;
      
      // For now, a simple calculation based on completed sections
      // Could be enhanced with more sophisticated metrics
      return examProgress.completedSections.length * 10;
    },
    
    // Utility actions
    resetState: () => {
      set(initialState);
    },
  }),
  {
    persist: true,
    storageKey: 'exams-prep-study-progress',
    partialize: (state) => ({
      totalStudyTimeSeconds: state.totalStudyTimeSeconds,
      studiedExams: state.studiedExams,
      studyPlan: state.studyPlan,
      lastStudySession: state.lastStudySession,
    }),
  }
);

// Selectors
export const useStudyPlan = () => useExamPreparationStore(state => state.studyPlan);
export const useStudyProgress = () => useExamPreparationStore(state => state.studiedExams);
export const useTotalStudyTime = () => useExamPreparationStore(state => state.getTotalStudyTime());
export const useActiveSession = () => useExamPreparationStore(state => ({
  activeExamId: state.activeExamId,
  studySessionStarted: state.studySessionStarted,
  duration: state.getStudySessionDuration(),
  formattedDuration: state.getFormattedStudyTime(),
}));
