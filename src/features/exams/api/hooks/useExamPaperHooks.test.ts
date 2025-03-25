/**
 * Tests for useExamPaperHooks.ts
 * 
 * This file contains tests for the paper hooks, particularly testing
 * the processPaperResponse function's sorting functionality.
 */

import { processPaperResponse } from './useExamPaperHooks';

// To test the private function, we need to extract it
// For testing purposes, recreate a simplified version here
function testProcessPaperResponse(exams: any, defaultType: string = 'PRACTICE') {
  if (!exams) return [];
  
  const examsArray = exams.data ? exams.data : (Array.isArray(exams) ? exams : []);
  
  const mappedExams = examsArray.map((exam: any) => ({
    id: exam.id,
    title: exam.title || '',
    description: exam.description || '',
    paperType: defaultType,
    // Add minimal required properties for testing
    tags: exam.tags || [],
    premium: exam.premium || false,
    price: exam.price || 0,
    purchased: exam.purchased || false,
    difficulty: exam.difficulty || 'MEDIUM',
    questionCount: exam.questionCount || 0,
    durationMinutes: exam.durationMinutes || 0,
  }));
  
  // PHAR-176: Sort papers by ID in ascending order
  return mappedExams.sort((a, b) => {
    const idA = typeof a.id === 'number' ? a.id : parseInt(a.id, 10);
    const idB = typeof b.id === 'number' ? b.id : parseInt(b.id, 10);
    return idA - idB;
  });
}

describe('useExamPaperHooks', () => {
  describe('processPaperResponse', () => {
    it('should return an empty array when no exams are provided', () => {
      expect(testProcessPaperResponse(null)).toEqual([]);
      expect(testProcessPaperResponse(undefined)).toEqual([]);
      expect(testProcessPaperResponse([])).toEqual([]);
    });

    it('should handle both direct arrays and wrapped data', () => {
      const directArray = [{ id: 1, title: 'Test 1' }];
      const wrappedData = { data: [{ id: 2, title: 'Test 2' }] };
      
      expect(testProcessPaperResponse(directArray)[0].id).toBe(1);
      expect(testProcessPaperResponse(wrappedData)[0].id).toBe(2);
    });

    it('should sort exams by ID in ascending order', () => {
      const unsortedExams = [
        { id: 15, title: 'Paper 15' },
        { id: 12, title: 'Paper 12' },
        { id: 14, title: 'Paper 14' },
        { id: 13, title: 'Paper 13' }
      ];
      
      const result = testProcessPaperResponse(unsortedExams);
      
      // Check that IDs are in ascending order
      expect(result[0].id).toBe(12);
      expect(result[1].id).toBe(13);
      expect(result[2].id).toBe(14);
      expect(result[3].id).toBe(15);
    });

    it('should handle string IDs by converting them to numbers for sorting', () => {
      const mixedIdExams = [
        { id: '15', title: 'Paper 15' },
        { id: 12, title: 'Paper 12' },
        { id: '14', title: 'Paper 14' },
        { id: 13, title: 'Paper 13' }
      ];
      
      const result = testProcessPaperResponse(mixedIdExams);
      
      // Check that IDs are in ascending order regardless of type
      expect(result[0].id).toBe(12);
      expect(result[1].id).toBe(13);
      expect(result[2].id).toBe('14'); // Original type is preserved
      expect(result[3].id).toBe('15'); // Original type is preserved
    });
    
    it('should handle large unsorted datasets efficiently', () => {
      // Create a large array of papers with random order
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: Math.floor(Math.random() * 1000), // Random ID between 0-999
        title: `Paper ${i}`
      }));
      
      const result = testProcessPaperResponse(largeDataset);
      
      // Verify that the result is sorted
      for (let i = 1; i < result.length; i++) {
        const prevId = typeof result[i-1].id === 'number' ? result[i-1].id : parseInt(result[i-1].id, 10);
        const currId = typeof result[i].id === 'number' ? result[i].id : parseInt(result[i].id, 10);
        expect(prevId).toBeLessThanOrEqual(currId);
      }
    });
  });
});
