'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExamContainer } from '../ExamContainer';
import { ExamList } from '../ExamList';
import ExamErrorBoundary from '../components/ExamErrorBoundary';
import { sampleExams } from '../../data/sampleExamData';
import { Exam } from '../../model/mcqTypes';

/**
 * A demo component that showcases the exam feature with sample data
 */
export function ExamFeatureDemo() {
  const [activeTab, setActiveTab] = useState<string>('available');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isExamMode, setIsExamMode] = useState<boolean>(false);

  // Handler for starting an exam
  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsExamMode(true);
  };

  // Handler for exiting an exam
  const handleExitExam = () => {
    setIsExamMode(false);
    setSelectedExam(null);
  };

  // If in exam mode, show the exam
  if (isExamMode && selectedExam) {
    return (
      <ExamErrorBoundary onExit={handleExitExam}>
        <div className="container mx-auto py-6">
          <ExamContainer 
            examId={selectedExam.id} 
            userId="demo-user" 
            onExit={handleExitExam}
          />
        </div>
      </ExamErrorBoundary>
    );
  }

  // Otherwise show the exam list
  return (
    <div className="container mx-auto py-6">
      <Card className="overflow-hidden border border-gray-100 shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl">Pharmacy Exams</CardTitle>
          <CardDescription>
            Practice exams to test your knowledge and prepare for certification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="available">
                Available Exams
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed Exams
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleExams
                  .filter(exam => exam.status === 'PUBLISHED')
                  .map(exam => (
                    <Card key={exam.id} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                            {exam.duration} min
                          </Badge>
                        </div>
                        <CardDescription>{exam.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <div className="flex flex-col gap-4 border-t pt-4 mt-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Total Marks</p>
                              <p className="font-medium">{exam.totalMarks}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Passing Marks</p>
                              <p className="font-medium">{exam.passingMarks}</p>
                            </div>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartExam(exam)}
                          >
                            Start Exam
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="bg-gray-50 border p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium text-gray-700">No Completed Exams</h3>
                <p className="text-gray-500 mt-2">
                  Start an exam to see your results here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ExamFeatureDemo;
