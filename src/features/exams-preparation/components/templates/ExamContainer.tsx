/**
 * ExamContainer component
 * Top-level template component for the exam taking experience
 */
"use client";

import React from 'react';
import { ExamLayout } from './ExamLayout';
import { ExamQuestionCard } from '../organisms/ExamQuestionCard';
import { ExamSidebar } from '../organisms/ExamSidebar';
import { ExamHeader } from '../molecules/ExamHeader';
import { ExamDialogs } from '../organisms/ExamDialogs';
import { useExamSession } from '../../hooks/useExamSession';

interface ExamContainerProps {
  /** ID of the exam to load */
  examId: string;
  /** Optional custom class name */
  className?: string;
}

/**
 * Container component for the exam taking experience
 * Orchestrates the exam components and manages state through the useExamSession hook
 */
export const ExamContainer: React.FC<ExamContainerProps> = ({
  examId,
  className = '',
}) => {
  // Get exam state and actions from the hook
  const {
    exam,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    error,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    showFinishDialog,
    showTimesUpDialog,
    loadExam,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectOption,
    handleFinishClick,
    handleSubmitExam,
    handleTimeUp,
    setShowFinishDialog,
    setShowTimesUpDialog
  } = useExamSession(examId);

  return (
    <ExamLayout
      isLoading={isLoading}
      error={error}
      onRetry={() => loadExam(examId)}
      title={exam?.title}
      className={className}
      header={
        exam && (
          <ExamHeader
            title={exam.title}
            description={exam.description}
            durationMinutes={exam.durationMinutes}
            onTimeUp={handleTimeUp}
          />
        )
      }
      sidebar={
        exam && (
          <ExamSidebar
            questions={exam.questions}
            questionsCount={exam.questions.length}
            durationMinutes={exam.durationMinutes}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onSelectQuestion={(index) => currentQuestionIndex !== index && loadExam(examId)}
            onFinishClick={handleFinishClick}
          />
        )
      }
    >
      {currentQuestion && (
        <ExamQuestionCard
          questionId={currentQuestion.id}
          questionNumber={currentQuestionIndex + 1}
          questionText={currentQuestion.text}
          options={currentQuestion.options}
          selectedOption={userAnswers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          onFinishClick={handleFinishClick}
        />
      )}
      
      {/* Dialog management component */}
      <ExamDialogs 
        showFinishDialog={showFinishDialog}
        showTimesUpDialog={showTimesUpDialog}
        onFinishDialogChange={setShowFinishDialog}
        onTimesUpDialogChange={setShowTimesUpDialog}
        onSubmitExam={handleSubmitExam}
      />
    </ExamLayout>
  );
};

export default ExamContainer;
