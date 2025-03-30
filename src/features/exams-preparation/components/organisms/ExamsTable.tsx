// ExamsTable.tsx
"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/core/ui/atoms/table";
import { Button } from '@/features/core/ui/atoms/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { ExamStatusBadge } from '../atoms/ExamStatusBadge';
import { formatTimeVerbose } from '@/features/exams-preparation/utils';

export interface ExamTableItem {
  id: string;
  title: string;
  questionsCount: number;
  durationMinutes: number;
  status: 'draft' | 'published' | 'archived' | 'completed' | 'in-progress';
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ExamsTableProps {
  exams: ExamTableItem[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const ExamsTable: React.FC<ExamsTableProps> = ({
  exams,
  onView,
  onEdit,
  onDelete,
  className = '',
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            {(exams[0]?.createdAt || exams[0]?.updatedAt) && (
              <TableHead>Date</TableHead>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">
                {exam.title}
                {exam.isPremium && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Premium
                  </span>
                )}
              </TableCell>
              <TableCell>{exam.questionsCount}</TableCell>
              <TableCell>{formatTimeVerbose(exam.durationMinutes * 60)}</TableCell>
              <TableCell>
                <ExamStatusBadge status={exam.status} size="sm" />
              </TableCell>
              {(exam.createdAt || exam.updatedAt) && (
                <TableCell>
                  {exam.updatedAt ? formatDate(exam.updatedAt) : formatDate(exam.createdAt)}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(exam.id)}
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(exam.id)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(exam.id)}
                      title="Delete"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExamsTable;
