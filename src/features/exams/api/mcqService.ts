import { MCQPaper, ExamSession, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import env from '@/config/env';
import { adaptBackendExamPaper, BackendExamPaper } from './adapter';

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

export const mcqService = {
    async listPublishedExams(): Promise<MCQPaper[]> {
        const startTime = Date.now();
        try {
            logger.info('Fetching published MCQ exams', {
                endpoint: `${BASE_URL}/published`
            });

            const url = buildUrl('/mcq/published');
            const response = await fetch(url);
            
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const backendExams: BackendExamPaper[] = await response.json();
            const exams = backendExams.map(adaptBackendExamPaper);

            logger.info('Successfully fetched published MCQ exams', {
                count: exams.length,
                responseTime: `${Date.now() - startTime}ms`
            });

            return exams as MCQPaper[];
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
                endpoint: `${BASE_URL}/mcq/${id}`
            });

            const url = buildUrl(`/mcq/${id}`);
            const response = await fetch(url);
            
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const backendExam: BackendExamPaper = await response.json();
            const exam = adaptBackendExamPaper(backendExam);

            logger.info('Successfully fetched MCQ exam', {
                examId: id,
                title: exam.title,
                responseTime: `${Date.now() - startTime}ms`
            });

            return exam as MCQPaper;
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
                endpoint: `${BASE_URL}/mcq/${examId}/start`
            });

            const url = buildUrl(`/mcq/${examId}/start`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const session = await response.json();

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
                endpoint: `${BASE_URL}/mcq/sessions/${sessionId}/submit`
            });

            const url = buildUrl(`/mcq/sessions/${sessionId}/submit`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers })
            });
            
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();

            logger.info('Successfully submitted MCQ exam session', {
                sessionId,
                score: result.score,
                totalQuestions: result.totalQuestions,
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
