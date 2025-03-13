"use client"

import React, { useEffect, useState } from 'react';
import { PermissionGuard, AllPermissionsGuard, AnyPermissionGuard } from '@/features/rbac/ui';
import { ExamPermission } from '@/features/exams/constants/permissions';
import { useExamPermissions } from '@/features/exams/hooks/useExamPermissions';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArchiveIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  CircleIcon, 
  EditIcon,
  FileTextIcon, 
  GraduationCapIcon, 
  ListTodoIcon,
  InfoIcon
} from 'lucide-react';
import { PaperType, Exam } from '../../types/StandardTypes';
import { examServiceAdapter } from '../../api/adapter';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPaperTypeLabel } from '../../utils/paperTypeUtils';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Component to display a list of exams organized by paper type
 */
/**
 * Component to display a list of exams organized by paper type
 * Requires 'exams:view' permission
 */
const ExamsList: React.FC = () => {
  const router = useRouter();
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    // Fetch exams when component mounts
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedExams = await examServiceAdapter.getPublishedExams();
        setAllExams(fetchedExams);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Reset to first page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Filter exams by paper type and search term
  const getFilteredExams = () => {
    let filtered = allExams;
    
    // Filter by paper type
    if (activeTab !== 'all') {
      filtered = filtered.filter(exam => {
        if (!exam.tags) return false;
        return exam.tags.includes(activeTab);
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(lowerSearchTerm) || 
        exam.description?.toLowerCase().includes(lowerSearchTerm) ||
        exam.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
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
    return Math.ceil(getFilteredExams().length / itemsPerPage);
  };

  // Permission checks
  const { hasPermission, canManageExams } = useExamPermissions();

  // Handle exam view/edit
  const handleEditExam = (examId: number) => {
    if (hasPermission(ExamPermission.EDIT_EXAM)) {
      router.push(`/admin/exams/${examId}/questions`);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircleIcon
          className="h-3 w-3"/> Published</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary" className="flex items-center gap-1"><CircleIcon
          className="h-3 w-3"/> Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline" className="flex items-center gap-1"><ArchiveIcon className="h-3 w-3"/> Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Count exams by type
  const countExamsByType = (type: string) => {
    if (type === 'all') return allExams.length;
    
    return allExams.filter(exam => 
      exam.tags?.includes(type)
    ).length;
  };

  // Function to safely truncate text
  const truncateText = (text?: string, maxLength: number = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Extract metadata from tags
  const extractMetadata = (exam: Exam) => {
    if (!exam.tags) return {};
    
    const metadata: Record<string, string> = {};
    
    exam.tags.forEach(tag => {
      if (tag.includes(':')) {
        const [key, value] = tag.split(':');
        metadata[key] = value;
      }
    });
    
    return metadata;
  };

  // Get paper type icon
  const getPaperTypeIcon = (paperType: string) => {
    switch (paperType) {
      case PaperType.PRACTICE:
        return <ListTodoIcon className="h-4 w-4" />;
      case PaperType.MODEL:
        return <BookOpenIcon className="h-4 w-4" />;
      case PaperType.PAST:
        return <CalendarIcon className="h-4 w-4" />;
      case PaperType.SUBJECT:
        return <GraduationCapIcon className="h-4 w-4" />;
      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  // Get metadata display
  const getMetadataDisplay = (exam: Exam) => {
    const metadata = extractMetadata(exam);
    const paperType = exam.tags?.find(tag => 
      Object.values(PaperType).includes(tag as PaperType)
    ) as PaperType || PaperType.PRACTICE;
    
    // Create type-specific metadata display
    switch (paperType) {
      case PaperType.PRACTICE:
        return (
          <div className="flex flex-wrap gap-1">
            {metadata.focusArea && (
              <Badge variant="outline" className="text-xs">
                Focus: {metadata.focusArea}
              </Badge>
            )}
            {metadata.skillLevel && (
              <Badge variant="outline" className="text-xs">
                Level: {metadata.skillLevel}
              </Badge>
            )}
          </div>
        );
      
      case PaperType.MODEL:
        return (
          <div className="flex flex-wrap gap-1">
            {metadata.creator && (
              <Badge variant="outline" className="text-xs">
                Creator: {metadata.creator}
              </Badge>
            )}
            {metadata.difficulty && (
              <Badge variant="outline" className="text-xs">
                Difficulty: {metadata.difficulty}
              </Badge>
            )}
          </div>
        );
      
      case PaperType.PAST:
        return (
          <div className="flex flex-wrap gap-1">
            {metadata.year && (
              <Badge variant="outline" className="text-xs">
                Year: {metadata.year}
              </Badge>
            )}
            {metadata.institution && (
              <Badge variant="outline" className="text-xs">
                Institution: {metadata.institution}
              </Badge>
            )}
            {metadata.month && (
              <Badge variant="outline" className="text-xs">
                Month: {metadata.month}
              </Badge>
            )}
          </div>
        );
      
      case PaperType.SUBJECT:
        return (
          <div className="flex flex-wrap gap-1">
            {metadata.subject && (
              <Badge variant="outline" className="text-xs">
                Subject: {metadata.subject}
              </Badge>
            )}
            {metadata.topic && (
              <Badge variant="outline" className="text-xs">
                Topic: {metadata.topic}
              </Badge>
            )}
            {metadata.academicLevel && (
              <Badge variant="outline" className="text-xs">
                Level: {metadata.academicLevel}
              </Badge>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderExamTable = (exams: Exam[]) => {
    if (exams.length === 0) {
      return (
        <div className="text-center py-8">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
          <h3 className="text-lg font-medium mb-2">No exams found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No exams match your search criteria.' : 'No exams in this category yet.'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Metadata</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map(exam => {
                // Get paper type
                const paperType = exam.tags?.find(tag =>
                  ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
                ) || PaperType.PRACTICE;
                
                // Get paper type icon
                const paperTypeIcon = getPaperTypeIcon(paperType);
                
                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{truncateText(exam.description)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {paperTypeIcon}
                        <span className="ml-1">{getPaperTypeLabel(paperType)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getMetadataDisplay(exam)}
                    </TableCell>
                    <TableCell>{exam.questions?.length || 0}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell className="text-right">
                      <PermissionGuard permission={ExamPermission.EDIT_EXAM}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditExam(exam.id)}
                                className="h-8 px-2"
                              >
                                <EditIcon className="h-4 w-4 mr-1"/>
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit questions and metadata</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </PermissionGuard>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {getTotalPages() > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                .filter(page => (
                  page === 1 || 
                  page === getTotalPages() || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ))
                .map((page, index, array) => {
                  // Add ellipsis
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < getTotalPages()) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === getTotalPages() ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 border border-red-200 rounded-md">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (allExams.length === 0) {
    return (
      <div className="text-center py-8">
        <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
        <h3 className="text-lg font-medium mb-2">No exams found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first exam using the upload form.
        </p>
      </div>
    );
  }

  const currentExams = getCurrentPageItems();

  return (
    <PermissionGuard 
      permission={ExamPermission.VIEW_EXAMS}
      fallback={
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4"/>
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You don't have permission to view exams</AlertDescription>
        </Alert>
      }
    >
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative w-full max-w-md">
        <Input
          placeholder="Search exams..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
        <FileTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" />
            <span>All</span>
            <Badge variant="secondary" className="ml-1">
              {countExamsByType('all')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value={PaperType.PRACTICE} className="flex items-center gap-2">
            <ListTodoIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Practice</span>
            <Badge variant="secondary" className="ml-1">
              {countExamsByType(PaperType.PRACTICE)}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value={PaperType.MODEL} className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Model</span>
            <Badge variant="secondary" className="ml-1">
              {countExamsByType(PaperType.MODEL)}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value={PaperType.PAST} className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Past</span>
            <Badge variant="secondary" className="ml-1">
              {countExamsByType(PaperType.PAST)}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value={PaperType.SUBJECT} className="flex items-center gap-2">
            <GraduationCapIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Subject</span>
            <Badge variant="secondary" className="ml-1">
              {countExamsByType(PaperType.SUBJECT)}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderExamTable(currentExams)}
        </TabsContent>

        <TabsContent value={PaperType.PRACTICE}>
          {renderExamTable(currentExams)}
        </TabsContent>

        <TabsContent value={PaperType.MODEL}>
          {renderExamTable(currentExams)}
        </TabsContent>

        <TabsContent value={PaperType.PAST}>
          {renderExamTable(currentExams)}
        </TabsContent>

        <TabsContent value={PaperType.SUBJECT}>
          {renderExamTable(currentExams)}
        </TabsContent>
      </Tabs>
    </div>
  );
    </PermissionGuard>
  );
};

export default ExamsList;