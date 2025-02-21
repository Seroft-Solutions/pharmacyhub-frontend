import React from 'react';
import { UserProgress, Question } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceCharts } from './PerformanceCharts';

interface ResultsViewProps {
  progress: UserProgress;
  questions: Question[];
}

export const ResultsView = ({ progress, questions }: ResultsViewProps) => {
  const latestAttempt = progress.attempts[progress.attempts.length - 1];
  
  const calculateStats = () => {
    const totalQuestions = questions.length;
    const attemptedQuestions = Object.keys(latestAttempt.answers).length;
    const correctAnswers = latestAttempt.answers.filter(a => a.isCorrect).length;
    const score = (correctAnswers / totalQuestions) * 100;
    
    return {
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      score,
      timeTaken: latestAttempt.timeSpent,
      averageTimePerQuestion: latestAttempt.timeSpent / attemptedQuestions
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {stats.score.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {stats.correctAnswers} / {stats.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {Math.floor(stats.timeTaken / 60)}:{(stats.timeTaken % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PerformanceCharts progress={progress} />

      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = latestAttempt.answers.find(a => a.questionId === question.id);
              const isCorrect = answer?.isCorrect;

              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50' : answer ? 'bg-red-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-800 mb-4">{question.content.question}</p>
                      
                      <div className="space-y-2">
                        {Object.entries(question.content.options).map(([key, text]) => (
                          <div 
                            key={key}
                            className={`p-2 rounded ${
                              key === question.content.correctAnswer ? 'bg-green-100' :
                              key === answer?.selectedAnswer ? 'bg-red-100' :
                              'bg-white'
                            }`}
                          >
                            {key}. {text}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ml-4">
                      {isCorrect ? (
                        <span className="text-green-600">✓</span>
                      ) : answer ? (
                        <span className="text-red-600">✗</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>

                  {!isCorrect && answer && (
                    <div className="mt-4 p-4 bg-white rounded">
                      <h4 className="font-medium text-gray-700 mb-2">Explanation</h4>
                      <p className="text-gray-600">{question.content.explanation.detailed}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};