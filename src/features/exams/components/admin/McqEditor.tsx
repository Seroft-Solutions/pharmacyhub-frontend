"use client"

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Question } from '../../types/StandardTypes';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface McqEditorProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => Promise<void>;
}

export const McqEditor: React.FC<McqEditorProps> = ({ 
  question, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset state when question changes or dialog opens/closes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setLoading(false);
    
    if (question && isOpen) {
      // Deep copy the question to avoid modifying the original
      try {
        const copy = JSON.parse(JSON.stringify(question));
        
        // Ensure required properties exist
        copy.text = copy.text || '';
        copy.options = Array.isArray(copy.options) ? copy.options : [];
        copy.options = copy.options.map(opt => ({
          ...opt,
          text: opt.text || '',
          label: opt.label || ''
        }));
        
        setEditedQuestion(copy);
      } catch (err) {
        console.error('Error copying question data:', err);
        
        // Create a sanitized copy manually
        const safeCopy: Question = {
          id: question.id,
          questionNumber: question.questionNumber,
          text: question.text || '',
          options: (question.options || []).map(opt => ({
            id: opt?.id,
            label: opt?.label || '',
            text: opt?.text || '',
            isCorrect: opt?.isCorrect
          })),
          correctAnswer: question.correctAnswer || '',
          explanation: question.explanation || '',
          marks: question.marks || 1
        };
        
        setEditedQuestion(safeCopy);
      }
    }
  }, [question, isOpen]);

  // If no question is provided or editor is not open, return null
  if (!editedQuestion || !isOpen) return null;

  // Handle text changes
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedQuestion({
      ...editedQuestion,
      text: e.target.value
    });
  };

  // Handle option text change
  const handleOptionTextChange = (index: number, text: string) => {
    if (!editedQuestion.options || !Array.isArray(editedQuestion.options)) {
      return; // Don't proceed if options is not an array
    }
    
    const newOptions = [...editedQuestion.options];
    if (newOptions[index]) {
      newOptions[index] = {
        ...newOptions[index],
        text: text
      };
      
      setEditedQuestion({
        ...editedQuestion,
        options: newOptions
      });
    }
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (index: number, checked: boolean) => {
    // Only update if checked is true (ignore unchecking)
    if (!checked || !editedQuestion.options || !Array.isArray(editedQuestion.options)) {
      return;
    }
    
    // Get the option's label
    const option = editedQuestion.options[index];
    if (!option || !option.label) {
      return;
    }
    
    // Update the correct answer in the question
    setEditedQuestion({
      ...editedQuestion,
      correctAnswer: option.label
    });
  };

  // Handle explanation change
  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedQuestion({
      ...editedQuestion,
      explanation: e.target.value
    });
  };

  // Save the edited question
  const handleSave = async () => {
    if (!editedQuestion.text || !editedQuestion.text.trim()) {
      setError("Question text cannot be empty");
      return;
    }
    
    if (!editedQuestion.correctAnswer) {
      setError("Please select a correct answer");
      return;
    }
    
    if (!editedQuestion.options || !Array.isArray(editedQuestion.options) || editedQuestion.options.length === 0) {
      setError("Question must have options");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await onSave(editedQuestion);
      
      setSuccess('Question updated successfully');
      
      // Close the dialog after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving question:', err);
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Question #{editedQuestion.questionNumber}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-text" className="text-base font-medium">Question Text</Label>
            <Textarea
              id="question-text"
              value={editedQuestion.text || ''}
              onChange={handleQuestionTextChange}
              rows={3}
              className="resize-none"
              placeholder="Enter the question text..."
            />
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-3">
            <Label className="text-base font-medium">Options</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Check the box next to the correct answer
            </p>
            
            {Array.isArray(editedQuestion.options) && editedQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 pt-2 border-b pb-3 last:border-0">
                <div className="flex items-center h-10 space-x-3 min-w-10">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center font-medium">
                    {option.label || ''}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <Input
                    value={option.text || ''}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    className="w-full"
                    placeholder={`Enter option ${option.label || ''}...`}
                  />
                </div>
                
                <div className="flex items-center h-10 space-x-2 pl-3">
                  <Checkbox 
                    id={`option-${index}`}
                    checked={option.label === editedQuestion.correctAnswer}
                    onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked === true)}
                  />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    Correct
                  </Label>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            <Label htmlFor="explanation" className="text-base font-medium">Explanation</Label>
            <Textarea
              id="explanation"
              value={editedQuestion.explanation || ''}
              onChange={handleExplanationChange}
              rows={4}
              className="resize-none"
              placeholder="Provide an explanation for the correct answer..."
            />
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
