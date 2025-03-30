/**
 * Store for managing exam editor state
 */

import { Exam, Question, QuestionType } from '../../types/models/exam';
import { ExamEditorState } from '../../types/state/exam-state';
import { createStore, createSelectors } from '../storeFactory';

// Helper to create a default question
const createDefaultQuestion = (examId: number, index: number): Question => ({
  id: -1 * (Date.now() + index), // Temporary negative ID until saved to server
  examId,
  text: '',
  type: 'multipleChoice',
  orderIndex: index,
  pointValue: 1,
  options: [
    { id: `temp-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
    { id: `temp-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
  ],
  correctAnswers: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Create the exam editor store using our store factory
 */
export const examEditorStore = createStore<
  // State shape
  {
    exam: Exam | null;
    questions: Question[];
    currentQuestionIndex: number;
    isDirty: boolean;
    validation: Record<string, string[]>;
    history: {
      past: Question[][];
      future: Question[][];
    };
  },
  // Actions
  {
    // Exam actions
    setExam: (exam: Exam) => void;
    updateExam: (updates: Partial<Exam>) => void;
    
    // Question actions
    addQuestion: (question?: Partial<Question>) => void;
    updateQuestion: (index: number, question: Partial<Question>) => void;
    removeQuestion: (index: number) => void;
    reorderQuestions: (fromIndex: number, toIndex: number) => void;
    setCurrentQuestion: (index: number) => void;
    
    // Action to add a blank question of specific type
    addQuestionOfType: (type: QuestionType) => void;
    
    // Validation
    validateExam: () => boolean;
    validateQuestion: (question: Question) => string[];
    clearValidation: () => void;
    
    // History operations
    undo: () => void;
    redo: () => void;
    
    // Misc
    markAsSaved: () => void;
    resetState: () => void;
  }
>(
  'examEditor', // Store name
  // Initial state
  {
    exam: null,
    questions: [],
    currentQuestionIndex: 0,
    isDirty: false,
    validation: {},
    history: {
      past: [],
      future: [],
    },
  },
  // Actions creator
  (set, get) => ({
    // Exam actions
    setExam: (exam) => set({
      exam,
      isDirty: false,
    }),
    
    updateExam: (updates) => set((state) => {
      if (!state.exam) return state;
      
      return {
        exam: {
          ...state.exam,
          ...updates,
        },
        isDirty: true,
      };
    }),
    
    // Question actions
    addQuestion: (questionData) => set((state) => {
      // Skip adding to history (this is a new action)
      const examId = state.exam?.id || 0;
      const newQuestions = [...state.questions];
      
      // Create a new question with default values or merge with provided data
      const newQuestion = {
        ...createDefaultQuestion(examId, newQuestions.length),
        ...questionData,
      };
      
      // Add to history
      const newPast = [...state.history.past, [...state.questions]];
      
      return {
        questions: [...newQuestions, newQuestion],
        currentQuestionIndex: newQuestions.length,
        isDirty: true,
        history: {
          past: newPast,
          future: [],
        },
      };
    }),
    
    updateQuestion: (index, questionUpdates) => set((state) => {
      // Add current state to history
      const newPast = [...state.history.past, [...state.questions]];
      
      // Update the question
      const newQuestions = [...state.questions];
      if (index >= 0 && index < newQuestions.length) {
        newQuestions[index] = {
          ...newQuestions[index],
          ...questionUpdates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      return {
        questions: newQuestions,
        isDirty: true,
        history: {
          past: newPast,
          future: [],
        },
      };
    }),
    
    removeQuestion: (index) => set((state) => {
      // Add current state to history
      const newPast = [...state.history.past, [...state.questions]];
      
      // Remove the question
      const newQuestions = [...state.questions];
      newQuestions.splice(index, 1);
      
      // Update order indices
      const updatedQuestions = newQuestions.map((q, idx) => ({
        ...q,
        orderIndex: idx,
      }));
      
      return {
        questions: updatedQuestions,
        currentQuestionIndex: Math.min(state.currentQuestionIndex, updatedQuestions.length - 1),
        isDirty: true,
        history: {
          past: newPast,
          future: [],
        },
      };
    }),
    
    reorderQuestions: (fromIndex, toIndex) => set((state) => {
      // Add current state to history
      const newPast = [...state.history.past, [...state.questions]];
      
      // Reorder the questions
      const newQuestions = [...state.questions];
      const [movedQuestion] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, movedQuestion);
      
      // Update order indices
      const updatedQuestions = newQuestions.map((q, idx) => ({
        ...q,
        orderIndex: idx,
      }));
      
      return {
        questions: updatedQuestions,
        currentQuestionIndex: toIndex,
        isDirty: true,
        history: {
          past: newPast,
          future: [],
        },
      };
    }),
    
    setCurrentQuestion: (index) => set({
      currentQuestionIndex: index,
    }),
    
    // Action to add a blank question of specific type
    addQuestionOfType: (type) => {
      const { addQuestion } = get();
      const examId = get().exam?.id || 0;
      
      let options: { id: string, text: string, isCorrect: boolean }[] | undefined;
      
      // Set up default options based on question type
      switch (type) {
        case 'multipleChoice':
          options = [
            { id: `temp-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
            { id: `temp-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
            { id: `temp-${Date.now()}-3`, text: 'Option 3', isCorrect: false },
          ];
          break;
        case 'singleChoice':
          options = [
            { id: `temp-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
            { id: `temp-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
            { id: `temp-${Date.now()}-3`, text: 'Option 3', isCorrect: false },
          ];
          break;
        case 'trueFalse':
          options = [
            { id: `temp-${Date.now()}-1`, text: 'True', isCorrect: true },
            { id: `temp-${Date.now()}-2`, text: 'False', isCorrect: false },
          ];
          break;
        case 'matching':
          options = [
            { id: `temp-${Date.now()}-1`, text: 'Item 1', isCorrect: false },
            { id: `temp-${Date.now()}-2`, text: 'Match 1', isCorrect: false },
          ];
          break;
        case 'shortAnswer':
          options = undefined;
          break;
      }
      
      // Add the question
      addQuestion({
        examId,
        type,
        options,
      });
    },
    
    // Validation
    validateExam: () => {
      const { exam, questions } = get();
      const validation: Record<string, string[]> = {};
      let isValid = true;
      
      // Validate exam
      if (!exam) {
        validation.exam = ['No exam data available'];
        isValid = false;
      } else {
        // Exam validations
        const examErrors: string[] = [];
        
        if (!exam.title || exam.title.trim() === '') {
          examErrors.push('Exam title is required');
          isValid = false;
        }
        
        if (exam.timeLimit <= 0) {
          examErrors.push('Time limit must be greater than 0');
          isValid = false;
        }
        
        if (exam.passingScore < 0 || exam.passingScore > 100) {
          examErrors.push('Passing score must be between 0 and 100');
          isValid = false;
        }
        
        if (examErrors.length > 0) {
          validation.exam = examErrors;
        }
      }
      
      // Check if there are any questions
      if (questions.length === 0) {
        validation.questions = ['Exam must have at least one question'];
        isValid = false;
      }
      
      // Validate each question
      questions.forEach((question, index) => {
        const questionValidation = get().validateQuestion(question);
        
        if (questionValidation.length > 0) {
          validation[`question_${index}`] = questionValidation;
          isValid = false;
        }
      });
      
      set({ validation });
      return isValid;
    },
    
    validateQuestion: (question) => {
      const errors: string[] = [];
      
      // Check question text
      if (!question.text || question.text.trim() === '') {
        errors.push('Question text is required');
      }
      
      // Check point value
      if (question.pointValue <= 0) {
        errors.push('Point value must be greater than 0');
      }
      
      // Check options for multiple choice and single choice
      if (
        question.type === 'multipleChoice' || 
        question.type === 'singleChoice' || 
        question.type === 'trueFalse' ||
        question.type === 'matching'
      ) {
        if (!question.options || question.options.length < 2) {
          errors.push(`${question.type} requires at least 2 options`);
        } else {
          // Check if at least one option is marked as correct
          const hasCorrectOption = question.options.some(opt => opt.isCorrect);
          
          if (!hasCorrectOption && question.type !== 'matching') {
            errors.push('At least one option must be marked as correct');
          }
          
          // Check for empty option text
          const hasEmptyOption = question.options.some(opt => !opt.text || opt.text.trim() === '');
          
          if (hasEmptyOption) {
            errors.push('All options must have text');
          }
        }
      }
      
      return errors;
    },
    
    clearValidation: () => set({
      validation: {},
    }),
    
    // History operations
    undo: () => set((state) => {
      const { past, future } = state.history;
      
      if (past.length === 0) return state;
      
      const newPast = [...past];
      const previousState = newPast.pop();
      
      if (!previousState) return state;
      
      return {
        questions: previousState,
        isDirty: true,
        history: {
          past: newPast,
          future: [state.questions, ...future],
        },
      };
    }),
    
    redo: () => set((state) => {
      const { past, future } = state.history;
      
      if (future.length === 0) return state;
      
      const newFuture = [...future];
      const nextState = newFuture.shift();
      
      if (!nextState) return state;
      
      return {
        questions: nextState,
        isDirty: true,
        history: {
          past: [...past, state.questions],
          future: newFuture,
        },
      };
    }),
    
    // Misc
    markAsSaved: () => set({
      isDirty: false,
    }),
    
    resetState: () => set({
      exam: null,
      questions: [],
      currentQuestionIndex: 0,
      isDirty: false,
      validation: {},
      history: {
        past: [],
        future: [],
      },
    }),
  }),
  // Storage options
  {
    persist: true,
    partialize: (state) => ({
      // Only persist certain parts of the state
      exam: state.exam,
      questions: state.questions,
      // Don't persist validation, history, etc.
    }),
  }
);

// Extract selectors using our selector factory
export const { useStore, createSelector } = createSelectors(examEditorStore);

// Create individual selectors for optimized rendering
export const useExam = createSelector((state) => state.exam);
export const useQuestions = createSelector((state) => state.questions);
export const useCurrentQuestionIndex = createSelector((state) => state.currentQuestionIndex);
export const useIsDirty = createSelector((state) => state.isDirty);
export const useValidation = createSelector((state) => state.validation);

// Computed selectors
export const useCurrentQuestion = createSelector((state) => 
  state.questions[state.currentQuestionIndex]
);

export const useCanUndo = createSelector((state) => state.history.past.length > 0);
export const useCanRedo = createSelector((state) => state.history.future.length > 0);

export const useQuestionValidation = (questionIndex: number) => 
  examEditorStore((state) => state.validation[`question_${questionIndex}`] || []);

export const useExamValidation = () => 
  examEditorStore((state) => state.validation.exam || []);

/**
 * Example usage of the examEditorStore:
 * 
 * ```tsx
 * import { 
 *   useExam, 
 *   useQuestions, 
 *   useCurrentQuestion,
 *   useCurrentQuestionIndex,
 *   useIsDirty,
 *   useValidation,
 *   examEditorStore 
 * } from './examEditorStore';
 * 
 * const ExamEditor = () => {
 *   // Get values from store with optimized selectors
 *   const exam = useExam();
 *   const questions = useQuestions();
 *   const currentQuestion = useCurrentQuestion();
 *   const currentIndex = useCurrentQuestionIndex();
 *   const isDirty = useIsDirty();
 *   const validation = useValidation();
 *   
 *   // Get actions from store
 *   const { 
 *     updateExam, 
 *     addQuestion, 
 *     updateQuestion, 
 *     removeQuestion,
 *     validateExam,
 *     markAsSaved 
 *   } = examEditorStore.getState();
 *   
 *   // Handle form submission
 *   const handleSubmit = () => {
 *     if (validateExam()) {
 *       // Submit to server
 *       // ...
 *       markAsSaved();
 *     }
 *   };
 *   
 *   // Rest of component...
 * };
 * ```
 */
