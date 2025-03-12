import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@/components/ui';
import { 
  FileTextIcon, 
  EyeIcon, 
  EditIcon, 
  ArchiveIcon,
  CheckCircleIcon,
  CircleIcon 
} from 'lucide-react';
import { Exam } from '../../model/standardTypes';
import { examService } from '../../api/core/examService';

/**
 * Component to display a list of exams
 */
const ExamsList: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch exams when component mounts
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedExams = await examService.getPublishedExams();
        setExams(fetchedExams);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Handle exam view
  const handleViewExam = (examId: number) => {
    router.push(`/exams/${examId}`);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircleIcon className="h-3 w-3" /> Published</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary" className="flex items-center gap-1"><CircleIcon className="h-3 w-3" /> Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline" className="flex items-center gap-1"><ArchiveIcon className="h-3 w-3" /> Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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

  if (exams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
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
          <FileTextIcon className="h-5 w-5" />
          Available Exams
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                    {exam.tags?.find(tag => 
                      ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
                    ) || 'Practice'}
                  </TableCell>
                  <TableCell>{exam.questions?.length || 0}</TableCell>
                  <TableCell>{exam.duration} min</TableCell>
                  <TableCell>{getStatusBadge(exam.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewExam(exam.id)}
                      className="h-8 px-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamsList;