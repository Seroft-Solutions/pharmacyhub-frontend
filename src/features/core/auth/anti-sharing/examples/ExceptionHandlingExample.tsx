'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SessionExceptionHandler,
  LoginValidationError 
} from '../components';
import { LoginStatus } from '../types';
import { 
  ErrorCategory, 
  ErrorSeverity, 
  SESSION_ERRORS, 
  AUTHENTICATION_ERRORS,
  NETWORK_ERRORS 
} from '../constants/exceptions';

/**
 * Example component to demonstrate the exception handling approach
 */
export const ExceptionHandlingExample: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('session');
  const [isExceptionVisible, setIsExceptionVisible] = useState(false);
  const [selectedError, setSelectedError] = useState('MULTIPLE_ACTIVE_SESSIONS');
  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory>(ErrorCategory.SESSION);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleShowException = (category: ErrorCategory, errorKey: string) => {
    setSelectedCategory(category);
    setSelectedError(errorKey);
    setIsExceptionVisible(true);
  };
  
  const handleAction = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsExceptionVisible(false);
    }, 2000);
  };
  
  const handleCancel = () => {
    setIsExceptionVisible(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exception Handling Demo</CardTitle>
          <CardDescription>
            This demonstrates the new exception handling approach for the anti-sharing feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="session">Session Errors</TabsTrigger>
              <TabsTrigger value="auth">Authentication Errors</TabsTrigger>
              <TabsTrigger value="network">Network Errors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="session" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(SESSION_ERRORS).map((errorKey) => (
                  <Button 
                    key={errorKey}
                    variant="outline" 
                    onClick={() => handleShowException(ErrorCategory.SESSION, errorKey)}
                  >
                    {SESSION_ERRORS[errorKey].message}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="auth" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(AUTHENTICATION_ERRORS).map((errorKey) => (
                  <Button 
                    key={errorKey}
                    variant="outline" 
                    onClick={() => handleShowException(ErrorCategory.AUTHENTICATION, errorKey)}
                  >
                    {AUTHENTICATION_ERRORS[errorKey].message}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="network" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(NETWORK_ERRORS).map((errorKey) => (
                  <Button 
                    key={errorKey}
                    variant="outline" 
                    onClick={() => handleShowException(ErrorCategory.NETWORK, errorKey)}
                  >
                    {NETWORK_ERRORS[errorKey].message}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Legacy vs New Approach</CardTitle>
          <CardDescription>
            Comparing the original LoginValidationError with the new SessionExceptionHandler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original Approach</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsExceptionVisible(true)}
                  className="w-full"
                >
                  Show Too Many Devices Error (Original)
                </Button>
                
                <LoginValidationError
                  isOpen={isExceptionVisible}
                  status={LoginStatus.TOO_MANY_DEVICES}
                  onContinue={handleAction}
                  onCancel={handleCancel}
                  isTerminating={isProcessing}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">New Approach</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsExceptionVisible(true)}
                  className="w-full"
                >
                  Show Too Many Devices Error (New)
                </Button>
                
                <SessionExceptionHandler
                  isOpen={isExceptionVisible}
                  errorCategory={selectedCategory}
                  errorKey={selectedError}
                  onAction={handleAction}
                  onCancel={handleCancel}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
