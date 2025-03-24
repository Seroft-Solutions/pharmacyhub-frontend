'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  ComputerIcon, 
  SearchIcon, 
  RefreshCwIcon, 
  XCircleIcon, 
  ShieldAlertIcon, 
  KeyIcon
} from 'lucide-react';
import { SessionData, SessionFilterOptions } from '../../anti-sharing/types';
import { SessionList } from '../../anti-sharing/components/SessionList';
import { useAllSessions, useRequireOtpVerification, useTerminateSession } from '../../anti-sharing/api/sessionApiHooks';

export const SessionMonitoring: React.FC = () => {
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState('all');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>(undefined);
  const [filterToDate, setFilterToDate] = useState<Date | undefined>(undefined);
  const [filterActive, setFilterActive] = useState<string>('all');
  
  // Create filter options
  const filterOptions: SessionFilterOptions = {
    userId: filterUserId || undefined,
    fromDate: filterFromDate?.toISOString() || undefined,
    toDate: filterToDate?.toISOString() || undefined,
    active: filterActive === 'active' ? true : filterActive === 'inactive' ? false : undefined,
    suspicious: tabValue === 'suspicious',
  };
  
  // Fetch sessions using the API hook
  const { 
    data: sessions, 
    isLoading, 
    error, 
    refetch,
  } = useAllSessions(filterOptions);
  
  // Mutations for session management
  const { 
    mutateAsync: terminateSession,
    isPending: isTerminating,
  } = useTerminateSession();
  
  const {
    mutateAsync: requireOtp,
    isPending: isRequiringOtp,
  } = useRequireOtpVerification();
  
  // Handle session termination
  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId);
      toast({
        title: 'Session terminated',
        description: 'The session has been successfully terminated.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to terminate the session. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle requiring OTP for a user
  const handleRequireOtp = async (userId: string) => {
    try {
      await requireOtp(userId);
      toast({
        title: 'OTP verification required',
        description: 'The user will be required to verify with OTP on next login.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set OTP requirement. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Group sessions by user ID
  const sessionsByUser = React.useMemo(() => {
    if (!sessions) return {};
    
    return sessions.reduce<Record<string, SessionData[]>>((acc, session) => {
      if (!acc[session.userId]) {
        acc[session.userId] = [];
      }
      acc[session.userId].push(session);
      return acc;
    }, {});
  }, [sessions]);
  
  // Get suspicious sessions
  const suspiciousSessions = React.useMemo(() => {
    if (!sessions) return [];
    
    // Simple detection - users with multiple active sessions
    const userSessionCounts: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.active) {
        userSessionCounts[session.userId] = (userSessionCounts[session.userId] || 0) + 1;
      }
    });
    
    return sessions.filter(session => 
      session.active && userSessionCounts[session.userId] > 1
    );
  }, [sessions]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlertIcon className="h-5 w-5" />
          Session Monitoring
        </CardTitle>
        <CardDescription>
          Monitor and manage user login sessions across devices and locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <ComputerIcon className="h-4 w-4" />
                All Sessions
                {sessions && <Badge variant="outline">{sessions.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="suspicious" className="flex items-center gap-1">
                <ShieldAlertIcon className="h-4 w-4" />
                Suspicious
                {suspiciousSessions && <Badge variant="outline">{suspiciousSessions.length}</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => refetch()}
            >
              <RefreshCwIcon className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Filter by User ID"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                className="w-full"
                prefix={<SearchIcon className="h-4 w-4" />}
              />
            </div>
            <div className="flex flex-1 gap-2">
              <DatePicker
                placeholder="From Date"
                date={filterFromDate}
                onSelect={setFilterFromDate}
                className="flex-1"
              />
              <DatePicker
                placeholder="To Date"
                date={filterToDate}
                onSelect={setFilterToDate}
                className="flex-1"
              />
            </div>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="all" className="mt-4 space-y-6">
            {Object.entries(sessionsByUser).map(([userId, userSessions]) => (
              <div key={userId} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    User ID: {userId} 
                    <Badge className="ml-2" variant="outline">
                      {userSessions.filter(s => s.active).length} active / {userSessions.length} total
                    </Badge>
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequireOtp(userId)}
                      disabled={isRequiringOtp}
                    >
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Require OTP
                    </Button>
                  </div>
                </div>
                <SessionList
                  sessions={userSessions}
                  onTerminate={handleTerminateSession}
                />
                <Separator className="my-4" />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="suspicious" className="mt-4">
            <SessionList
              sessions={suspiciousSessions}
              onTerminate={handleTerminateSession}
              emptyMessage="No suspicious sessions detected."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
