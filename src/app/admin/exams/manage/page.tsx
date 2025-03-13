"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JsonExamUploader, PaperTypeManager, ExamsList } from '@/features/exams/components/admin';
import { BookOpenIcon, ListIcon, UploadIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * Admin page for paper management
 */
export default function ManageExamsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('papers');

  // Handle direct navigation to specific tabs via URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['papers', 'upload', 'paperTypes'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/admin/exams/manage${value !== 'papers' ? `?tab=${value}` : ''}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-bold">Exam Management</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              All Papers
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              Upload New Papers
            </TabsTrigger>
            <TabsTrigger value="paperTypes" className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              Paper Types
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers">
            <Card>
              <CardHeader>
                <CardTitle>Available Papers</CardTitle>
              </CardHeader>
              <CardContent>
                <ExamsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload JSON Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Upload MCQ questions from JSON files, maintaining consistent structure while capturing metadata 
                  appropriate for each paper type.
                </p>
                <div className="mt-4">
                  <JsonExamUploader />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="paperTypes">
            <PaperTypeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}