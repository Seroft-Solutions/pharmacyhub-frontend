/**
 * State Management Example
 * 
 * This file demonstrates how to use the exams-preparation state management system
 * with examples for both stores and contexts.
 */

import React, { useState } from 'react';
import {
  // Context providers
  ExamFilterProvider,
  useExamFilter,
  useHasActiveFilters,
  useFilterValues,
  
  // Stores
  useExamStore,
  useExamEditorStore,
  useQuestions,
  useCurrentQuestionIndex,
  useIsDirty,
  
  // Factory utilities (for custom state)
  createExamsContext,
  createExamsStore,
} from '../state';

/**
 * Example 1: Basic Context Usage
 * 
 * This component demonstrates how to use the ExamFilter context
 * for managing filter state.
 */
const ExamFiltersExample = () => {
  // Get filter state and actions from the context
  const { 
    status, 
    difficulty, 
    search, 
    isPremium, 
    setFilter, 
    clearFilters 
  } = useExamFilter();
  
  // Use optimized selector (only rerenders when filter presence changes)
  const hasFilters = useHasActiveFilters();
  
  // Use optimized selector (only rerenders when filter values change)
  const filterValues = useFilterValues();
  
  return (
    <div className="exam-filters p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Exam Filters</h2>
      
      {/* Filter controls */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Search</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={search || ''}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search exams..."
          />
        </div>
        
        <div>
          <label className="block mb-1">Status</label>
          <select
            className="border p-2 w-full"
            value={status || ''}
            onChange={(e) => setFilter('status', e.target.value || undefined)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Difficulty</label>
          <select
            className="border p-2 w-full"
            value={difficulty || ''}
            onChange={(e) => setFilter('difficulty', e.target.value || undefined)}
          >
            <option value="">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={!!isPremium}
              onChange={(e) => setFilter('isPremium', e.target.checked || undefined)}
            />
            Premium Exams Only
          </label>
        </div>
        
        {/* Clear filters button */}
        {hasFilters && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {/* Display active filters */}
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <h3 className="font-bold">Active Filters:</h3>
        <pre className="text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
      </div>
    </div>
  );
};

/**
 * Example 2: Store Usage
 * 
 * This component demonstrates how to use the ExamEditor store
 * for managing exam editing state.
 */
const ExamEditorExample = () => {
  // Use the store for actions
  const {
    addQuestion,
    updateQuestion,
    removeQuestion,
    validateExam,
    setCurrentQuestion,
  } = useExamEditorStore();
  
  // Use optimized selectors for values
  const questions = useQuestions();
  const currentIndex = useCurrentQuestionIndex();
  const isDirty = useIsDirty();
  
  // Helper function to add a question
  const handleAddQuestion = () => {
    addQuestion({
      text: 'New Question',
      type: 'multipleChoice',
      options: [
        { id: `temp-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
        { id: `temp-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
      ],
    });
  };
  
  // Helper function to update question text
  const handleUpdateQuestionText = (index: number, text: string) => {
    updateQuestion(index, { text });
  };
  
  // Helper function to validate
  const handleValidate = () => {
    const isValid = validateExam();
    alert(isValid ? 'Exam is valid!' : 'Exam has validation errors');
  };
  
  return (
    <div className="exam-editor p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Exam Editor</h2>
      
      {/* Action buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
        
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleValidate}
          disabled={!isDirty}
        >
          Validate Exam
        </button>
      </div>
      
      {/* Questions list */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet</p>
        ) : (
          questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`p-3 border rounded ${index === currentIndex ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              <div className="flex justify-between">
                <input
                  type="text"
                  className="border p-1 flex-grow mr-2"
                  value={question.text}
                  onChange={(e) => handleUpdateQuestionText(index, e.target.value)}
                  placeholder="Question text..."
                />
                
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </button>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                {question.type} - {question.options?.length || 0} options
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Example 3: Context and Store Composition
 * 
 * This component demonstrates how to compose multiple state management
 * utilities together in a complete example.
 */
const StateManagementExample = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">State Management Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Context */}
        <div>
          <h2 className="text-xl font-bold mb-4">Context Example</h2>
          <ExamFilterProvider>
            <ExamFiltersExample />
          </ExamFilterProvider>
        </div>
        
        {/* Example 2: Store */}
        <div>
          <h2 className="text-xl font-bold mb-4">Store Example</h2>
          <ExamEditorExample />
        </div>
      </div>
      
      {/* Additional examples can be added here */}
    </div>
  );
};

export default StateManagementExample;
