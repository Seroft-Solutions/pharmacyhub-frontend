"use client"

import React, {useCallback, useEffect, useState} from 'react';
import { AlertCircleIcon, CheckIcon, FileTextIcon, UploadIcon, DollarSignIcon } from 'lucide-react';
import { processJsonExam } from '../../utils/jsonExamProcessor';
import { useJsonExamUploadMutation } from '@/features/exams/api/hooks';
import { Difficulty, PaperType, Question } from '../../types/StandardTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaperMetadataFields } from './PaperMetadataFields';
import { getRequiredFields, metadataToTags } from '../../utils/paperTypeUtils';

// Import the new centralized RBAC components
import { ExamOperationGuard, ExamOperation, useExamFeatureAccess } from '@/features/exams/rbac';

interface JsonExamUploaderProps {
  defaultPaperType?: string;
}

/**
 * Component for uploading JSON files and creating exams
 * Requires CREATE operation permission on exams feature
 */
export const JsonExamUploader: React.FC<JsonExamUploaderProps> = ({ defaultPaperType = PaperType.PRACTICE }) => {
  // Get the JSON upload mutation
  const uploadMutation = useJsonExamUploadMutation();
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(60); // Default 60 minutes
  const [difficulty, setDifficulty] = useState<string>(Difficulty.MEDIUM);
  const [paperType, setPaperType] = useState<string>(defaultPaperType);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonContent, setJsonContent] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Premium exam fields
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0); 
  const [isCustomPrice, setIsCustomPrice] = useState<boolean>(false);

  // State for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  // Use the new feature access hook
  const { canCreateExams } = useExamFeatureAccess();

  // Update paperType when defaultPaperType changes
  useEffect(() => {
    setPaperType(defaultPaperType);
  }, [defaultPaperType]);

  // Reset metadata when paper type changes
  useEffect(() => {
    setMetadata({});
    setErrors({});
  }, [paperType]);

  /**
   * Handle metadata field changes
   */
  const handleMetadataChange = (field: string, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validate the form
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate basic fields
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!duration || duration <= 0) {
      newErrors.duration = 'Valid duration is required';
    }
    
    if (!jsonFile) {
      newErrors.jsonFile = 'JSON file is required';
    }
    
    // Validate premium fields
    if (isPremium && (!price || price <= 0)) {
      newErrors.price = 'Valid price is required for premium exams';
    }
    
    // Validate required metadata fields
    const requiredFields = getRequiredFields(paperType);
    requiredFields.forEach(field => {
      if (!metadata[field] || (typeof metadata[field] === 'string' && !metadata[field].trim())) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    // Check permission before submission
    if (!canCreateExams) {
      setError('You do not have permission to create exams');
      return;
    }
    
    event.preventDefault();

    // Validate the form
    if (!validateForm()) {
      setError('Please fix the form errors before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Add paperType-specific default values to metadata
      const fullMetadata = {
        ...metadata,
        difficulty
      };
      
      // Ensure required fields have values
      if (paperType === PaperType.PRACTICE && !fullMetadata.skillLevel) {
        fullMetadata.skillLevel = 'Intermediate';
      } else if (paperType === PaperType.PAST && !fullMetadata.year) {
        const currentYear = new Date().getFullYear();
        fullMetadata.year = (currentYear - 1).toString();
      } else if (paperType === PaperType.SUBJECT && !fullMetadata.academicLevel) {
        fullMetadata.academicLevel = 'Undergraduate';
      }

      // Create tags based on paperType and metadata
      const tags = metadataToTags(fullMetadata, paperType);

      // Prepare request payload
      const payload = {
        title,
        description,
        duration,
        passingMarks: Math.ceil(questions.length * 0.6), // Default 60% passing mark
        status: 'DRAFT',
        tags,
        paperType, // Add paper type explicitly
        metadata: fullMetadata, // Add full metadata
        jsonContent,
        isPremium, // Add premium flag
        price, // Add price
        isCustomPrice, // Add custom price flag
      };
      
      // Log the payload for debugging
      console.log('Uploading exam with payload:', payload);
      
      // Upload the exam using the mutation
      await uploadMutation.mutateAsync(payload);

      setSuccess(`Exam "${title}" successfully created!`);

      // Reset form
      setTitle('');
      setDescription('');
      setDuration(60);
      setDifficulty(Difficulty.MEDIUM);
      // Don't reset paperType as it's controlled by the parent
      setMetadata({});
      setJsonFile(null);
      setJsonContent('');
      setQuestions([]);
      setPreview(false);
      setIsPremium(false);
      setPrice(0);
      setIsCustomPrice(false);
      setErrors({});

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
    <ExamOperationGuard 
      operation={ExamOperation.CREATE}
      fallback={
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4"/>
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You don't have permission to create exams</AlertDescription>
        </Alert>
      }
    >
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
                Paper Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter paper title"
                required
                disabled={isSubmitting}
                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter paper description"
                required
                disabled={isSubmitting}
                className={`w-full min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="duration">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value))}
                  min={1}
                  required
                  disabled={isSubmitting}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="difficulty">
                  Difficulty <span className="text-red-500">*</span>
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

              {/* Paper Type dropdown is now hidden since it's redundant with the tabs */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium">
                  Paper Type <span className="text-red-500">*</span>
                </label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center justify-between">
                  <span className="text-sm">
                    {paperType === PaperType.PRACTICE && 'Practice'}
                    {paperType === PaperType.MODEL && 'Model'}
                    {paperType === PaperType.PAST && 'Past'}
                    {paperType === PaperType.SUBJECT && 'Subject'}
                  </span>
                  <span className="text-xs text-muted-foreground">Selected from tab</span>
                </div>
                <input type="hidden" name="paperType" value={paperType} />
              </div>
            </div>

            {/* Premium exam settings */}
            <div className="space-y-6 border p-4 rounded-lg bg-muted/20">
              <h3 className="font-medium flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-primary" />
                Premium Settings
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPremium" 
                    checked={isPremium}
                    onCheckedChange={(checked) => setIsPremium(checked === true)}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="isPremium" className="text-sm font-medium">
                    Make this a premium exam
                  </label>
                </div>
              </div>
              
              {isPremium && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="price">
                      Price (PKR) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={e => setPrice(parseFloat(e.target.value))}
                      min={0}
                      step={0.01}
                      required={isPremium}
                      disabled={isSubmitting}
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isCustomPrice" 
                      checked={isCustomPrice}
                      onCheckedChange={(checked) => setIsCustomPrice(checked === true)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor="isCustomPrice" className="text-sm font-medium">
                      Allow custom pricing for individual papers
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, individual papers can have their own price different from the exam price.
                  </p>
                </div>
              )}
            </div>

            {/* Paper Type Specific Metadata Fields */}
            <PaperMetadataFields
              paperType={paperType}
              metadata={metadata}
              onChange={handleMetadataChange}
              errors={errors}
              disabled={isSubmitting}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="json-file-input">
                JSON File <span className="text-red-500">*</span>
              </label>
              <Input
                id="json-file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={isSubmitting || isProcessing}
                required
                className={`w-full ${errors.jsonFile ? 'border-red-500' : ''}`}
              />
              {errors.jsonFile && <p className="text-xs text-red-500">{errors.jsonFile}</p>}
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
    </ExamOperationGuard>
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
