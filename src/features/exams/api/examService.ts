import { MCQPaper, ExamSession, UserAnswer } from '../model/types';
import { logger } from '@/shared/lib/logger';
import env from '@/config/env';

const BASE_URL = `${env.NEXT_PUBLIC_APP_URL}/api/exam`;

// Helper function to ensure valid URL construction
const buildUrl = (path: string, params?: Record<string, string>) => {
    const url = new URL(`${BASE_URL}${path}`, env.NEXT_PUBLIC_APP_URL);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    return url.toString();
};

export const examService = {
    async listPapers(type: 'model' | 'past'): Promise<MCQPaper[]> {
        const startTime = Date.now();
        try {
            logger.info('Fetching exam papers', {
                type,
                endpoint: `${BASE_URL}/papers`
            });

            const url = buildUrl('/papers', { type });
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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

            const url = buildUrl(`/papers/${id}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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

            const url = buildUrl('/sessions');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paperId }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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

            const url = buildUrl(`/sessions/${sessionId}/answers`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answer),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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

            const url = buildUrl(`/sessions/${sessionId}/complete`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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