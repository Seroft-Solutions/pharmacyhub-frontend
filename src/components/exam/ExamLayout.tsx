import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '@/store/examStore';
import { useExam } from '@/hooks/useExam';
import { QuestionCard } from './QuestionCard';
import { ExamTimer } from './ExamTimer';
import { QuestionNavigation } from './QuestionNavigation';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export const ExamLayout = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const { 
    exam, 
    questions, 
    isLoading, 
    error, 
    startExam, 
    submitExam,
    isSubmitting 
  } = useExam(examId!);

  const { 
    currentQuestionIndex,
    answers,
  } = useExamStore();

  useEffect(() => {
    if (examId && userId) {
      startExam(userId);
    }
  }, [examId, userId]);

  const handleSubmit = async () => {
    if (!userId || !examId) return;

    const confirmed = window.confirm(
      `Submit exam? You have answered ${Object.keys(answers).length} out of ${questions?.length} questions.`
    );
    
    if (confirmed) {
      await submitExam({ 
        userId, 
        answers: Object.values(answers)
      });
      navigate(`/exams/${examId}/results`);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !exam || !questions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex gap-4">
          {/* Left sidebar with question navigation */}
          <div className="w-64 shrink-0">
            <QuestionNavigation
              totalQuestions={questions.length}
              currentIndex={currentQuestionIndex}
              answers={answers}
            />
          </div>

          {/* Main content area */}
          <div className="flex-1">
            <div className="sticky top-0 bg-white border-b mb-4 p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <ExamTimer 
                  duration={exam.timeLimit * 60}
                  onTimeUp={handleSubmit}
                />
              </div>
            </div>

            <QuestionCard 
              question={questions[currentQuestionIndex]}
              answer={answers[questions[currentQuestionIndex]?.id]}
              onAnswer={(answer) => useExamStore.getState().submitAnswer(
                questions[currentQuestionIndex].id,
                answer
              )}
            />

            <div className="flex justify-between mt-4">
              <button
                className="btn"
                onClick={() => useExamStore.getState().navigateToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Exam'
                  )}
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => useExamStore.getState().navigateToQuestion(currentQuestionIndex + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};