"use client"

import React, {useCallback, useEffect, useState} from 'react';
import { AlertCircleIcon, CheckIcon, FileTextIcon, UploadIcon, DollarSignIcon } from 'lucide-react';
import { processJsonExam } from '../../utils/jsonExamProcessor';
import { useApiMutation } from '@/features/core/tanstack-query-api';
import { useQueryClient } from '@tanstack/react-query';
import { useJsonExamUploadMutation, useUpdateExam } from '@/features/exams/api/hooks';
import { Difficulty, PaperType, Question, Exam } from '../../types/StandardTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaperMetadataFields } from './PaperMetadataFields';
import { getRequiredFields, metadataToTags, extractMetadataFromTags } from '../../utils/paperTypeUtils';

// Import the new centralized RBAC components
import { ExamOperationGuard, ExamOperation, useExamFeatureAccess } from '@/features/exams/rbac';

interface JsonExamUploaderProps {
  defaultPaperType?: string;
  editMode?: boolean;
  examToEdit?: Exam;
}

/**
 * Component for uploading JSON files and creating/editing exams
 * Requires CREATE or EDIT operation permission on exams feature
 */
export const JsonExamUploader: React.FC<JsonExamUploaderProps> = ({ 
  defaultPaperType = PaperType.PRACTICE, 
  editMode = false,
  examToEdit
}) => {
  // Get the queryClient
  const queryClient = useQueryClient();
  
  // Create direct mutations
  const uploadMutation = useJsonExamUploadMutation();
  
  // Debug flag for logging
  const DEBUG = process.env.NODE_ENV === 'development';
  
  // Debug key handler for toggling debug panel with Alt+D
  useEffect(() => {
    if (DEBUG) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Alt+D to toggle debug panel
        if (e.altKey && e.key === 'd') {
          const debugElem = document.getElementById('api-debug-panel');
          if (debugElem) {
            debugElem.style.display = debugElem.style.display === 'none' ? 'block' : 'none';
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);
  
  // Get the exam ID for the update mutation
  const examId = examToEdit?.id ? parseInt(examToEdit.id.toString()) : 0;
  
  // Use the properly configured useUpdateExam hook
  // Adding the explicit method: 'PUT' parameter to ensure correct HTTP method
  const { mutateAsync: updateExam, isLoading: isUpdating } = useUpdateExam(
    examId,
    {
      method: 'PUT', // Explicitly specify HTTP method as PUT
      onSuccess: () => {
        // Invalidate exams queries
        queryClient.invalidateQueries({ queryKey: ['exams'] });
      },
      onError: (error) => {
        if (DEBUG) {
          console.error('Error updating exam:', error);
        }
      }
    }
  );
  
  // Add debug log when in edit mode
  useEffect(() => {
    if (DEBUG && editMode && examToEdit) {
      console.group('Edit Mode Debug');
      console.log('Editing exam:', examToEdit);
      console.log('Has questions:', examToEdit.questions ? examToEdit.questions.length : 0);
      console.log('First question:', examToEdit.questions?.[0]);
      console.groupEnd();
    }
  }, [DEBUG, editMode, examToEdit]);
  
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
  const [price, setPrice] = useState<number>(2000); // Default to PKR 2000 for premium exams

  // State for validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  // Use the new feature access hook
  const { canCreateExams, canEditExams } = useExamFeatureAccess();

  // Update paperType when defaultPaperType changes
  useEffect(() => {
    setPaperType(defaultPaperType);
  }, [defaultPaperType]);

  // Reset metadata when paper type changes
  useEffect(() => {
    setMetadata({});
    setErrors({});
  }, [paperType]);
  
  // Pre-fill form with exam data when in edit mode
  useEffect(() => {
    if (editMode && examToEdit) {
      // Reset form errors
      setErrors({});
      setError(null);
      
      // Set basic fields
      setTitle(examToEdit.title || '');
      setDescription(examToEdit.description || '');
      setDuration(examToEdit.duration || 60);
      
      // Set difficulty
      const examDifficulty = examToEdit.metadata?.difficulty || Difficulty.MEDIUM;
      setDifficulty(examDifficulty);
      
      // Set premium status and price
      setIsPremium(!!examToEdit.isPremium);
      setPrice(examToEdit.price || 2000);
      
      // Extract metadata from tags and existing metadata
      const extractedMetadata = extractMetadataFromTags(examToEdit.tags || [], paperType);
      
      // Merge with any existing metadata in the exam
      const mergedMetadata = {
        ...extractedMetadata,
        ...(examToEdit.metadata || {})
      };
      
      setMetadata(mergedMetadata);
      
      // If exam has questions, use them
      if (examToEdit.questions && examToEdit.questions.length > 0) {
        console.log('Setting questions from examToEdit:', examToEdit.questions.length);
        setQuestions(examToEdit.questions);
        
        if (DEBUG) {
          console.log('Questions loaded from exam:', examToEdit.questions);
        }
      } else {
        if (DEBUG) {
          console.warn('No questions found in examToEdit');
        }
        setQuestions([]);
      }
    }
  }, [editMode, examToEdit, paperType, DEBUG]);

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
    
    // Validate JSON file only for create mode, not for edit mode
    if (!editMode && !jsonFile) {
      newErrors.jsonFile = 'JSON file is required';
    }
    
    // Validate premium fields - price is auto-set to 2000 PKR
    if (isPremium && price !== 2000) {
      newErrors.price = 'Price for premium exams must be 2000 PKR';
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
    
    // Don't clear existing questions in edit mode unless new file is selected
    if (!editMode) {
      setQuestions([]);
    }

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
        setSuccess(`Processed ${processedQuestions.length} questions successfully${editMode ? '. Upload will update existing exam questions.' : ''}`);

      } catch (err) {
        console.error('Error processing file:', err);
        setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [editMode]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: React.FormEvent) => {
    // Check permission before submission
    if (editMode && !canEditExams) {
      setError('You do not have permission to edit exams');
      return;
    } else if (!editMode && !canCreateExams) {
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

      // Prepare common payload fields that match the ExamRequestDTO structure exactly
      const commonPayload = {
        title,
        description,
        duration: Number(duration),
        totalMarks: 100, // Default value
        passingMarks: 60, // Default value
        tags,
        isPremium,
        price: isPremium ? 2000 : 0,
        // Do not include other fields not defined in ExamRequestDTO
      };
      
      if (editMode && examToEdit) {
      // Update existing exam with a simpler payload
      // Only include fields defined in ExamRequestDTO
      
      // Create a payload that exactly matches ExamRequestDTO structure
      const updatePayload = {
        title: title || examToEdit.title || 'Updated Exam',
        description: description || examToEdit.description || 'Updated exam description',
        duration: Number(duration) || examToEdit.duration || 60,
        totalMarks: examToEdit.totalMarks || 100,
        passingMarks: examToEdit.passingMarks || 60,
        status: examToEdit.status || 'PUBLISHED',
        tags: tags || examToEdit.tags || [],
        isPremium: isPremium,
        price: isPremium ? 2000 : 0,
        isCustomPrice: false
      };
      
      // Remove any undefined values
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });
      
      // Log the payload for debugging
      if (DEBUG) {
        console.log('Updating exam with payload:', updatePayload);
      }
      
      // Validate required fields before submission
      if (!updatePayload.title || !updatePayload.duration || !updatePayload.totalMarks || !updatePayload.passingMarks) {
        if (DEBUG) {
          console.error('Missing required fields in update payload:', { 
            title: updatePayload.title, 
            duration: updatePayload.duration, 
            totalMarks: updatePayload.totalMarks, 
            passingMarks: updatePayload.passingMarks 
          });
        }
          throw new Error('Required fields are missing. Please check the form.');
        }
      
        // Update the exam using the appropriate mutation
        const safeExamId = examToEdit.id ? String(parseInt(examToEdit.id.toString())) : '0';
        if (DEBUG) {
          console.log('Updating exam with ID:', safeExamId);
        }
        try {
          // Make sure we have the required fields to match ExamRequestDTO
          const validatedPayload = {
          title: updatePayload.title,
          description: updatePayload.description || '',
          duration: Number(updatePayload.duration),
          totalMarks: Number(updatePayload.totalMarks),
          passingMarks: Number(updatePayload.passingMarks),
          // Only include fields that are in the DTO
          status: updatePayload.status,
          tags: updatePayload.tags,
          isPremium: updatePayload.isPremium,
          price: updatePayload.price,
          isCustomPrice: updatePayload.isCustomPrice,
            // Preserve existing questions or use newly uploaded ones
            questions: questions.length > 0 ? questions : (examToEdit?.questions || [])
          };

          
          // Use the proper update mutation - no need to pass ID here
          // as it's already included in the hook instantiation
          const result = await updateExam(validatedPayload);
          

          if (!result) {
            throw new Error('Received empty response from server');
          }
          
        } catch (err) {
          if (DEBUG) {
            console.error('Update mutation failed:', err);
          }
          
          // Handle specific error types
          if (err.response) {
            if (DEBUG) {
              console.error('API Error Response:', err.response);
            }
            
            // Check various places where error messages might be in the response
            const errorMessage = 
              err.response.data?.message || 
              err.response.data?.error || 
              (typeof err.response.data === 'string' ? err.response.data : null) ||
              'Server validation failed. Check all required fields.';
              
            if (err.response.status === 400) {
              // Special handling for validation errors
              throw new Error(`Validation Error: ${errorMessage}`);
            } else {
              throw new Error(`API Error (${err.response.status}): ${errorMessage}`);
            }
          } else if (err.message?.includes('No handler found')) {
            // Special handling for 'No handler found' errors - common API routing issue
            throw new Error('API endpoint not found. This is likely a server-side issue. Please contact support.');
          } else if (err.response?.status === 405) {
            // Method not allowed - usually means the HTTP method is incorrect (POST vs PUT)
            throw new Error('HTTP Method not allowed. The server rejected the request method. This might be a configuration issue.');
          } else if (err.message?.includes('Network Error')) {
            // Common CORS or network connectivity issues
            throw new Error('Network error occurred. This might be due to CORS restrictions or network connectivity issues.');
          }
          throw err;
        }
        
        setSuccess(`Exam "${title}" successfully updated!`);
      } else {
        // Create new exam
        const createPayload = {
          ...commonPayload,
          passingMarks: Math.ceil(questions.length * 0.6), // Default 60% passing mark
          status: 'DRAFT',
          jsonContent,
        };
        
        // Log the payload for debugging
        if (DEBUG) {
        console.log('Uploading exam with payload:', createPayload);
      }
        
        // Upload the exam using the appropriate mutation
        await uploadMutation.mutateAsync(createPayload);
        
        setSuccess(`Exam "${title}" successfully created!`);

        // Reset form after creation
        setTitle('');
        setDescription('');
        setDuration(60);
        setDifficulty(Difficulty.MEDIUM);
        setMetadata({});
        setJsonFile(null);
        setJsonContent('');
        setQuestions([]);
        setPreview(false);
        setIsPremium(false);
        setPrice(2000);
        setErrors({});

        // Reset file input
        const fileInput = document.getElementById('json-file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (err) {
      if (DEBUG) {
        console.error('Error creating/updating exam:', err);
      }
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      operation={editMode ? ExamOperation.EDIT : ExamOperation.CREATE}
      fallback={
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4"/>
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to {editMode ? 'edit' : 'create'} exams
          </AlertDescription>
        </Alert>
      }
    >
    <Card className="shadow-md">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="flex items-center gap-2">
          <UploadIcon className="h-5 w-5"/>
          {editMode ? (
            <div className="flex items-center">
              Edit Exam Metadata
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full">ID: {examToEdit?.id}</span>
            </div>
          ) : (
            'Upload MCQ JSON File'
          )}
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
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPremium" 
                    checked={isPremium}
                    onCheckedChange={(checked) => {
                      setIsPremium(checked === true);
                      // Automatically set price to 2000 when premium is checked
                      if (checked === true) {
                        setPrice(2000);
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="isPremium" className="text-sm font-medium">
                    Make this a premium exam
                  </label>
                </div>
              </div>
              
              {isPremium && (
                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md border border-amber-200">
                    <div className="flex items-center">
                      <DollarSignIcon className="h-5 w-5 text-amber-500 mr-2" />
                      <div>
                        <p className="font-medium">Premium Exam Price</p>
                        <p className="text-sm text-muted-foreground">Fixed price of PKR 2000 for all premium exams</p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-amber-600">PKR 2,000</div>
                  </div>
                  <input type="hidden" name="price" value="2000" />
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

            {/* JSON File section - only required for new exams */}
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="json-file-input">
                JSON File {!editMode && <span className="text-red-500">*</span>}
              </label>
              <Input
                id="json-file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={isSubmitting || isProcessing}
                required={!editMode} // Only required for new exams
                className={`w-full ${errors.jsonFile ? 'border-red-500' : ''}`}
              />
              {errors.jsonFile && <p className="text-xs text-red-500">{errors.jsonFile}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {editMode
                  ? questions.length > 0 
                    ? `Currently has ${questions.length} questions. Upload a new JSON file to replace existing questions (optional).`
                    : 'Upload a JSON file to add questions to this exam (optional).'
                  : 'Upload a JSON file containing MCQ questions.'}
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

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isProcessing || (!editMode && questions.length === 0)}
              >
                {isSubmitting ? 
                  (editMode ? 'Saving...' : 'Creating...') : 
                  isProcessing ? 
                    'Processing...' : 
                    (editMode ? `Save Changes${questions.length ? ` (${questions.length} questions)` : ''}` : 'Create Exam')
                }
              </Button>
              
              {editMode && questions.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {jsonFile ? (
                    <span className="flex items-center text-green-600">
                      <CheckIcon className="mr-1 h-4 w-4" />
                      {questions.length} questions will be updated
                    </span>
                  ) : (
                    <span>
                      Preserving {questions.length} existing questions
                    </span>
                  )}
                </div>
              )}
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