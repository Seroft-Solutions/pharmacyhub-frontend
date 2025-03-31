/**
 * Exam Editor Store
 * 
 * Manages state for the exam editor, including exam metadata, questions,
 * validation, and editing history. Uses the feature-specific store factory
 * for enhanced error handling, performance tracking, and proper integration
 * with core state management patterns.
 * 
 * This store handles:
 * - Exam metadata editing
 * - Question creation, editing, and deletion
 * - Question reordering
 * - Validation of exam and questions
 * - Editing history with undo/redo
 * - State persistence
 */

import { createExamsStore, createExamsSelectors, StoreError } from '../storeFactory';
import { Exam, Question, QuestionType } from '../../types/models/exam';
import logger from '@/core/utils/logger';

/**
 * Interface for Exam Editor State
 */
interface ExamEditorState {
  /**
   * The exam being edited
   */
  exam: Exam | null;
  
  /**
   * The questions for the exam
   */
  questions: Question[];
  
  /**
   * The index of the current question being edited
   */
  currentQuestionIndex: number;
  
  /**
   * Whether the exam has unsaved changes
   */
  isDirty: boolean;
  
  /**
   * Validation errors for the exam and questions
   * Keys can be 'exam', 'questions', or 'question_{index}'
   */
  validation: Record<string, string[]>;
  
  /**
   * Editing history for undo/redo
   */
  history: {
    past: Question[][];
    future: Question[][];
  };
}

/**
 * Interface for Exam Editor Actions
 */
interface ExamEditorActions {
  // Exam actions
  /**
   * Set the exam being edited
   * @param exam The exam to edit
   */
  setExam: (exam: Exam) => void;
  
  /**
   * Update exam properties
   * @param updates Partial exam properties to update
   */
  updateExam: (updates: Partial<Exam>) => void;
  
  // Question actions
  /**
   * Add a new question to the exam
   * @param question Optional partial question data
   */
  addQuestion: (question?: Partial<Question>) => void;
  
  /**
   * Update a question at the specified index
   * @param index Index of the question to update
   * @param question Partial question data to update
   */
  updateQuestion: (index: number, question: Partial<Question>) => void;
  
  /**
   * Remove a question at the specified index
   * @param index Index of the question to remove
   */
  removeQuestion: (index: number) => void;
  
  /**
   * Reorder questions by moving one from source to target index
   * @param fromIndex Source index
   * @param toIndex Target index
   */
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  
  /**
   * Set the current question being edited
   * @param index Index of the question to set as current
   */
  setCurrentQuestion: (index: number) => void;
  
  /**
   * Add a blank question of a specific type
   * @param type The type of question to add
   */
  addQuestionOfType: (type: QuestionType) => void;
  
  // Validation
  /**
   * Validate the entire exam
   * @returns True if the exam is valid, false otherwise
   */
  validateExam: () => boolean;
  
  /**
   * Validate a single question
   * @param question The question to validate
   * @returns Array of validation error messages
   */
  validateQuestion: (question: Question) => string[];
  
  /**
   * Clear all validation errors
   */
  clearValidation: () => void;
  
  // History operations
  /**
   * Undo the last question change
   */
  undo: () => void;
  
  /**
   * Redo the last undone question change
   */
  redo: () => void;
  
  // Misc
  /**
   * Mark the exam as saved (clears isDirty flag)
   */
  markAsSaved: () => void;
  
  /**
   * Reset the store to its initial state
   */
  resetState: () => void;
}

/**
 * Create a default question
 * 
 * @param examId The ID of the exam
 * @param index The index for the question
 * @returns A default question
 */
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
 * Error handler for the exam editor store
 * 
 * @param error The error that occurred
 * @param actionName The name of the action that failed
 * @param storeName The name of the store
 */
const examEditorErrorHandler = (error: unknown, actionName: string, storeName: string) => {
  logger.error(`Error in ${storeName}.${actionName}:`, error);
  
  // Example: You could also send the error to an error tracking service
  // errorTrackingService.captureException(error);
};

/**
 * Create the exam editor store using our feature-specific store factory
 */
export const examEditorStore = createExamsStore<ExamEditorState, ExamEditorActions>(
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
  // Storage options with enhanced configuration
  {
    persist: true,
    partialize: (state) => ({
      // Only persist certain parts of the state
      exam: state.exam,
      questions: state.questions,
      // Don't persist validation, history, etc.
    }),
    debug: process.env.NODE_ENV === 'development',
    trackPerformance: process.env.NODE_ENV === 'development',
    errorHandler: examEditorErrorHandler,
  }
);

// Extract selectors using our feature-specific selector factory
export const { useStore: useExamEditorStore, createSelector } = createExamsSelectors(examEditorStore);

/**
 * Selector for the exam being edited
 * @returns The exam being edited or null
 * @example
 * const exam = useExam();
 * if (exam) {
 *   console.log(`Editing exam: ${exam.title}`);
 * }
 */
export const useExam = createSelector((state) => state.exam);

/**
 * Selector for the list of questions
 * @returns Array of questions
 * @example
 * const questions = useQuestions();
 * console.log(`Total questions: ${questions.length}`);
 */
export const useQuestions = createSelector((state) => state.questions);

/**
 * Selector for the current question index
 * @returns The index of the current question
 * @example
 * const currentIndex = useCurrentQuestionIndex();
 * console.log(`Editing question #${currentIndex + 1}`);
 */
export const useCurrentQuestionIndex = createSelector((state) => state.currentQuestionIndex);

/**
 * Selector for the dirty state
 * @returns True if the exam has unsaved changes
 * @example
 * const isDirty = useIsDirty();
 * if (isDirty) {
 *   console.log('You have unsaved changes');
 * }
 */
export const useIsDirty = createSelector((state) => state.isDirty);

/**
 * Selector for validation errors
 * @returns Record of validation errors
 * @example
 * const validation = useValidation();
 * if (validation.exam) {
 *   console.log('Exam errors:', validation.exam);
 * }
 */
export const useValidation = createSelector((state) => state.validation);

/**
 * Selector for the current question
 * @returns The current question or undefined
 * @example
 * const currentQuestion = useCurrentQuestion();
 * if (currentQuestion) {
 *   console.log(`Editing question: ${currentQuestion.text}`);
 * }
 */
export const useCurrentQuestion = createSelector((state) => 
  state.questions[state.currentQuestionIndex]
);

/**
 * Selector for whether undo is available
 * @returns True if undo is available
 * @example
 * const canUndo = useCanUndo();
 * if (canUndo) {
 *   console.log('You can undo');
 * }
 */
export const useCanUndo = createSelector((state) => state.history.past.length > 0);

/**
 * Selector for whether redo is available
 * @returns True if redo is available
 * @example
 * const canRedo = useCanRedo();
 * if (canRedo) {
 *   console.log('You can redo');
 * }
 */
export const useCanRedo = createSelector((state) => state.history.future.length > 0);

/**
 * Selector for validation errors for a specific question
 * @param questionIndex The index of the question
 * @returns Array of validation errors
 * @example
 * const errors = useQuestionValidation(0);
 * if (errors.length > 0) {
 *   console.log('Question 1 errors:', errors);
 * }
 */
export const useQuestionValidation = (questionIndex: number) => 
  examEditorStore((state) => state.validation[`question_${questionIndex}`] || []);

/**
 * Selector for validation errors for the exam
 * @returns Array of validation errors
 * @example
 * const errors = useExamValidation();
 * if (errors.length > 0) {
 *   console.log('Exam errors:', errors);
 * }
 */
export const useExamValidation = () => 
  examEditorStore((state) => state.validation.exam || []);

/**
 * Selector for the total questions count
 * @returns The total number of questions
 * @example
 * const count = useTotalQuestionsCount();
 * console.log(`Total questions: ${count}`);
 */
export const useTotalQuestionsCount = createSelector((state) => state.questions.length);

/**
 * Selector for the total points
 * @returns The total points for all questions
 * @example
 * const points = useTotalPoints();
 * console.log(`Total points: ${points}`);
 */
export const useTotalPoints = createSelector((state) => 
  state.questions.reduce((total, q) => total + q.pointValue, 0)
);

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
 * } from '@/features/exams-preparation/state';
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
 *   const handleSubmit = async () => {
 *     if (validateExam()) {
 *       try {
 *         // Submit to server
 *         await saveExamToServer(exam, questions);
 *         markAsSaved();
 *         showSuccessToast('Exam saved successfully');
 *       } catch (error) {
 *         showErrorToast('Failed to save exam');
 *       }
 *     } else {
 *       showErrorToast('Please fix validation errors');
 *     }
 *   };
 *   
 *   // Handle question addition
 *   const handleAddQuestion = (type) => {
 *     examEditorStore.getState().addQuestionOfType(type);
 *   };
 *   
 *   // Render UI with data and actions
 *   return (
 *     <div>
 *       <h1>Exam Editor</h1>
 *       
 *       {/* Exam metadata form */}
 *       <ExamMetadataForm 
 *         exam={exam} 
 *         onUpdate={updates => updateExam(updates)}
 *         errors={useExamValidation()}
 *       />
 *       
 *       {/* Questions list */}
 *       <QuestionsList 
 *         questions={questions}
 *         currentIndex={currentIndex}
 *         onSelect={index => examEditorStore.getState().setCurrentQuestion(index)}
 *         onReorder={(from, to) => examEditorStore.getState().reorderQuestions(from, to)}
 *         onRemove={index => examEditorStore.getState().removeQuestion(index)}
 *       />
 *       
 *       {/* Question editor */}
 *       {currentQuestion && (
 *         <QuestionEditor
 *           question={currentQuestion}
 *           onChange={updates => updateQuestion(currentIndex, updates)}
 *           errors={useQuestionValidation(currentIndex)}
 *         />
 *       )}
 *       
 *       {/* Action buttons */}
 *       <div className="actions">
 *         <AddQuestionMenu onSelectType={handleAddQuestion} />
 *         
 *         <Button 
 *           onClick={handleSubmit} 
 *           disabled={!isDirty}
 *           loading={isSaving}
 *         >
 *           Save Exam
 *         </Button>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
