/**
 * Enum representing all possible states of a question in an exam
 * This ensures that each question is categorized into exactly one state,
 * preventing issues like double-counting in statistics.
 */
export enum QuestionStatus {
  UNANSWERED = 'UNANSWERED',       // User has not selected any option
  ANSWERED_CORRECT = 'CORRECT',    // User selected the correct option
  ANSWERED_INCORRECT = 'INCORRECT', // User selected an incorrect option
  ANSWERED_PENDING = 'PENDING'      // User selected an option but result not yet known (e.g., during the exam)
}

/**
 * Determines the status of a question based on user answers and correct answers
 * 
 * @param questionId The ID of the question
 * @param userAnswers Map of user answers by question ID
 * @param correctAnswerMap Map of correct answer IDs by question ID
 * @returns The status of the question
 */
export function getQuestionStatus(
  questionId: number, 
  userAnswers: Record<number, any>,
  correctAnswerMap: Record<number, string | null>
): QuestionStatus {
  // If no user answer for this question, it's unanswered
  if (!userAnswers[questionId] || !userAnswers[questionId].selectedOption) {
    return QuestionStatus.UNANSWERED;
  }
  
  // If we don't know the correct answer yet, it's pending
  if (correctAnswerMap[questionId] === null || correctAnswerMap[questionId] === undefined) {
    return QuestionStatus.ANSWERED_PENDING;
  }
  
  // Otherwise check if the answer is correct
  const userAnswer = userAnswers[questionId];
  const correctAnswer = correctAnswerMap[questionId];
  
  // Handle different formats of answers (selectedOption or answerId)
  const userSelection = userAnswer.selectedOption || userAnswer.answerId;
  
  return userSelection == correctAnswer
    ? QuestionStatus.ANSWERED_CORRECT
    : QuestionStatus.ANSWERED_INCORRECT;
}

/**
 * Creates a map of question statuses by question ID
 * 
 * @param questions Array of questions
 * @param userAnswers Map of user answers by question ID
 * @returns Map of question statuses by question ID
 */
export function createQuestionStatusMap(
  questions: any[],
  userAnswers: Record<number, any>
): Record<number, QuestionStatus> {
  // Create a map of correct answers by question ID
  const correctAnswerMap: Record<number, string | null> = {};
  
  for (const question of questions) {
    let correctAnswerId = null;
    
    // Handle different formats of correct answer data
    if (question.correctOption) {
      correctAnswerId = question.correctOption?.toString();
    } else if (typeof question.correctAnswer === 'string') {
      // Find the option with matching label
      const correctOption = question.options?.find(
        (opt: any) => opt.label?.toUpperCase() === question.correctAnswer?.toUpperCase()
      );
      correctAnswerId = correctOption?.id?.toString() || null;
    } else {
      // Find the option with isCorrect property
      const correctOption = question.options?.find((opt: any) => opt.isCorrect === true);
      correctAnswerId = correctOption?.id?.toString() || null;
    }
    
    correctAnswerMap[question.id] = correctAnswerId;
  }
  
  // Create the status map
  return Object.fromEntries(
    questions.map(q => [
      q.id, 
      getQuestionStatus(q.id, userAnswers, correctAnswerMap)
    ])
  );
}
