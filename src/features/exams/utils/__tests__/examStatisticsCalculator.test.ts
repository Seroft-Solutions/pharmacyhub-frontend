/**
 * Tests for the examStatisticsCalculator utility
 */
import { calculateExamStatistics } from '../examStatisticsCalculator';
import { calculateExamScore } from '../calculateExamScore';
import { QuestionStatus } from '../../types/QuestionStatus';

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

describe('examStatisticsCalculator', () => {
  // Sample test questions
  const questions = [
    {
      id: 1,
      text: 'Question 1',
      options: [
        { id: 1, text: 'Option 1', isCorrect: true },
        { id: 2, text: 'Option 2', isCorrect: false },
      ],
    },
    {
      id: 2,
      text: 'Question 2',
      options: [
        { id: 3, text: 'Option 1', isCorrect: false },
        { id: 4, text: 'Option 2', isCorrect: true },
      ],
    },
    {
      id: 3,
      text: 'Question 3',
      options: [
        { id: 5, text: 'Option 1', isCorrect: false },
        { id: 6, text: 'Option 2', isCorrect: true },
      ],
    },
  ];

  test('should correctly calculate statistics with all questions correct', () => {
    const userAnswers = {
      1: { questionId: 1, answerId: '1', timestamp: '2023-01-01' },
      2: { questionId: 2, answerId: '4', timestamp: '2023-01-01' },
      3: { questionId: 3, answerId: '6', timestamp: '2023-01-01' },
    };

    const result = calculateExamStatistics(questions, userAnswers);

    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(3);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unanswered).toBe(0);
    
    // Check score calculation
    expect(result.score.score).toBe(3); // 3 correct * 1 point
    expect(result.score.correctMarks).toBe(3);
    expect(result.score.incorrectPenalty).toBe(0);
    expect(result.score.percentage).toBe(100);
  });

  test('should correctly calculate statistics with all questions incorrect', () => {
    const userAnswers = {
      1: { questionId: 1, answerId: '2', timestamp: '2023-01-01' },
      2: { questionId: 2, answerId: '3', timestamp: '2023-01-01' },
      3: { questionId: 3, answerId: '5', timestamp: '2023-01-01' },
    };

    const result = calculateExamStatistics(questions, userAnswers);

    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(3);
    expect(result.unanswered).toBe(0);
    
    // Check score calculation
    expect(result.score.score).toBe(0); // 0 + (-3 * 0.25) = -0.75, but minimum score is 0
    expect(result.score.correctMarks).toBe(0);
    expect(result.score.incorrectPenalty).toBe(-0.75); // 3 incorrect * -0.25 penalty
    expect(result.score.percentage).toBe(0);
  });

  test('should correctly calculate statistics with all questions unanswered', () => {
    const userAnswers = {}; // No answers

    const result = calculateExamStatistics(questions, userAnswers);

    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unanswered).toBe(3);
    
    // Check score calculation
    expect(result.score.score).toBe(0); // 0 correct + 0 penalties
    expect(result.score.correctMarks).toBe(0);
    expect(result.score.incorrectPenalty).toBe(0); // No incorrect answers, so no penalty
    expect(result.score.percentage).toBe(0);
  });

  test('should correctly calculate statistics with mixed question states', () => {
    const userAnswers = {
      1: { questionId: 1, answerId: '1', timestamp: '2023-01-01' }, // Correct
      2: { questionId: 2, answerId: '3', timestamp: '2023-01-01' }, // Incorrect
      // Question 3 is unanswered
    };

    const result = calculateExamStatistics(questions, userAnswers);

    expect(result.totalQuestions).toBe(3);
    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.unanswered).toBe(1);
    
    // Check score calculation
    expect(result.score.score).toBe(0.75); // 1 correct (1) + 1 incorrect (-0.25) = 0.75
    expect(result.score.correctMarks).toBe(1);
    expect(result.score.incorrectPenalty).toBe(-0.25); // 1 incorrect * -0.25 penalty
    expect(result.score.percentage).toBe(25); // 0.75/3 * 100 = 25%
  });

  test('should ensure consistency with calculateExamScore utility', () => {
    const userAnswers = {
      1: { questionId: 1, answerId: '1', timestamp: '2023-01-01' }, // Correct
      2: { questionId: 2, answerId: '3', timestamp: '2023-01-01' }, // Incorrect
      // Question 3 is unanswered
    };

    const result = calculateExamStatistics(questions, userAnswers);
    
    // Calculate directly with calculateExamScore
    const directScore = calculateExamScore(
      3, // totalQuestions
      1, // correctAnswers
      1, // incorrectAnswers
      1  // unansweredQuestions
    );
    
    // Both calculations should yield the same results
    expect(result.score.score).toBe(directScore.score);
    expect(result.score.totalMarks).toBe(directScore.totalMarks);
    expect(result.score.percentage).toBe(directScore.percentage);
    expect(result.score.correctMarks).toBe(directScore.correctMarks);
    expect(result.score.incorrectPenalty).toBe(directScore.incorrectPenalty);
  });

  test('should provide correct questionStatusMap', () => {
    const userAnswers = {
      1: { questionId: 1, answerId: '1', timestamp: '2023-01-01' }, // Correct
      2: { questionId: 2, answerId: '3', timestamp: '2023-01-01' }, // Incorrect
      // Question 3 is unanswered
    };

    const result = calculateExamStatistics(questions, userAnswers);
    const statusMap = result.questionStatusMap;
    
    expect(statusMap[1]).toBe(QuestionStatus.ANSWERED_CORRECT);
    expect(statusMap[2]).toBe(QuestionStatus.ANSWERED_INCORRECT);
    expect(statusMap[3]).toBe(QuestionStatus.UNANSWERED);
  });

  test('should report error if question counts are inconsistent', () => {
    // Create a broken implementation for testing validation
    const brokenQuestions = [...questions];
    // Add a duplicate ID that will cause counting issues
    brokenQuestions.push({
      id: 1, // Duplicate ID
      text: 'Duplicate Question',
      options: [
        { id: 7, text: 'Option 1', isCorrect: true },
        { id: 8, text: 'Option 2', isCorrect: false },
      ],
    });

    const userAnswers = {
      1: { questionId: 1, answerId: '1', timestamp: '2023-01-01' },
    };

    calculateExamStatistics(brokenQuestions, userAnswers);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
  });
});
