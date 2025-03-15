"use client"

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CircleIcon } from 'lucide-react';
import { PaperType } from '../../types';
import { ExamOperationGuard } from '../guards/ExamGuard';
import { ExamOperation, useExamFeatureAccess } from '../../hooks/useExamFeatureAccess';
import { useExams } from '../../hooks/useExams';

// Import smaller components from common directory
import { 
  ExamsSearch, 
  ExamsTabs, 
  ExamsTable, 
  ExamsPagination, 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '../common';

/**
 * Component to display a list of exams organized by paper type
 * Requires exams feature access with VIEW operation
 */
export const ExamsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);

  // Use our custom hook that handles the ApiResponse structure
  const { exams: allExams, isLoading, error, refetch } = useExams();

  // Use the feature-based access hook
  const { canEditExams } = useExamFeatureAccess();

  // Reset to first page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Filter exams by paper type and search term
  const getFilteredExams = () => {
    // Ensure allExams is always an array
    let filtered = Array.isArray(allExams) ? allExams : [];
    
    // Filter by paper type
    if (activeTab !== 'all') {
      filtered = filtered.filter(exam => {
        if (!exam?.tags) return false;
        return exam.tags.includes(activeTab);
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(exam => 
        exam?.title?.toLowerCase().includes(lowerSearchTerm) || 
        exam?.description?.toLowerCase().includes(lowerSearchTerm) ||
        exam?.tags?.some(tag => tag?.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    return filtered;
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const filtered = getFilteredExams();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const filtered = getFilteredExams();
    return Math.ceil(filtered.length / itemsPerPage);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Count exams by type
  const countExamsByType = (type: string) => {
    if (!Array.isArray(allExams)) return 0;
    
    if (type === 'all') return allExams.length;
    
    return allExams.filter(exam => 
      exam?.tags?.includes(type)
    ).length;
  };

  // Render table content for each tab
  const renderTableContent = (tab: string) => {
    const currentExams = getCurrentPageItems();
    
    return (
      <div className="space-y-4">
        <ExamsTable 
          exams={currentExams} 
          canEditExams={canEditExams} 
        />
        
        <ExamsPagination 
          currentPage={currentPage}
          totalPages={getTotalPages()}
          onPageChange={handlePageChange}
        />
      </div>
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!allExams || allExams.length === 0) {
    return <EmptyState />;
  }

  return (
    <ExamOperationGuard 
      operation={ExamOperation.VIEW}
      fallback={
        <Card className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <CircleIcon className="h-4 w-4" />
            <span className="font-medium">You don't have permission to view exams</span>
          </div>
        </Card>
      }
    >
      <div className="space-y-6">
        {/* Search input */}
        <ExamsSearch 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm}
        />
        
        {/* Tabs and content */}
        <ExamsTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          renderContent={renderTableContent}
          countByType={countExamsByType}
        />
      </div>
    </ExamOperationGuard>
  );
};
