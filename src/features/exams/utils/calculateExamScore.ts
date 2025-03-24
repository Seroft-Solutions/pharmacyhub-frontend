/**
 * Utility function to calculate exam scores based on the standard scoring system
 * 
 * Scoring System:
 * - Correct Answers: +1 mark each
 * - Incorrect Answers: -0.25 mark each
 * - Unanswered Questions: 0 marks
 * 
 * @param totalQuestions Total number of questions in the exam
 * @param correctAnswers Number of questions answered correctly
 * @param incorrectAnswers Number of questions answered incorrectly
 * @param unansweredQuestions Number of questions left unanswered
 * @returns An object containing score calculations
 */
export interface ExamScoreResult {
  score: number;               // Raw score (e.g., 55)
  totalMarks: number;          // Total possible marks (e.g., 100)
  percentage: number;          // Score as percentage (e.g., 55%)
  correctMarks: number;        // Marks from correct answers (e.g., 60)
  incorrectPenalty: number;    // Penalty from incorrect answers (e.g., -5)
}

export function calculateExamScore(
  totalQuestions: number,
  correctAnswers: number,
  incorrectAnswers: number,
  unansweredQuestions: number = 0
): ExamScoreResult {
  // Validation checks
  if (correctAnswers + incorrectAnswers + unansweredQuestions !== totalQuestions) {
    console.warn(
      'Inconsistent question counts:', 
      { totalQuestions, correctAnswers, incorrectAnswers, unansweredQuestions }
    );
  }

  // Calculate marks for correct answers (+1 each)
  const correctMarks = correctAnswers * 1;
  
  // Calculate penalty for incorrect answers (-0.25 each)
  const incorrectPenalty = incorrectAnswers * -0.25;
  
  // Calculate total score
  const score = correctMarks + incorrectPenalty;
  
  // Total possible marks equals the total number of questions
  const totalMarks = totalQuestions;
  
  // Calculate percentage
  const percentage = (score / totalMarks) * 100;
  
  return {
    score,
    totalMarks,
    percentage,
    correctMarks,
    incorrectPenalty,
  };
}

/**
 * Utility function to format a score for display
 * 
 * @param score Raw score value
 * @param totalMarks Total possible marks
 * @param decimalPlaces Number of decimal places to show in percentage (default: 1)
 * @returns Formatted score object with different display formats
 */
export function formatScore(
  score: number,
  totalMarks: number,
  decimalPlaces: number = 1
) {
  const percentage = (score / totalMarks) * 100;
  
  return {
    raw: score,
    total: totalMarks,
    percentage,
    displayValue: `${score.toFixed(decimalPlaces)} out of ${totalMarks}`,
    displayPercentage: `${percentage.toFixed(decimalPlaces)}%`,
  };
}
