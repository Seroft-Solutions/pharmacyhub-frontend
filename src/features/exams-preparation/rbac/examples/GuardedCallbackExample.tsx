/**
 * GuardedCallbackExample
 * 
 * This example demonstrates how to use the useGuardedCallback hook
 * to create a button that checks permissions before executing an action.
 */
import React from 'react';
import { useGuardedCallback } from '../hooks/useGuardedCallback';
import { ExamOperation } from '../types';
import { Button } from '@/core/ui/atoms';

interface DeleteExamButtonProps {
  examId: number;
  onDelete: (examId: number) => void;
  isDisabled?: boolean;
}

/**
 * A button component that deletes an exam,
 * but only if the user has the DELETE_EXAM permission.
 */
export const DeleteExamButton: React.FC<DeleteExamButtonProps> = ({
  examId,
  onDelete,
  isDisabled = false
}) => {
  // Create a guarded callback that will only execute if the user has permission
  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => {
      // This will only execute if the user has permission
      onDelete(examId);
    },
    {
      // Provide context for the permission check
      context: { examId },
      
      // Show a notification if the user doesn't have permission
      showNotification: true,
      
      // Custom message if permission is denied
      notificationMessage: `You don't have permission to delete exam #${examId}`
    }
  );

  return (
    <Button 
      onClick={handleDelete} 
      disabled={isDisabled}
      variant="danger"
    >
      Delete Exam
    </Button>
  );
};

/**
 * Example of using the DeleteExamButton in a component
 */
export const ExamActionsExample: React.FC = () => {
  // This would normally come from a query or store
  const exam = {
    id: 123,
    title: 'Example Exam'
  };

  // Handle the delete action
  const handleDeleteExam = (examId: number) => {
    console.log(`Deleting exam ${examId}...`);
    // API call to delete the exam would go here
  };

  return (
    <div className="exam-actions p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">{exam.title}</h2>
      <div className="flex space-x-4">
        <Button variant="primary">Edit</Button>
        <DeleteExamButton
          examId={exam.id}
          onDelete={handleDeleteExam}
        />
      </div>
    </div>
  );
};

export default ExamActionsExample;
