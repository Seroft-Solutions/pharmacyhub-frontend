"use client"

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { JsonExamUploader, PaperTypeManager } from '@/features/exams/components/admin';
import { ExamsList } from '@/features/exams/components/admin/ExamsList';
import {BookOpenIcon, ListIcon, SettingsIcon, UploadIcon} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';

/**
 * Admin page for comprehensive exam management
 */
export default function ManageExamsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('papers');

  // Handle direct navigation to specific tabs via URL query params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['papers', 'upload', 'paperTypes', 'settings'].includes(tabParam)) {
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
              <ListIcon className="h-4 w-4"/>
              Available Papers
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4"/>
              Upload New Exam
            </TabsTrigger>
            <TabsTrigger value="paperTypes" className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4"/>
              Paper Types
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4"/>
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers">
            <Card>
              <CardHeader>
                <CardTitle>Available Exams</CardTitle>
              </CardHeader>
              <CardContent>
                <ExamsList/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Upload MCQ questions from JSON files, maintaining consistent structure while capturing metadata
                  appropriate for each paper type.
                </p>
                <div className="mt-4">
                  <JsonExamUploader/>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paperTypes">
            <PaperTypeManager/>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Default Exam Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure default settings for new exams
                      </p>
                      <div className="border rounded-md p-4 mt-2">
                        <p className="text-sm text-muted-foreground">
                          Settings options will be available in a future update.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Exam Export Options</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure export formats and options
                      </p>
                      <div className="border rounded-md p-4 mt-2">
                        <p className="text-sm text-muted-foreground">
                          Export options will be available in a future update.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
