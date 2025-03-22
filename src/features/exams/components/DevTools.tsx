'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BugIcon } from 'lucide-react';

interface DevToolsProps {
  questionData?: any;
  apiResponse?: any;
}

/**
 * Development only component to help debug exam-related issues
 */
export function DevTools({ questionData, apiResponse }: DevToolsProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Format JSON data for display
  const formatData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return `Error formatting data: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };
  
  // Toggle visibility with Alt+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isVisible) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="fixed bottom-4 right-4 bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
        onClick={() => setIsVisible(true)}
      >
        <BugIcon className="h-4 w-4 mr-1" />
        Show DevTools
      </Button>
    );
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg border-2 border-yellow-500">
      <CardHeader className="bg-yellow-100 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-yellow-800">
            <BugIcon className="h-4 w-4 inline mr-1" />
            Exam DevTools
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-yellow-800 hover:text-yellow-900 hover:bg-yellow-200"
            onClick={() => setIsVisible(false)}
          >
            Hide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="question">
          <TabsList className="w-full">
            <TabsTrigger value="question" className="flex-1">Question</TabsTrigger>
            <TabsTrigger value="api" className="flex-1">API Response</TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="m-0">
            <ScrollArea className="h-64 w-full">
              <pre className="p-4 text-xs bg-gray-50 rounded">
                {formatData(questionData)}
              </pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="api" className="m-0">
            <ScrollArea className="h-64 w-full">
              <pre className="p-4 text-xs bg-gray-50 rounded">
                {formatData(apiResponse)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}