import { calculateExamScore, formatScore } from '../calculateExamScore';

describe('calculateExamScore', () => {
  test('should calculate score correctly with correct answers only', () => {
    const result = calculateExamScore(100, 60, 0, 40);
    
    expect(result.score).toBe(60);
    expect(result.totalMarks).toBe(100);
    expect(result.percentage).toBe(60);
    expect(result.correctMarks).toBe(60);
    expect(result.incorrectPenalty).toBe(0);
    expect(result.isPassing).toBe(true);
    expect(result.passingMarks).toBe(40);
  });
  
  test('should calculate score correctly with correct and incorrect answers', () => {
    const result = calculateExamScore(100, 60, 20, 20);
    
    expect(result.score).toBe(55);
    expect(result.totalMarks).toBe(100);
    expect(result.percentage).toBe(55);
    expect(result.correctMarks).toBe(60);
    expect(result.incorrectPenalty).toBe(-5);
    expect(result.isPassing).toBe(true);
    expect(result.passingMarks).toBe(40);
  });
  
  test('should calculate score correctly with all answers incorrect', () => {
    const result = calculateExamScore(100, 0, 100, 0);
    
    expect(result.score).toBe(-25);
    expect(result.totalMarks).toBe(100);
    expect(result.percentage).toBe(-25);
    expect(result.correctMarks).toBe(0);
    expect(result.incorrectPenalty).toBe(-25);
    expect(result.isPassing).toBe(false);
    expect(result.passingMarks).toBe(40);
  });
  
  test('should log warning if question counts do not add up', () => {
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = jest.fn();
    
    calculateExamScore(100, 60, 20, 10); // Total is 90, not 100
    
    expect(console.warn).toHaveBeenCalled();
    
    // Restore console.warn
    console.warn = originalWarn;
  });
  
  test('should use custom passing marks when provided', () => {
    const result = calculateExamScore(100, 50, 20, 30, 60);
    
    expect(result.score).toBe(45); // 50 - (20 * 0.25)
    expect(result.totalMarks).toBe(100);
    expect(result.percentage).toBe(45);
    expect(result.isPassing).toBe(false); // 45 < 60
    expect(result.passingMarks).toBe(60);
  });
});

describe('formatScore', () => {
  test('should format score correctly with default decimal places', () => {
    const formatted = formatScore(55, 100);
    
    expect(formatted.raw).toBe(55);
    expect(formatted.total).toBe(100);
    expect(formatted.percentage).toBe(55);
    expect(formatted.displayValue).toBe('55.0 out of 100');
    expect(formatted.displayPercentage).toBe('55.0%');
  });
  
  test('should format score with specified decimal places', () => {
    const formatted = formatScore(55.555, 100, 2);
    
    expect(formatted.displayValue).toBe('55.56 out of 100');
    expect(formatted.displayPercentage).toBe('55.56%');
  });
});
