/**
 * Test suite for the exam editor store
 */

import { examEditorStore, useExamEditorStore, useExam, useQuestions, useCurrentQuestionIndex, useIsDirty, useCurrentQuestion, useCanUndo, useCanRedo } from '../examEditorStore';
import { createExamsStore } from '../../storeFactory';
import { Exam, Question } from '../../../types/models/exam';

// Mock the store factory to avoid actual persistence during tests
jest.mock('../../storeFactory', () => {
  const originalModule = jest.requireActual('../../storeFactory');
  return {
    ...originalModule,
    createExamsStore: jest.fn(originalModule.createExamsStore),
  };
});

// Mock an exam for testing
const mockExam: Exam = {
  id: 1,
  title: 'Test Exam',
  description: 'A test exam',
  timeLimit: 60,
  passingScore: 70,
  status: 'draft',
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questionCount: 0,
};

// Mock a question for testing
const mockQuestion: Question = {
  id: 1,
  examId: 1,
  text: 'Test Question',
  type: 'multipleChoice',
  orderIndex: 0,
  pointValue: 1,
  options: [
    { id: 'opt1', text: 'Option 1', isCorrect: true },
    { id: 'opt2', text: 'Option 2', isCorrect: false },
  ],
  correctAnswers: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('examEditorStore', () => {
  // Reset store before each test
  beforeEach(() => {
    // Reset the store to initial state
    examEditorStore.getState().resetState();
    
    // Reset mock counters
    (createExamsStore as jest.Mock).mockClear();
  });
  
  it('should be created with correct initial state', () => {
    // Verify that the store was created
    expect(createExamsStore).toHaveBeenCalledWith(
      'examEditor',
      expect.any(Object),
      expect.any(Function),
      expect.any(Object)
    );
    
    // Check initial state
    const state = examEditorStore.getState();
    expect(state.exam).toBeNull();
    expect(state.questions).toEqual([]);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.isDirty).toBe(false);
    expect(state.validation).toEqual({});
    expect(state.history).toEqual({ past: [], future: [] });
  });
  
  it('should set exam correctly', () => {
    // Set exam
    examEditorStore.getState().setExam(mockExam);
    
    // Verify state
    expect(examEditorStore.getState().exam).toEqual(mockExam);
    expect(examEditorStore.getState().isDirty).toBe(false);
    
    // Verify selector
    const exam = useExam();
    expect(exam).toEqual(mockExam);
  });
  
  it('should update exam correctly', () => {
    // Set exam
    examEditorStore.getState().setExam(mockExam);
    
    // Update exam
    examEditorStore.getState().updateExam({
      title: 'Updated Title',
      passingScore: 80,
    });
    
    // Verify state
    expect(examEditorStore.getState().exam).toEqual({
      ...mockExam,
      title: 'Updated Title',
      passingScore: 80,
    });
    expect(examEditorStore.getState().isDirty).toBe(true);
  });
  
  it('should add question correctly', () => {
    // Set exam
    examEditorStore.getState().setExam(mockExam);
    
    // Add question
    examEditorStore.getState().addQuestion(mockQuestion);
    
    // Verify state
    expect(examEditorStore.getState().questions).toHaveLength(1);
    expect(examEditorStore.getState().questions[0]).toMatchObject({
      ...mockQuestion,
      id: expect.any(Number), // ID is generated
    });
    expect(examEditorStore.getState().currentQuestionIndex).toBe(0);
    expect(examEditorStore.getState().isDirty).toBe(true);
    expect(examEditorStore.getState().history.past).toHaveLength(1);
    
    // Verify selectors
    const questions = useQuestions();
    expect(questions).toHaveLength(1);
    
    const currentIndex = useCurrentQuestionIndex();
    expect(currentIndex).toBe(0);
    
    const isDirty = useIsDirty();
    expect(isDirty).toBe(true);
  });
  
  it('should add question of specific type correctly', () => {
    // Set exam
    examEditorStore.getState().setExam(mockExam);
    
    // Add question of specific type
    examEditorStore.getState().addQuestionOfType('trueFalse');
    
    // Verify state
    expect(examEditorStore.getState().questions).toHaveLength(1);
    expect(examEditorStore.getState().questions[0]).toMatchObject({
      type: 'trueFalse',
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    });
  });
  
  it('should update question correctly', () => {
    // Set exam and add question
    examEditorStore.getState().setExam(mockExam);
    examEditorStore.getState().addQuestion(mockQuestion);
    
    // Clear history (for cleaner test)
    examEditorStore.setState({
      ...examEditorStore.getState(),
      history: { past: [], future: [] },
      isDirty: false,
    });
    
    // Update question
    examEditorStore.getState().updateQuestion(0, {
      text: 'Updated Question',
      pointValue: 2,
    });
    
    // Verify state
    expect(examEditorStore.getState().questions[0]).toMatchObject({
      ...mockQuestion,
      text: 'Updated Question',
      pointValue: 2,
    });
    expect(examEditorStore.getState().isDirty).toBe(true);
    expect(examEditorStore.getState().history.past).toHaveLength(1);
    
    // Verify selector
    const currentQuestion = useCurrentQuestion();
    expect(currentQuestion).toMatchObject({
      text: 'Updated Question',
      pointValue: 2,
    });
  });
  
  it('should remove question correctly', () => {
    // Set exam and add 2 questions
    examEditorStore.getState().setExam(mockExam);
    examEditorStore.getState().addQuestion({ ...mockQuestion, text: 'Question 1' });
    examEditorStore.getState().addQuestion({ ...mockQuestion, text: 'Question 2' });
    
    // Clear history (for cleaner test)
    examEditorStore.setState({
      ...examEditorStore.getState(),
      history: { past: [], future: [] },
      isDirty: false,
    });
    
    // Remove first question
    examEditorStore.getState().removeQuestion(0);
    
    // Verify state
    expect(examEditorStore.getState().questions).toHaveLength(1);
    expect(examEditorStore.getState().questions[0]).toMatchObject({
      text: 'Question 2',
      orderIndex: 0, // Index should be updated
    });
    expect(examEditorStore.getState().currentQuestionIndex).toBe(0);
    expect(examEditorStore.getState().isDirty).toBe(true);
    expect(examEditorStore.getState().history.past).toHaveLength(1);
  });
  
  it('should reorder questions correctly', () => {
    // Set exam and add 3 questions
    examEditorStore.getState().setExam(mockExam);
    examEditorStore.getState().addQuestion({ ...mockQuestion, text: 'Question 1' });
    examEditorStore.getState().addQuestion({ ...mockQuestion, text: 'Question 2' });
    examEditorStore.getState().addQuestion({ ...mockQuestion, text: 'Question 3' });
    
    // Clear history (for cleaner test)
    examEditorStore.setState({
      ...examEditorStore.getState(),
      history: { past: [], future: [] },
      isDirty: false,
    });
    
    // Reorder questions: move first question to the end
    examEditorStore.getState().reorderQuestions(0, 2);
    
    // Verify state
    expect(examEditorStore.getState().questions).toHaveLength(3);
    expect(examEditorStore.getState().questions[0].text).toBe('Question 2');
    expect(examEditorStore.getState().questions[1].text).toBe('Question 3');
    expect(examEditorStore.getState().questions[2].text).toBe('Question 1');
    
    // Order indices should be updated
    expect(examEditorStore.getState().questions[0].orderIndex).toBe(0);
    expect(examEditorStore.getState().questions[1].orderIndex).toBe(1);
    expect(examEditorStore.getState().questions[2].orderIndex).toBe(2);
    
    // Current index should follow the moved question
    expect(examEditorStore.getState().currentQuestionIndex).toBe(2);
    
    expect(examEditorStore.getState().isDirty).toBe(true);
    expect(examEditorStore.getState().history.past).toHaveLength(1);
  });
  
  it('should validate exam correctly', () => {
    // Set incomplete exam
    examEditorStore.getState().setExam({
      ...mockExam,
      title: '', // Invalid - title is required
      timeLimit: 0, // Invalid - time limit must be > 0
    });
    
    // Validate
    const isValid = examEditorStore.getState().validateExam();
    
    // Verify state
    expect(isValid).toBe(false);
    expect(examEditorStore.getState().validation.exam).toContain('Exam title is required');
    expect(examEditorStore.getState().validation.exam).toContain('Time limit must be greater than 0');
    expect(examEditorStore.getState().validation.questions).toContain('Exam must have at least one question');
    
    // Add invalid question
    examEditorStore.getState().addQuestion({
      ...mockQuestion,
      text: '', // Invalid - text is required
      options: [{ id: 'opt1', text: '', isCorrect: true }], // Invalid - not enough options
    });
    
    // Validate again
    const isValidAfterQuestion = examEditorStore.getState().validateExam();
    
    // Verify state
    expect(isValidAfterQuestion).toBe(false);
    expect(examEditorStore.getState().validation['question_0']).toContain('Question text is required');
    expect(examEditorStore.getState().validation['question_0']).toContain('multipleChoice requires at least 2 options');
  });
  
  it('should handle undo and redo correctly', () => {
    // Set exam and add question
    examEditorStore.getState().setExam(mockExam);
    examEditorStore.getState().addQuestion(mockQuestion);
    
    // Update question
    examEditorStore.getState().updateQuestion(0, { text: 'Updated Question' });
    
    // Verify state before undo
    expect(examEditorStore.getState().questions[0].text).toBe('Updated Question');
    expect(examEditorStore.getState().history.past).toHaveLength(2);
    expect(examEditorStore.getState().history.future).toHaveLength(0);
    
    // Check selectors
    expect(useCanUndo()).toBe(true);
    expect(useCanRedo()).toBe(false);
    
    // Undo
    examEditorStore.getState().undo();
    
    // Verify state after undo
    expect(examEditorStore.getState().questions[0].text).toBe('Test Question');
    expect(examEditorStore.getState().history.past).toHaveLength(1);
    expect(examEditorStore.getState().history.future).toHaveLength(1);
    
    // Check selectors
    expect(useCanUndo()).toBe(true);
    expect(useCanRedo()).toBe(true);
    
    // Redo
    examEditorStore.getState().redo();
    
    // Verify state after redo
    expect(examEditorStore.getState().questions[0].text).toBe('Updated Question');
    expect(examEditorStore.getState().history.past).toHaveLength(2);
    expect(examEditorStore.getState().history.future).toHaveLength(0);
  });
  
  it('should mark as saved correctly', () => {
    // Set exam
    examEditorStore.getState().setExam(mockExam);
    
    // Add question (makes isDirty true)
    examEditorStore.getState().addQuestion(mockQuestion);
    expect(examEditorStore.getState().isDirty).toBe(true);
    
    // Mark as saved
    examEditorStore.getState().markAsSaved();
    
    // Verify state
    expect(examEditorStore.getState().isDirty).toBe(false);
  });
  
  it('should reset state correctly', () => {
    // Set exam and add question
    examEditorStore.getState().setExam(mockExam);
    examEditorStore.getState().addQuestion(mockQuestion);
    
    // Reset
    examEditorStore.getState().resetState();
    
    // Verify state
    const state = examEditorStore.getState();
    expect(state.exam).toBeNull();
    expect(state.questions).toEqual([]);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.isDirty).toBe(false);
    expect(state.validation).toEqual({});
    expect(state.history).toEqual({ past: [], future: [] });
  });
});
