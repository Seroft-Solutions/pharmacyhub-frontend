import { MCQPaper, ExamSession, UserAnswer } from '../model/types';
import { logger } from '@/shared/lib/logger';

const BASE_URL = '/api/exam';

export const examService = {
    async listPapers(type: 'model' | 'past'): Promise<MCQPaper[]> {
        const startTime = Date.now();
        try {
            logger.info('Fetching exam papers', {
                type,
                endpoint: `${BASE_URL}/papers`
            });

            const response = await fetch(`${BASE_URL}/papers?type=${type}`);
            const papers = await response.json();

            logger.info('Successfully fetched exam papers', {
                type,
                count: papers.length,
                responseTime: `${Date.now() - startTime}ms`
            });

            return papers;
        } catch (error) {
            logger.error('Failed to fetch exam papers', {
                type,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async getPaper(id: string): Promise<MCQPaper> {
        const startTime = Date.now();
        try {
            logger.info('Fetching exam paper', {
                paperId: id,
                endpoint: `${BASE_URL}/papers/${id}`
            });

            const response = await fetch(`${BASE_URL}/papers/${id}`);
            const paper = await response.json();

            logger.info('Successfully fetched exam paper', {
                paperId: id,
                title: paper.title,
                responseTime: `${Date.now() - startTime}ms`
            });

            return paper;
        } catch (error) {
            logger.error('Failed to fetch exam paper', {
                paperId: id,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async startExam(paperId: string): Promise<ExamSession> {
        const startTime = Date.now();
        try {
            logger.info('Starting exam session', {
                paperId,
                endpoint: `${BASE_URL}/sessions`
            });

            const response = await fetch(`${BASE_URL}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paperId }),
            });
            const session = await response.json();

            logger.info('Successfully started exam session', {
                paperId,
                sessionId: session.id,
                responseTime: `${Date.now() - startTime}ms`
            });

            return session;
        } catch (error) {
            logger.error('Failed to start exam session', {
                paperId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async submitAnswer(
        sessionId: string, 
        answer: UserAnswer
    ): Promise<{ isCorrect: boolean; explanation: string }> {
        const startTime = Date.now();
        try {
            logger.info('Submitting answer', {
                sessionId,
                questionId: answer.questionId,
                endpoint: `${BASE_URL}/sessions/${sessionId}/answers`
            });

            const response = await fetch(
                `${BASE_URL}/sessions/${sessionId}/answers`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(answer),
                }
            );
            const result = await response.json();

            logger.info('Successfully submitted answer', {
                sessionId,
                questionId: answer.questionId,
                isCorrect: result.isCorrect,
                responseTime: `${Date.now() - startTime}ms`
            });

            return result;
        } catch (error) {
            logger.error('Failed to submit answer', {
                sessionId,
                questionId: answer.questionId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },

    async completeExam(sessionId: string): Promise<ExamSession> {
        const startTime = Date.now();
        try {
            logger.info('Completing exam session', {
                sessionId,
                endpoint: `${BASE_URL}/sessions/${sessionId}/complete`
            });

            const response = await fetch(
                `${BASE_URL}/sessions/${sessionId}/complete`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const session = await response.json();

            logger.info('Successfully completed exam session', {
                sessionId,
                score: session.score,
                totalQuestions: session.totalQuestions,
                responseTime: `${Date.now() - startTime}ms`
            });

            return session;
        } catch (error) {
            logger.error('Failed to complete exam session', {
                sessionId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                responseTime: `${Date.now() - startTime}ms`
            });
            throw error;
        }
    },
};