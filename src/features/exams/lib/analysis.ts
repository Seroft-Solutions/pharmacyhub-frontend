import { MCQPaper, UserAnswer } from '../model/types';

export interface QuestionAnalysis {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
    percentage: number;
    timeSpent: number;
    topicWiseAnalysis: {
        [topic: string]: {
            total: number;
            attempted: number;
            correct: number;
            accuracy: number;
            averageTime: number;
        };
    };
    difficultyAnalysis: {
        [difficulty: string]: {
            total: number;
            attempted: number;
            correct: number;
            accuracy: number;
        };
    };
}

export function analyzeExamPerformance(
    paper: MCQPaper,
    answers: Record<string, UserAnswer>,
    timeSpent: number
): QuestionAnalysis {
    const totalQuestions = paper.totalQuestions;
    const attempted = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.isCorrect).length;
    const incorrect = attempted - correct;
    const score = correct - (incorrect * 0.25); // -0.25 for incorrect answers
    const percentage = (score / totalQuestions) * 100;

    // Topic-wise analysis
    const topicWiseAnalysis = paper.sections[0].questions.reduce((acc, q) => {
        const topic = q.metadata.topic;
        if (!acc[topic]) {
            acc[topic] = {
                total: 0,
                attempted: 0,
                correct: 0,
                accuracy: 0,
                averageTime: 0,
            };
        }

        acc[topic].total++;
        
        const answer = answers[q.id];
        if (answer) {
            acc[topic].attempted++;
            if (answer.isCorrect) {
                acc[topic].correct++;
            }
            acc[topic].averageTime += answer.timeSpent || 0;
        }

        // Calculate accuracy and average time
        acc[topic].accuracy = (acc[topic].correct / acc[topic].attempted) * 100;
        acc[topic].averageTime = acc[topic].averageTime / acc[topic].attempted;

        return acc;
    }, {} as QuestionAnalysis['topicWiseAnalysis']);

    // Difficulty-wise analysis
    const difficultyAnalysis = paper.sections[0].questions.reduce((acc, q) => {
        const difficulty = q.metadata.difficulty;
        if (!acc[difficulty]) {
            acc[difficulty] = {
                total: 0,
                attempted: 0,
                correct: 0,
                accuracy: 0,
            };
        }

        acc[difficulty].total++;
        
        const answer = answers[q.id];
        if (answer) {
            acc[difficulty].attempted++;
            if (answer.isCorrect) {
                acc[difficulty].correct++;
            }
        }

        // Calculate accuracy
        acc[difficulty].accuracy = 
            (acc[difficulty].correct / acc[difficulty].attempted) * 100;

        return acc;
    }, {} as QuestionAnalysis['difficultyAnalysis']);

    return {
        totalQuestions,
        attempted,
        correct,
        incorrect,
        score,
        percentage,
        timeSpent,
        topicWiseAnalysis,
        difficultyAnalysis,
    };
}

export function generateRecommendations(analysis: QuestionAnalysis): string[] {
    const recommendations: string[] = [];

    // Overall performance recommendations
    if (analysis.percentage < 50) {
        recommendations.push('Focus on understanding fundamental concepts across all topics.');
    }

    // Topic-wise recommendations
    Object.entries(analysis.topicWiseAnalysis).forEach(([topic, stats]) => {
        if (stats.accuracy < 60) {
            recommendations.push(
                `Review ${topic} - consider focusing on practice questions in this area.`
            );
        }
        if (stats.averageTime > 120) { // 2 minutes per question
            recommendations.push(
                `Work on improving speed in ${topic} questions.`
            );
        }
    });

    // Difficulty-based recommendations
    const difficultyLevels = Object.entries(analysis.difficultyAnalysis);
    difficultyLevels.forEach(([difficulty, stats]) => {
        if (stats.accuracy < 50) {
            recommendations.push(
                `Practice more ${difficulty} level questions to improve confidence.`
            );
        }
    });

    // Time management recommendations
    const averageTimePerQuestion = analysis.timeSpent / analysis.attempted;
    if (averageTimePerQuestion > 90) { // 1.5 minutes
        recommendations.push(
            'Work on time management - aim to spend about 1 minute per question initially.'
        );
    }

    // Attempt rate recommendations
    const attemptRate = (analysis.attempted / analysis.totalQuestions) * 100;
    if (attemptRate < 80) {
        recommendations.push(
            'Try to attempt more questions - even educated guesses can help improve your score.'
        );
    }

    return recommendations;
}