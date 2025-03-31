/**
 * Role-Based UI Example
 * 
 * This example demonstrates how to create UIs that adapt based on the user's role,
 * using the useExamRoleUI hook.
 */
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart,
  FileText,
  Globe,
  Layers,
  Lock,
  Settings,
  CreditCard,
  PlusCircle,
  Trash
} from 'lucide-react';
import { useExamRoleUI } from '@/features/exams-preparation/rbac';

/**
 * Example dashboard that adapts based on user role
 */
export const RoleBasedExamDashboard: React.FC = () => {
  // Get role-based UI flags
  const {
    showCreateExam,
    showManageExams,
    showManageQuestions,
    showAllResults,
    showAnalytics,
    showPaymentSection,
    isAdmin,
    isInstructor,
    isStudent,
    isLoading
  } = useExamRoleUI();
  
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Determine which tabs to show based on role
  const tabs = [
    { id: 'exams', label: 'Exams', show: true },
    { id: 'results', label: 'My Results', show: true },
    { id: 'management', label: 'Management', show: showManageExams },
    { id: 'analytics', label: 'Analytics', show: showAnalytics },
    { id: 'settings', label: 'Settings', show: isAdmin }
  ].filter(tab => tab.show);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Exam Dashboard</h1>
      
      <Tabs defaultValue={tabs[0]?.id}>
        <TabsList className="mb-6">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="exams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Available to all users */}
            <ExamCard
              title="PCAT Practice Exam"
              description="Comprehensive practice exam for pharmacy school admission test."
              isPremium={false}
            />
            
            <ExamCard
              title="NAPLEX Prep Exam"
              description="Full-length practice for the pharmacy licensing exam."
              isPremium={true}
            />
            
            <ExamCard
              title="Pharmacy Calculations"
              description="Practice calculations commonly used in pharmacy."
              isPremium={false}
            />
            
            {/* Create Exam card - only shown to users who can create exams */}
            {showCreateExam && (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <PlusCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-lg font-medium text-gray-600">Create New Exam</p>
                  <Button className="mt-4">Get Started</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your most recent exam attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResultItem
                    examName="PCAT Practice Exam"
                    score={85}
                    date="March 15, 2025"
                  />
                  <ResultItem
                    examName="Pharmacy Calculations"
                    score={92}
                    date="March 10, 2025"
                  />
                  <ResultItem
                    examName="Pharmaceutical Chemistry"
                    score={78}
                    date="March 5, 2025"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View All Results</Button>
              </CardFooter>
            </Card>
            
            {/* Admin-only section for viewing all results */}
            {showAllResults && (
              <Card className="border-blue-100">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-blue-700">
                    <Globe className="inline-block mr-2 h-5 w-5" />
                    All Student Results
                  </CardTitle>
                  <CardDescription>View and export results for all students</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-4">
                    As an administrator, you have access to view and analyze all student results.
                  </p>
                  <Button>View All Results</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {showManageExams && (
          <TabsContent value="management">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Exams</CardTitle>
                  <CardDescription>Edit, publish, or delete exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ManagementItem 
                      title="PCAT Practice Exam" 
                      status="Published"
                      showEditOptions={true}
                    />
                    <ManagementItem 
                      title="NAPLEX Prep Exam" 
                      status="Draft"
                      showEditOptions={true}
                    />
                    <ManagementItem 
                      title="Pharmacy Calculations" 
                      status="Published"
                      showEditOptions={true}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View All Exams</Button>
                </CardFooter>
              </Card>
              
              {showManageQuestions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Question Bank</CardTitle>
                    <CardDescription>Manage questions used in exams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Create, edit, and organize questions for use in exams.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded bg-gray-50 text-center">
                        <Layers className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium">1,245</p>
                        <p className="text-sm text-gray-500">Total Questions</p>
                      </div>
                      <div className="p-4 border rounded bg-gray-50 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="font-medium">18</p>
                        <p className="text-sm text-gray-500">Categories</p>
                      </div>
                    </div>
                    <Button className="mt-4">Manage Questions</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
        
        {showAnalytics && (
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Performance Analytics</CardTitle>
                  <CardDescription>Insight into exam performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border rounded bg-gray-50 text-center">
                      <p className="text-3xl font-bold text-blue-600">84%</p>
                      <p className="text-sm text-gray-500">Average Score</p>
                    </div>
                    <div className="p-4 border rounded bg-gray-50 text-center">
                      <p className="text-3xl font-bold text-green-600">1,872</p>
                      <p className="text-sm text-gray-500">Total Attempts</p>
                    </div>
                    <div className="p-4 border rounded bg-gray-50 text-center">
                      <p className="text-3xl font-bold text-purple-600">24</p>
                      <p className="text-sm text-gray-500">Active Exams</p>
                    </div>
                  </div>
                  
                  <div className="h-64 bg-gray-100 flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-gray-400" />
                    <p className="ml-2 text-gray-500">Analytics chart would appear here</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Export Report</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Manage global exam settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <SettingsItem
                      icon={Lock}
                      title="Security Settings"
                      description="Configure exam access and security settings"
                    />
                    <SettingsItem
                      icon={Settings}
                      title="Default Exam Settings"
                      description="Set default parameters for new exams"
                    />
                    <SettingsItem
                      icon={Globe}
                      title="API Configuration"
                      description="Configure external API integrations"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {showPaymentSection && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Manage pricing and payment options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <SettingsItem
                        icon={CreditCard}
                        title="Payment Methods"
                        description="Configure accepted payment methods"
                      />
                      <SettingsItem
                        icon={Settings}
                        title="Pricing Tiers"
                        description="Manage subscription and one-time payment options"
                      />
                      <SettingsItem
                        icon={Globe}
                        title="Currency Settings"
                        description="Configure currency and regional settings"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Helper components

interface ExamCardProps {
  title: string;
  description: string;
  isPremium?: boolean;
}

const ExamCard: React.FC<ExamCardProps> = ({ title, description, isPremium }) => {
  return (
    <Card className={isPremium ? 'border-blue-200' : ''}>
      <CardHeader className={isPremium ? 'bg-blue-50 border-b border-blue-100' : ''}>
        <CardTitle className="flex items-center">
          {title}
          {isPremium && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Premium
            </span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Questions: <span className="font-medium text-gray-900">120</span></div>
            <div className="text-sm text-gray-500">Duration: <span className="font-medium text-gray-900">180 min</span></div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Attempts: <span className="font-medium text-gray-900">Unlimited</span></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start Exam</Button>
      </CardFooter>
    </Card>
  );
};

interface ResultItemProps {
  examName: string;
  score: number;
  date: string;
}

const ResultItem: React.FC<ResultItemProps> = ({ examName, score, date }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <div className="font-medium">{examName}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${
          score >= 90 ? 'text-green-600' : 
          score >= 70 ? 'text-blue-600' : 'text-red-600'
        }`}>
          {score}%
        </div>
        <Button variant="link" size="sm" className="p-0">View Details</Button>
      </div>
    </div>
  );
};

interface ManagementItemProps {
  title: string;
  status: 'Published' | 'Draft' | 'Archived';
  showEditOptions: boolean;
}

const ManagementItem: React.FC<ManagementItemProps> = ({ title, status, showEditOptions }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            status === 'Published' ? 'bg-green-100 text-green-800' :
            status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        </div>
      </div>
      {showEditOptions && (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

interface SettingsItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-start p-3 border rounded-md">
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="ml-3">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <div className="ml-auto">
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    </div>
  );
};

export default RoleBasedExamDashboard;
