"use client"

import React, {useCallback, useState} from 'react';
import {AlertCircleIcon, CheckIcon, FileTextIcon, UploadIcon} from 'lucide-react';
import {processJsonExam} from '../../utils/jsonExamProcessor';
import {jsonExamUploadService} from '@/features/exams/api/services/jsonExamUploadService';
import {Difficulty, PaperType, Question} from '../../types/StandardTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

/**
 * Component for uploading JSON files and creating exams
 */
const JsonExamUploader: React.FC = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(60); // Default 60 minutes
  const [difficulty, setDifficulty] = useState<string>(Difficulty.MEDIUM);
  const [paperType, setPaperType] = useState<string>(PaperType.PRACTICE);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonContent, setJsonContent] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  /**
   * Handle file selection
   */
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setPreview(false);
    setQuestions([]);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setJsonFile(file);

      try {
        setIsProcessing(true);

        // Read the file content
        const fileContent = await readFileAsText(file);
        setJsonContent(fileContent);

        // Parse and process the JSON data
        const jsonData = JSON.parse(fileContent);
        const processedQuestions = processJsonExam(jsonData);

        setQuestions(processedQuestions);
        setSuccess(`Processed ${processedQuestions.length} questions successfully`);

      } catch (err) {
        console.error('Error processing file:', err);
        setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!jsonFile || !jsonContent) {
      setError('Please select a JSON file');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Create tags based on paperType and difficulty
      const tags = [paperType];
      if (difficulty) {
        tags.push(difficulty);
      }

      // Upload the exam
      await jsonExamUploadService.uploadJsonExam({
        title,
        description,
        duration,
        passingMarks: Math.ceil(questions.length * 0.6), // Default 60% passing mark
        status: 'DRAFT',
        tags,
        jsonContent,
      });

      setSuccess(`Exam "${title}" successfully created!`);

      // Reset form
      setTitle('');
      setDescription('');
      setDuration(60);
      setDifficulty(Difficulty.MEDIUM);
      setPaperType(PaperType.PRACTICE);
      setJsonFile(null);
      setJsonContent('');
      setQuestions([]);
      setPreview(false);

      // Reset file input
      const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('Error creating exam:', err);
      setError(`Error creating exam: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Toggle preview
   */
  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="flex items-center gap-2">
          <UploadIcon className="h-5 w-5"/>
          Upload MCQ JSON File
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            <CheckIcon className="h-4 w-4"/>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="title">
                Paper Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter paper title"
                required
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter paper description"
                required
                disabled={isSubmitting}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="duration">
                  Duration (minutes)
                </label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  min={1}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="difficulty">
                  Difficulty
                </label>
                <Select
                  value={difficulty}
                  onValueChange={value => setDifficulty(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Difficulty.EASY}>Easy</SelectItem>
                    <SelectItem value={Difficulty.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Difficulty.HARD}>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="paperType">
                  Paper Type
                </label>
                <Select
                  value={paperType}
                  onValueChange={value => setPaperType(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="paperType">
                    <SelectValue placeholder="Select paper type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaperType.PRACTICE}>Practice</SelectItem>
                    <SelectItem value={PaperType.MODEL}>Model</SelectItem>
                    <SelectItem value={PaperType.PAST}>Past</SelectItem>
                    <SelectItem value={PaperType.SUBJECT}>Subject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="json-file-input">
                JSON File
              </label>
              <Input
                id="json-file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={isSubmitting || isProcessing}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a JSON file containing MCQ questions.
              </p>
            </div>

            {questions.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {questions.length} questions loaded successfully
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={togglePreview}
                  className="flex items-center gap-1"
                >
                  <FileTextIcon className="h-4 w-4"/>
                  {preview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            )}

            {preview && questions.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/20 max-h-96 overflow-y-auto">
                <h3 className="font-medium mb-4">Question Preview</h3>
                <div className="space-y-4">
                  {questions.slice(0, 5).map((question, idx) => (
                    <div key={idx} className="p-3 bg-background rounded shadow-sm">
                      <div className="font-medium mb-2">
                        {question.questionNumber}. {question.text}
                      </div>
                      <div className="pl-4 space-y-1 mb-2">
                        {question.options.map((option, optIdx) => (
                          <div key={optIdx} className="flex items-start">
                            <span className={`font-medium ${option.label === question.correctAnswer ?
                              'text-green-600' :
                              ''}`}>
                              {option.label}:
                            </span>
                            <span className="ml-2">{option.text}</span>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="text-sm mt-2 text-muted-foreground">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                  {questions.length > 5 && (
                    <div className="text-sm text-center text-muted-foreground pt-2">
                      Showing 5 of {questions.length} questions
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting || isProcessing || questions.length === 0}
              >
                {isSubmitting ? 'Creating...' : isProcessing ? 'Processing...' : 'Create Exam'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Helper function to read file content as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default JsonExamUploader;