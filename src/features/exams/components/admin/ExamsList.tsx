"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArchiveIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  CircleIcon, 
  EditIcon, 
  EyeIcon, 
  FileTextIcon, 
  GraduationCapIcon, 
  ListTodoIcon 
} from 'lucide-react';
import { PaperType, Exam } from '../../types/StandardTypes';
import { examService } from '../../api/core/examService';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPaperTypeLabel } from '../../utils/paperTypeUtils';

/**
 * Component to display a list of exams organized by paper type
 */
const ExamsList: React.FC = () => {
  const router = useRouter();
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    // Fetch exams when component mounts
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedExams = await examService.getPublishedExams();
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

  // Filter exams by paper type
  const getExamsByType = (type: string | null) => {
    if (!type || type === 'all') {
      return allExams;
    }
    
    return allExams.filter(exam => {
      if (!exam.tags) return false;
      return exam.tags.includes(type);
    });
  };

  // Handle exam view
  const handleViewExam = (examId: number) => {
    router.push(`/admin/exams/${examId}/questions`);
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

  const renderExamTable = (exams: Exam[]) => {
    if (exams.length === 0) {
      return (
        <div className="text-center py-8">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
          <h3 className="text-lg font-medium mb-2">No exams found</h3>
          <p className="text-muted-foreground mb-4">
            No exams in this category yet.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map(exam => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>
                  {getPaperTypeLabel(exam.tags?.find(tag =>
                    ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
                  ) || PaperType.PRACTICE)}
                </TableCell>
                <TableCell>{exam.questions?.length || 0}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell>{getStatusBadge(exam.status)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewExam(exam.id)}
                    className="h-8 px-2"
                    title="Edit questions"
                  >
                    <EditIcon className="h-4 w-4 mr-1"/>
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allExams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
          <h3 className="text-lg font-medium mb-2">No exams found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first exam using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5"/>
          Available Exams
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>All</span>
              <Badge variant="secondary" className="ml-1">
                {allExams.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={PaperType.PRACTICE} className="flex items-center gap-2">
              <ListTodoIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
              <Badge variant="secondary" className="ml-1">
                {getExamsByType(PaperType.PRACTICE).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={PaperType.MODEL} className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Model</span>
              <Badge variant="secondary" className="ml-1">
                {getExamsByType(PaperType.MODEL).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={PaperType.PAST} className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Past</span>
              <Badge variant="secondary" className="ml-1">
                {getExamsByType(PaperType.PAST).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={PaperType.SUBJECT} className="flex items-center gap-2">
              <GraduationCapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Subject</span>
              <Badge variant="secondary" className="ml-1">
                {getExamsByType(PaperType.SUBJECT).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderExamTable(allExams)}
          </TabsContent>

          <TabsContent value={PaperType.PRACTICE}>
            {renderExamTable(getExamsByType(PaperType.PRACTICE))}
          </TabsContent>

          <TabsContent value={PaperType.MODEL}>
            {renderExamTable(getExamsByType(PaperType.MODEL))}
          </TabsContent>

          <TabsContent value={PaperType.PAST}>
            {renderExamTable(getExamsByType(PaperType.PAST))}
          </TabsContent>

          <TabsContent value={PaperType.SUBJECT}>
            {renderExamTable(getExamsByType(PaperType.SUBJECT))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExamsList;