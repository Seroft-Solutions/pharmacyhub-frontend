import { MCQPaper, ExamSession, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import env from '@/config/env';

const BASE_URL = `${env.NEXT_PUBLIC_APP_URL}/api/exams`;

// Helper function to ensure valid URL construction
const buildUrl = (path: string, params?: Record<string, string>) => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    return url.toString();
};

// Mock data for development - this would be replaced with actual API calls
const mockMCQData: { [id: string]: MCQPaper } = {
    'mcq-001': {
        id: 'mcq-001',
        title: 'Basic Pharmacology MCQ Exam',
        description: 'Test your understanding of basic pharmacology principles',
        source: 'model',
        difficulty: 'medium',
        topics_covered: ['Pharmacokinetics', 'Pharmacodynamics', 'Drug interactions'],
        total_questions: 10,
        time_limit: 20, // minutes
        is_premium: false,
        content: {
            id: 'mcq-001-content',
            title: 'Basic Pharmacology MCQ Exam',
            description: 'Test your understanding of basic pharmacology principles',
            instructions: 'Select the best answer for each question. You will have 20 minutes to complete this exam.',
            time_limit: 20,
            total_questions: 10,
            total_points: 100,
            passing_criteria: {
                minimum_questions: 8,
                minimum_score: 70
            },
            sections: [
                {
                    id: 'section-001',
                    title: 'Pharmacology Fundamentals',
                    description: 'Questions on basic pharmacology concepts',
                    questions: [
                        {
                            id: 'q1',
                            questionNumber: 1,
                            question: 'Which of the following is NOT a phase of pharmacokinetics?',
                            options: {
                                'A': 'Absorption',
                                'B': 'Distribution',
                                'C': 'Metabolism',
                                'D': 'Excretion',
                                'E': 'Receptor binding'
                            },
                            answer: 'E',
                            explanation: 'Receptor binding is a part of pharmacodynamics, not pharmacokinetics. Pharmacokinetics includes Absorption, Distribution, Metabolism, and Excretion (ADME).',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'easy',
                                points: 10
                            }
                        },
                        {
                            id: 'q2',
                            questionNumber: 2,
                            question: 'Which of the following best describes first-pass metabolism?',
                            options: {
                                'A': 'Drug metabolism in the stomach',
                                'B': 'Drug metabolism in the liver after absorption from the GI tract',
                                'C': 'Drug metabolism in the kidneys before excretion',
                                'D': 'Drug metabolism in the bloodstream',
                                'E': 'Drug metabolism in the brain'
                            },
                            answer: 'B',
                            explanation: 'First-pass metabolism refers to the metabolic degradation of a drug in the liver after absorption from the GI tract but before it reaches the systemic circulation.',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q3',
                            questionNumber: 3,
                            question: 'Which of the following is an example of a competitive receptor antagonist?',
                            options: {
                                'A': 'Propranolol',
                                'B': 'Phenoxybenzamine',
                                'C': 'Insulin',
                                'D': 'Penicillin',
                                'E': 'Aspirin'
                            },
                            answer: 'A',
                            explanation: 'Propranolol is a beta-blocker that competitively binds to beta-adrenergic receptors, preventing the binding of endogenous catecholamines like epinephrine.',
                            metadata: {
                                topic: 'Pharmacodynamics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q4',
                            questionNumber: 4,
                            question: 'Which of the following drug interactions is an example of pharmacokinetic interaction?',
                            options: {
                                'A': 'Additive CNS depression with alcohol and benzodiazepines',
                                'B': 'Decreased effectiveness of oral contraceptives when taken with rifampin',
                                'C': 'Increased risk of serotonin syndrome when SSRIs are combined with MAOIs',
                                'D': 'Antagonism of beta-agonist effects by beta-blockers',
                                'E': 'Potentiation of warfarin by vitamin K'
                            },
                            answer: 'B',
                            explanation: 'Rifampin induces liver enzymes that metabolize oral contraceptives, decreasing their concentration in the blood. This is a pharmacokinetic interaction affecting drug metabolism.',
                            metadata: {
                                topic: 'Drug interactions',
                                difficulty: 'hard',
                                points: 10
                            }
                        },
                        {
                            id: 'q5',
                            questionNumber: 5,
                            question: 'Which of the following is true regarding bioavailability?',
                            options: {
                                'A': 'It is always 100% for orally administered drugs',
                                'B': 'It is the fraction of administered drug that reaches systemic circulation',
                                'C': 'It is independent of the route of administration',
                                'D': 'It increases with first-pass metabolism',
                                'E': 'It can only be measured in vitro'
                            },
                            answer: 'B',
                            explanation: 'Bioavailability refers to the fraction of an administered dose of a drug that reaches the systemic circulation. It is affected by absorption and first-pass metabolism.',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q6',
                            questionNumber: 6,
                            question: 'Which cytochrome P450 enzyme is responsible for metabolizing the majority of drugs?',
                            options: {
                                'A': 'CYP1A2',
                                'B': 'CYP2C9',
                                'C': 'CYP2D6',
                                'D': 'CYP3A4',
                                'E': 'CYP2E1'
                            },
                            answer: 'D',
                            explanation: 'CYP3A4 is the most abundant cytochrome P450 enzyme in the liver and metabolizes approximately 50% of clinically used drugs.',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q7',
                            questionNumber: 7,
                            question: 'Which of the following is an example of a prodrug?',
                            options: {
                                'A': 'Warfarin',
                                'B': 'Enalapril',
                                'C': 'Propranolol',
                                'D': 'Furosemide',
                                'E': 'Digoxin'
                            },
                            answer: 'B',
                            explanation: 'Enalapril is a prodrug that is converted to its active form, enalaprilat, in the liver. This conversion is necessary for its ACE inhibitory activity.',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q8',
                            questionNumber: 8,
                            question: 'Which of the following receptor types uses G-proteins as a second messenger system?',
                            options: {
                                'A': 'Ligand-gated ion channels',
                                'B': 'Receptor tyrosine kinases',
                                'C': 'Intracellular steroid receptors',
                                'D': 'G-protein coupled receptors',
                                'E': 'Voltage-gated ion channels'
                            },
                            answer: 'D',
                            explanation: 'G-protein coupled receptors (GPCRs) use G-proteins as transducers to activate or inhibit intracellular enzymes or ion channels, leading to various cellular responses.',
                            metadata: {
                                topic: 'Pharmacodynamics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q9',
                            questionNumber: 9,
                            question: 'Which of the following statements about drug half-life is correct?',
                            options: {
                                'A': 'Half-life is the time required for a drug to be completely eliminated from the body',
                                'B': 'A drug is completely eliminated after 4 half-lives',
                                'C': 'Half-life is independent of clearance and volume of distribution',
                                'D': 'Half-life is the time required for the drug concentration to decrease by 50%',
                                'E': 'Half-life is always longer for lipophilic drugs compared to hydrophilic drugs'
                            },
                            answer: 'D',
                            explanation: 'Half-life (t1/2) is the time required for the drug concentration in plasma to decrease by 50%. It is related to both clearance and volume of distribution.',
                            metadata: {
                                topic: 'Pharmacokinetics',
                                difficulty: 'medium',
                                points: 10
                            }
                        },
                        {
                            id: 'q10',
                            questionNumber: 10,
                            question: 'Which of the following best describes synergism in drug interactions?',
                            options: {
                                'A': 'The effect of two drugs is less than the sum of their individual effects',
                                'B': 'The effect of two drugs is equal to the sum of their individual effects',
                                'C': 'The effect of two drugs is greater than the sum of their individual effects',
                                'D': 'One drug completely negates the effect of another drug',
                                'E': 'Two drugs compete for the same receptor'
                            },
                            answer: 'C',
                            explanation: 'Synergism occurs when the combined effect of two drugs is greater than the sum of their individual effects. This can be beneficial in therapy but may also increase the risk of adverse effects.',
                            metadata: {
                                topic: 'Drug interactions',
                                difficulty: 'easy',
                                points: 10
                            }
                        }
                    ]
                }
            ]
        }
    }
};

export const mcqService = {
    async listPublishedExams(): Promise<MCQPaper[]> {
        const startTime = Date.now();
        try {
            logger.info('Fetching published MCQ exams', {
                endpoint: `${BASE_URL}/published`
            });

            // In a real implementation, this would be an API call
            // const url = buildUrl('/published');
            // const response = await fetch(url);
            // 
            // if (!response.ok) {
            //    throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // 
            // const exams = await response.json();

            // For now, simulate the API response with mock data
            const exams = Object.values(mockMCQData);

            logger.info('Successfully fetched published MCQ exams', {
                count: exams.length,
                responseTime: `${Date.now() - startTime}ms`
            });

            return exams;
        } catch (error) {
            logger.error('Failed to fetch published MCQ exams', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async getExamById(id: string): Promise<MCQPaper> {
        const startTime = Date.now();
        try {
            logger.info('Fetching MCQ exam by ID', {
                examId: id,
                endpoint: `${BASE_URL}/${id}`
            });

            // In a real implementation, this would be an API call
            // const url = buildUrl(`/${id}`);
            // const response = await fetch(url);
            // 
            // if (!response.ok) {
            //    throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // 
            // const exam = await response.json();

            // For now, simulate the API response with mock data
            const exam = mockMCQData[id];
            if (!exam) {
                throw new Error(`Exam with ID ${id} not found`);
            }

            logger.info('Successfully fetched MCQ exam', {
                examId: id,
                title: exam.title,
                responseTime: `${Date.now() - startTime}ms`
            });

            return exam;
        } catch (error) {
            logger.error('Failed to fetch MCQ exam', {
                examId: id,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async startExamSession(examId: string): Promise<ExamSession> {
        const startTime = Date.now();
        try {
            logger.info('Starting MCQ exam session', {
                examId,
                endpoint: `${BASE_URL}/${examId}/start`
            });

            // In a real implementation, this would be an API call
            // const url = buildUrl(`/${examId}/start`);
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            // 
            // if (!response.ok) {
            //    throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // 
            // const session = await response.json();

            // For now, simulate the API response with mock data
            const exam = mockMCQData[examId];
            if (!exam) {
                throw new Error(`Exam with ID ${examId} not found`);
            }

            const session: ExamSession = {
                id: `session-${Date.now()}`,
                paper_id: examId,
                user_id: 'current-user', // In a real implementation, this would be the actual user ID
                start_time: new Date(),
                status: 'in_progress',
                answers: [],
                total_questions: exam.total_questions,
                time_spent: 0
            };

            logger.info('Successfully started MCQ exam session', {
                examId,
                sessionId: session.id,
                responseTime: `${Date.now() - startTime}ms`
            });

            return session;
        } catch (error) {
            logger.error('Failed to start MCQ exam session', {
                examId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async submitExamSession(sessionId: string, answers: UserAnswer[]): Promise<ExamResult> {
        const startTime = Date.now();
        try {
            logger.info('Submitting MCQ exam session', {
                sessionId,
                answersCount: answers.length,
                endpoint: `${BASE_URL}/sessions/${sessionId}/submit`
            });

            // In a real implementation, this would be an API call
            // const url = buildUrl(`/sessions/${sessionId}/submit`);
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ answers })
            // });
            // 
            // if (!response.ok) {
            //    throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // 
            // const result = await response.json();

            // For now, simulate the API response with mock data
            // In a real implementation, the server would calculate the result
            
            // Find the exam paper to calculate results
            const paperId = answers[0]?.question_id.split('-')[0] + '-001'; // This is a hack for demo
            const paper = mockMCQData[paperId];
            
            if (!paper) {
                throw new Error('Could not determine exam paper for calculating results');
            }
            
            // Calculate score by checking answers against correct answers
            const questions = paper.content.sections.flatMap(s => s.questions);
            let correctCount = 0;
            const details = answers.map(answer => {
                const question = questions.find(q => q.id === answer.question_id);
                const isCorrect = question?.answer === answer.selected_option;
                
                if (isCorrect) correctCount++;
                
                return {
                    questionId: answer.question_id,
                    userAnswer: answer.selected_option,
                    correctAnswer: question?.answer || '',
                    isCorrect: isCorrect,
                    explanation: question?.explanation || ''
                };
            });
            
            const score = Math.round((correctCount / paper.total_questions) * 100);
            const passingScore = paper.content.passing_criteria.minimum_score;
            
            const result: ExamResult = {
                examId: paperId,
                score,
                totalQuestions: paper.total_questions,
                totalPoints: paper.content.total_points,
                passingScore,
                correctAnswers: correctCount,
                incorrectAnswers: answers.length - correctCount,
                unanswered: paper.total_questions - answers.length,
                timeSpent: answers.reduce((total, a) => total + a.time_spent, 0),
                isPassed: score >= passingScore,
                details
            };

            logger.info('Successfully submitted MCQ exam session', {
                sessionId,
                score,
                totalQuestions: paper.total_questions,
                isPassed: result.isPassed,
                responseTime: `${Date.now() - startTime}ms`
            });

            return result;
        } catch (error) {
            logger.error('Failed to submit MCQ exam session', {
                sessionId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    }
};
