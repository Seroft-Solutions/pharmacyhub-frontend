import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';

const API_URL = '/api/exams';

// Mock data for development - this will be replaced with real API calls
const mockExams: Exam[] = [
  {
    id: 1,
    title: 'Basic Pharmacology Exam',
    description: 'Test your knowledge of basic pharmacology concepts',
    duration: 30, // 30 minutes
    totalMarks: 100,
    passingMarks: 60,
    status: ExamStatus.PUBLISHED,
    questions: [
      {
        id: 1,
        text: 'Which of the following is NOT a phase of pharmacokinetics?',
        options: [
          { id: 'A', text: 'Absorption', isCorrect: false },
          { id: 'B', text: 'Distribution', isCorrect: false },
          { id: 'C', text: 'Metabolism', isCorrect: false },
          { id: 'D', text: 'Excretion', isCorrect: false },
          { id: 'E', text: 'Receptor binding', isCorrect: true }
        ],
        explanation: 'Receptor binding is a part of pharmacodynamics, not pharmacokinetics. Pharmacokinetics includes Absorption, Distribution, Metabolism, and Excretion (ADME).',
        points: 10
      },
      {
        id: 2,
        text: 'Which of the following best describes first-pass metabolism?',
        options: [
          { id: 'A', text: 'Drug metabolism in the stomach', isCorrect: false },
          { id: 'B', text: 'Drug metabolism in the liver after absorption from the GI tract', isCorrect: true },
          { id: 'C', text: 'Drug metabolism in the kidneys before excretion', isCorrect: false },
          { id: 'D', text: 'Drug metabolism in the bloodstream', isCorrect: false },
          { id: 'E', text: 'Drug metabolism in the brain', isCorrect: false }
        ],
        explanation: 'First-pass metabolism refers to the metabolic degradation of a drug in the liver after absorption from the GI tract but before it reaches the systemic circulation.',
        points: 10
      },
      {
        id: 3,
        text: 'Which of the following is an example of a competitive receptor antagonist?',
        options: [
          { id: 'A', text: 'Propranolol', isCorrect: true },
          { id: 'B', text: 'Phenoxybenzamine', isCorrect: false },
          { id: 'C', text: 'Insulin', isCorrect: false },
          { id: 'D', text: 'Penicillin', isCorrect: false },
          { id: 'E', text: 'Aspirin', isCorrect: false }
        ],
        explanation: 'Propranolol is a beta-blocker that competitively binds to beta-adrenergic receptors, preventing the binding of endogenous catecholamines like epinephrine.',
        points: 10
      },
      {
        id: 4,
        text: 'Which of the following drug interactions is an example of pharmacokinetic interaction?',
        options: [
          { id: 'A', text: 'Additive CNS depression with alcohol and benzodiazepines', isCorrect: false },
          { id: 'B', text: 'Decreased effectiveness of oral contraceptives when taken with rifampin', isCorrect: true },
          { id: 'C', text: 'Increased risk of serotonin syndrome when SSRIs are combined with MAOIs', isCorrect: false },
          { id: 'D', text: 'Antagonism of beta-agonist effects by beta-blockers', isCorrect: false },
          { id: 'E', text: 'Potentiation of warfarin by vitamin K', isCorrect: false }
        ],
        explanation: 'Rifampin induces liver enzymes that metabolize oral contraceptives, decreasing their concentration in the blood. This is a pharmacokinetic interaction affecting drug metabolism.',
        points: 10
      },
      {
        id: 5,
        text: 'Which of the following is true regarding bioavailability?',
        options: [
          { id: 'A', text: 'It is always 100% for orally administered drugs', isCorrect: false },
          { id: 'B', text: 'It is the fraction of administered drug that reaches systemic circulation', isCorrect: true },
          { id: 'C', text: 'It is independent of the route of administration', isCorrect: false },
          { id: 'D', text: 'It increases with first-pass metabolism', isCorrect: false },
          { id: 'E', text: 'It can only be measured in vitro', isCorrect: false }
        ],
        explanation: 'Bioavailability refers to the fraction of an administered dose of a drug that reaches the systemic circulation. It is affected by absorption and first-pass metabolism.',
        points: 10
      },
      {
        id: 6,
        text: 'Which cytochrome P450 enzyme is responsible for metabolizing the majority of drugs?',
        options: [
          { id: 'A', text: 'CYP1A2', isCorrect: false },
          { id: 'B', text: 'CYP2C9', isCorrect: false },
          { id: 'C', text: 'CYP2D6', isCorrect: false },
          { id: 'D', text: 'CYP3A4', isCorrect: true },
          { id: 'E', text: 'CYP2E1', isCorrect: false }
        ],
        explanation: 'CYP3A4 is the most abundant cytochrome P450 enzyme in the liver and metabolizes approximately 50% of clinically used drugs.',
        points: 10
      },
      {
        id: 7,
        text: 'Which of the following is an example of a prodrug?',
        options: [
          { id: 'A', text: 'Warfarin', isCorrect: false },
          { id: 'B', text: 'Enalapril', isCorrect: true },
          { id: 'C', text: 'Propranolol', isCorrect: false },
          { id: 'D', text: 'Furosemide', isCorrect: false },
          { id: 'E', text: 'Digoxin', isCorrect: false }
        ],
        explanation: 'Enalapril is a prodrug that is converted to its active form, enalaprilat, in the liver. This conversion is necessary for its ACE inhibitory activity.',
        points: 10
      },
      {
        id: 8,
        text: 'Which of the following receptor types uses G-proteins as a second messenger system?',
        options: [
          { id: 'A', text: 'Ligand-gated ion channels', isCorrect: false },
          { id: 'B', text: 'Receptor tyrosine kinases', isCorrect: false },
          { id: 'C', text: 'Intracellular steroid receptors', isCorrect: false },
          { id: 'D', text: 'G-protein coupled receptors', isCorrect: true },
          { id: 'E', text: 'Voltage-gated ion channels', isCorrect: false }
        ],
        explanation: 'G-protein coupled receptors (GPCRs) use G-proteins as transducers to activate or inhibit intracellular enzymes or ion channels, leading to various cellular responses.',
        points: 10
      },
      {
        id: 9,
        text: 'Which of the following statements about drug half-life is correct?',
        options: [
          { id: 'A', text: 'Half-life is the time required for a drug to be completely eliminated from the body', isCorrect: false },
          { id: 'B', text: 'A drug is completely eliminated after 4 half-lives', isCorrect: false },
          { id: 'C', text: 'Half-life is independent of clearance and volume of distribution', isCorrect: false },
          { id: 'D', text: 'Half-life is the time required for the drug concentration to decrease by 50%', isCorrect: true },
          { id: 'E', text: 'Half-life is always longer for lipophilic drugs compared to hydrophilic drugs', isCorrect: false }
        ],
        explanation: 'Half-life (t1/2) is the time required for the drug concentration in plasma to decrease by 50%. It is related to both clearance and volume of distribution.',
        points: 10
      },
      {
        id: 10,
        text: 'Which of the following best describes synergism in drug interactions?',
        options: [
          { id: 'A', text: 'The effect of two drugs is less than the sum of their individual effects', isCorrect: false },
          { id: 'B', text: 'The effect of two drugs is equal to the sum of their individual effects', isCorrect: false },
          { id: 'C', text: 'The effect of two drugs is greater than the sum of their individual effects', isCorrect: true },
          { id: 'D', text: 'One drug completely negates the effect of another drug', isCorrect: false },
          { id: 'E', text: 'Two drugs compete for the same receptor', isCorrect: false }
        ],
        explanation: 'Synergism occurs when the combined effect of two drugs is greater than the sum of their individual effects. This can be beneficial in therapy but may also increase the risk of adverse effects.',
        points: 10
      }
    ]
  }
];

// Use browser-friendly fetch instead of axios to avoid Node.js dependencies
export const examService = {
  // Get all exams
  async getAllExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching all exams');
      
      // In production, use:
      // const response = await fetch(API_URL);
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      return Promise.resolve(mockExams);
    } catch (error) {
      logger.error('Failed to fetch all exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get published exams only
  async getPublishedExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching published exams');
      
      // In production, use:
      // const response = await fetch(`${API_URL}/published`);
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      return Promise.resolve(mockExams.filter(exam => exam.status === ExamStatus.PUBLISHED));
    } catch (error) {
      logger.error('Failed to fetch published exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exam by ID
  async getExamById(id: number): Promise<Exam> {
    try {
      logger.info('Fetching exam by ID', { examId: id });
      
      // In production, use:
      // const response = await fetch(`${API_URL}/${id}`);
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      const exam = mockExams.find(e => e.id === id);
      if (!exam) {
        throw new Error(`Exam with ID ${id} not found`);
      }
      return Promise.resolve(exam);
    } catch (error) {
      logger.error(`Failed to fetch exam with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Start an exam attempt
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      logger.info('Starting exam attempt', { examId });
      
      // In production, use:
      // const response = await fetch(`${API_URL}/${examId}/start`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      const exam = mockExams.find(e => e.id === examId);
      if (!exam) {
        throw new Error(`Exam with ID ${examId} not found`);
      }
      
      const attempt: ExamAttempt = {
        id: Math.floor(Math.random() * 1000),
        examId,
        userId: 'current-user', // In a real app, this would be the actual user ID
        startTime: new Date().toISOString(),
        answers: [],
        status: 'IN_PROGRESS'
      };
      
      return Promise.resolve(attempt);
    } catch (error) {
      logger.error(`Failed to start exam with ID ${examId}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Submit an exam attempt
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    try {
      logger.info('Submitting exam attempt', { attemptId, answersCount: answers.length });
      
      // In production, use:
      // const response = await fetch(`${API_URL}/attempts/${attemptId}/submit`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers })
      // });
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      // Find the exam based on the first answer's question ID
      const firstAnswer = answers[0];
      if (!firstAnswer) {
        throw new Error('No answers provided for submission');
      }
      
      // Find the exam that contains this question
      let targetExam: Exam | undefined;
      let questionResults: ExamResult['questionResults'] = [];
      
      mockExams.forEach(exam => {
        if (exam.questions?.some(q => q.id === firstAnswer.questionId)) {
          targetExam = exam;
          
          // Calculate results for each question
          questionResults = answers.map(answer => {
            const question = exam.questions?.find(q => q.id === answer.questionId);
            if (!question) {
              throw new Error(`Question with ID ${answer.questionId} not found`);
            }
            
            const correctOption = question.options.find(o => o.isCorrect);
            if (!correctOption) {
              throw new Error(`No correct option found for question ${answer.questionId}`);
            }
            
            const isCorrect = answer.selectedOptionId === correctOption.id;
            
            return {
              questionId: question.id,
              questionText: question.text,
              userAnswerId: answer.selectedOptionId,
              correctAnswerId: correctOption.id,
              isCorrect,
              explanation: question.explanation,
              points: question.points,
              earnedPoints: isCorrect ? question.points : 0
            };
          });
        }
      });
      
      if (!targetExam) {
        throw new Error('Could not determine the exam for this attempt');
      }
      
      // Calculate the total score
      const totalEarnedPoints = questionResults.reduce((sum, result) => sum + result.earnedPoints, 0);
      const score = (totalEarnedPoints / targetExam.totalMarks) * 100;
      
      const result: ExamResult = {
        examId: targetExam.id,
        examTitle: targetExam.title,
        score,
        totalMarks: targetExam.totalMarks,
        passingMarks: targetExam.passingMarks,
        isPassed: score >= targetExam.passingMarks,
        timeSpent: answers.reduce((total, a) => total + a.timeSpent, 0),
        questionResults
      };
      
      return Promise.resolve(result);
    } catch (error) {
      logger.error(`Failed to submit exam attempt`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exams by status
  async getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
    try {
      logger.info('Fetching exams by status', { status });
      
      // In production, use:
      // const response = await fetch(`${API_URL}/status/${status}`);
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // return await response.json();
      
      // For development with mock data:
      return Promise.resolve(mockExams.filter(exam => exam.status === status));
    } catch (error) {
      logger.error(`Failed to fetch exams with status ${status}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
