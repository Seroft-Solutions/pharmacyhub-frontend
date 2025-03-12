import { Question, Option } from '../../model/standardTypes';

/**
 * Process JSON data from uploaded file into standardized Question format
 */
export function processJsonExam(jsonData: any[]): Question[] {
  if (!Array.isArray(jsonData)) {
    throw new Error('Invalid JSON format: Expected an array of questions');
  }
  
  return jsonData.map((item, index) => {
    // Extract question number - handle different property names
    const questionNumber = item.number || item.question_number || item.questionNumber || (index + 1);
    
    // Extract question text
    const text = item.question;
    if (!text) {
      throw new Error(`Invalid question format at index ${index}: Missing question text`);
    }
    
    // Extract and format options
    const options = processOptions(item.options);
    if (!options || options.length === 0) {
      throw new Error(`Invalid question format at index ${index}: Missing options`);
    }
    
    // Extract correct answer and explanation
    const answer = item.answer || '';
    const explanation = item.explanation || '';
    
    // Extract correct answer identifier (may be "A" or "A) Option text")
    const correctAnswer = extractCorrectAnswerKey(answer);

    // Map to our Question interface
    return {
      id: index + 1, // Temporary ID, will be replaced when stored
      questionNumber,
      text,
      options,
      correctAnswer,
      explanation,
      marks: 1 // Default mark value
    };
  });
}

/**
 * Extract the correct letter/key from different answer formats
 */
function extractCorrectAnswerKey(answer: string): string {
  // Handle different formats:
  // "A" or "A)" or "A) Option text"
  if (!answer) return '';
  
  // If it's just a single letter like "A"
  if (answer.length === 1 && answer.match(/[A-D]/i)) {
    return answer.toUpperCase();
  }
  
  // If it's like "A)" or "A) Option text"
  const match = answer.match(/^([A-D])[)\s]/i);
  if (match) {
    return match[1].toUpperCase();
  }
  
  return answer; // Return as is if we can't extract
}

/**
 * Process options data into standardized Option format
 */
function processOptions(options: any): Option[] {
  if (!options) return [];
  
  // If options is an object with A, B, C, D keys
  if (typeof options === 'object' && !Array.isArray(options)) {
    return Object.entries(options).map(([key, value], index) => ({
      id: index + 1,
      label: key,
      text: value as string,
    }));
  }
  
  // If options is already an array
  if (Array.isArray(options)) {
    return options.map((opt, index) => ({
      id: index + 1,
      label: String.fromCharCode(65 + index), // A, B, C, D...
      text: typeof opt === 'string' ? opt : opt.text || '',
    }));
  }
  
  return [];
}