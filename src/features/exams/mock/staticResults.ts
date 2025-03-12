import { ExamResult, QuestionResult } from '../model/standardTypes';

/**
 * Get a static exam result for development and testing
 */
export function getStaticExamResult(): ExamResult {
  return {
    attemptId: 123,
    examId: 456,
    examTitle: "Pharmacology Basics 2024",
    score: 75,
    totalMarks: 100,
    passingMarks: 60,
    isPassed: true,
    timeSpent: 3600, // 1 hour in seconds
    totalQuestions: 50,
    correctAnswers: 35,
    incorrectAnswers: 10,
    unanswered: 5,
    completedAt: new Date().toISOString(),
    questionResults: getStaticQuestionResults()
  };
}

/**
 * Get static question results for development and testing
 */
function getStaticQuestionResults(): QuestionResult[] {
  return [
    {
      questionId: 1,
      questionText: "Which of the following is a beta-blocker?",
      userAnswerId: "A",
      correctAnswerId: "A",
      isCorrect: true,
      explanation: "Propranolol is a non-selective beta blocker used in the treatment of hypertension and other cardiovascular conditions.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 2,
      questionText: "What is the primary action of ACE inhibitors?",
      userAnswerId: "A",
      correctAnswerId: "B",
      isCorrect: false,
      explanation: "ACE inhibitors prevent the conversion of angiotensin I to angiotensin II, thereby reducing blood pressure.",
      points: 2,
      earnedPoints: 0
    },
    {
      questionId: 3,
      questionText: "Which drug class is used as a first-line treatment for type 2 diabetes?",
      userAnswerId: "C",
      correctAnswerId: "C",
      isCorrect: true,
      explanation: "Metformin is the first-line medication for the treatment of type 2 diabetes, particularly in overweight and obese patients.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 4,
      questionText: "Which of the following is NOT a common side effect of NSAIDs?",
      userAnswerId: "D",
      correctAnswerId: "D",
      isCorrect: true,
      explanation: "Hyperglycemia is not a common side effect of NSAIDs. Common side effects include gastrointestinal irritation, renal impairment, and increased bleeding risk.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 5,
      questionText: "Which benzodiazepine has the shortest half-life?",
      userAnswerId: null,
      correctAnswerId: "B",
      isCorrect: false,
      explanation: "Midazolam has the shortest half-life among the common benzodiazepines, making it useful for procedures requiring short-term sedation.",
      points: 2,
      earnedPoints: 0
    },
    {
      questionId: 6,
      questionText: "Which statement regarding lithium is correct?",
      userAnswerId: "A",
      correctAnswerId: "C",
      isCorrect: false,
      explanation: "Lithium has a narrow therapeutic index, requiring regular monitoring of serum levels to prevent toxicity while maintaining efficacy.",
      points: 2,
      earnedPoints: 0
    },
    {
      questionId: 7,
      questionText: "Which antidepressant class has the least cardiotoxicity in overdose?",
      userAnswerId: "B",
      correctAnswerId: "B",
      isCorrect: true,
      explanation: "SSRIs have a better safety profile in overdose compared to tricyclic antidepressants, with significantly less cardiotoxicity.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 8,
      questionText: "Which class of antibiotics is associated with tendon rupture?",
      userAnswerId: "A",
      correctAnswerId: "A",
      isCorrect: true,
      explanation: "Fluoroquinolones (e.g., ciprofloxacin, levofloxacin) have been associated with tendonitis and tendon rupture, particularly in older adults and those on corticosteroids.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 9,
      questionText: "Which of the following statins is most potent on a milligram-per-milligram basis?",
      userAnswerId: "C",
      correctAnswerId: "C",
      isCorrect: true,
      explanation: "Rosuvastatin is the most potent statin, requiring lower doses to achieve similar LDL reductions compared to other statins.",
      points: 2,
      earnedPoints: 2
    },
    {
      questionId: 10,
      questionText: "Which anticoagulant cannot be reversed by vitamin K administration?",
      userAnswerId: "B",
      correctAnswerId: "D",
      isCorrect: false,
      explanation: "Direct oral anticoagulants (DOACs) like dabigatran cannot be reversed by vitamin K. Specific reversal agents like idarucizumab (for dabigatran) are used instead.",
      points: 2,
      earnedPoints: 0
    }
  ];
}