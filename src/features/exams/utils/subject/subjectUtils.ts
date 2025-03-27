import { ExamPaper } from '../../types/StandardTypes';

/**
 * Interface for a Subject with name and paper count
 */
export interface Subject {
  name: string;
  count: number;
}

/**
 * Extracts subject name from an array of tags
 * @param tags - Array of paper tags
 * @returns Extracted subject name, defaults to "General" if not found
 */
export const extractSubjectFromTags = (tags: string[]): string => {
  if (!tags || !Array.isArray(tags)) {
    return 'General';
  }
  
  // Find the first tag that starts with 'subject:'
  const subjectTag = tags.find(tag => tag.toLowerCase().startsWith('subject:'));
  
  if (!subjectTag) {
    return 'General';
  }
  
  // Extract the subject name by removing the 'subject:' prefix
  const subject = subjectTag.split(':')[1];
  
  // Return the subject with proper capitalization, or 'General' if it's empty
  return subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'General';
};

/**
 * Groups papers by subject based on their tags
 * @param papers - Array of exam papers
 * @returns Object with subject names as keys and arrays of papers as values
 */
export const groupPapersBySubject = (papers: ExamPaper[]): Record<string, ExamPaper[]> => {
  if (!papers || !Array.isArray(papers)) {
    return {};
  }
  
  return papers.reduce((acc, paper) => {
    const subject = extractSubjectFromTags(paper.tags);
    
    if (!acc[subject]) {
      acc[subject] = [];
    }
    
    acc[subject].push(paper);
    return acc;
  }, {} as Record<string, ExamPaper[]>);
};

/**
 * Gets a list of unique subjects with paper counts
 * @param papers - Array of exam papers
 * @returns Array of Subject objects with name and count properties
 */
export const getSubjects = (papers: ExamPaper[]): Subject[] => {
  if (!papers || !Array.isArray(papers)) {
    return [];
  }
  
  const subjectsMap = papers.reduce((acc, paper) => {
    const subject = extractSubjectFromTags(paper.tags);
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array of objects and sort alphabetically
  return Object.entries(subjectsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};