/**
 * ExamDialogs component
 * Manages the finish and time's up dialogs for exam submission
 */
"use client";

import React from 'react';
import { ExamAlertDialog } from '../molecules/ExamAlertDialog';

interface ExamDialogsProps {
  /** Whether to show the finish exam confirmation dialog */
  showFinishDialog: boolean;
  /** Whether to show the time's up dialog */
  showTimesUpDialog: boolean;
  /** Handler for changing the finish dialog visibility */
  onFinishDialogChange: (open: boolean) => void;
  /** Handler for changing the time's up dialog visibility */
  onTimesUpDialogChange: (open: boolean) => void;
  /** Handler for confirming exam submission */
  onSubmitExam: () => void;
}

/**
 * Component to manage all exam-related dialogs
 */
export const ExamDialogs: React.FC<ExamDialogsProps> = ({
  showFinishDialog,
  showTimesUpDialog,
  onFinishDialogChange,
  onTimesUpDialogChange,
  onSubmitExam,
}) => {
  return (
    <>
      {/* Finish Confirmation Dialog */}
      <ExamAlertDialog
        open={showFinishDialog}
        onOpenChange={onFinishDialogChange}
        title="Submit Exam"
        description="Are you sure you want to submit your exam? You won't be able to make changes after submission."
        confirmText="Submit Exam"
        onConfirm={onSubmitExam}
      />
      
      {/* Time's Up Dialog */}
      <ExamAlertDialog
        open={showTimesUpDialog}
        onOpenChange={onTimesUpDialogChange}
        title="Time's Up!"
        description="Your exam time has expired. Your answers will be submitted automatically."
        confirmText="View Results"
        onConfirm={onSubmitExam}
        cancelText="Close"
      />
    </>
  );
};

export default ExamDialogs;
