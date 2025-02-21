import { MCQPaper, ExamSession, UserAnswer } from '../model/types';

const BASE_URL = '/api/exam';

export const examService = {
    async listPapers(type: 'model' | 'past'): Promise<MCQPaper[]> {
        const response = await fetch(`${BASE_URL}/papers?type=${type}`);
        return response.json();
    },

    async getPaper(id: string): Promise<MCQPaper> {
        const response = await fetch(`${BASE_URL}/papers/${id}`);
        return response.json();
    },

    async startExam(paperId: string): Promise<ExamSession> {
        const response = await fetch(`${BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paperId }),
        });
        return response.json();
    },

    async submitAnswer(
        sessionId: string, 
        answer: UserAnswer
    ): Promise<{ isCorrect: boolean; explanation: string }> {
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
        return response.json();
    },

    async completeExam(sessionId: string): Promise<ExamSession> {
        const response = await fetch(
            `${BASE_URL}/sessions/${sessionId}/complete`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.json();
    },
};