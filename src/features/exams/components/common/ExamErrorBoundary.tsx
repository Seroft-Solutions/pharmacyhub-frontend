'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onExit?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ExamErrorBoundary
 * 
 * A specialized error boundary for the exam feature that provides
 * graceful error handling and recovery options.
 */
export class ExamErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Exam feature error:', error, errorInfo);
    
    // Store errorInfo for potential display
    this.setState({ errorInfo });
    
    // Show a toast notification
    toast.error('An error occurred. Your progress has been saved.');
    
    // Optionally log to an error reporting service
    // reportError(error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleExit = (): void => {
    if (this.props.onExit) {
      this.props.onExit();
    } else {
      // Default exit behavior - navigate to dashboard
      window.location.href = '/dashboard';
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use the default error UI
      return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-red-100">
          <CardHeader className="bg-red-50 text-red-700 border-b border-red-100">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5" />
              An Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-gray-600">
              We've encountered an unexpected error in the exam module. Your progress has been saved.
            </p>
            
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4 overflow-auto max-h-32 text-sm font-mono text-gray-800">
              {this.state.error?.message || 'Unknown error occurred'}
            </div>
            
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Your answers are safe</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      All your answered questions have been automatically saved to the server. 
                      You can safely return to the dashboard and resume later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              You can try refreshing the page or return to the dashboard.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between gap-4 border-t pt-4 bg-gray-50">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={this.handleReset}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={this.handleExit}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Exit Exam
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ExamErrorBoundary;
