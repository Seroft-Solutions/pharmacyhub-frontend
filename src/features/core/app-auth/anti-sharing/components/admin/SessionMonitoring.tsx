"use client";

import React, { useState } from 'react';
import { useUserSessions, useTerminateSession, useRequireOtpVerification } from '../../api/sessionApiHooks';
import { SessionData, SessionFilterOptions } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserX, Shield, RefreshCw, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistance } from 'date-fns';
import { SessionFilters } from './SessionFilters';
import { SessionDetails } from './SessionDetails';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionMonitoringProps {
  userId?: string;
  showFilters?: boolean;
}

export const SessionMonitoring: React.FC<SessionMonitoringProps> = ({ 
  userId,
  showFilters = true
}) => {
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [filters, setFilters] = useState<SessionFilterOptions>({
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  
  // Get sessions data
  const { 
    data: sessions = [], 
    isLoading,
    isError,
    refetch
  } = useUserSessions(userId || 'all', filters);
  
  // Terminate session mutation
  const terminateSession = useTerminateSession();
  
  // Require OTP verification mutation
  const requireOtp = useRequireOtpVerification();
  
  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session => 
    session.deviceId.includes(searchTerm) || 
    session.ipAddress.includes(searchTerm) ||
    (session.country && session.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
    session.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle session termination
  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession.mutateAsync(sessionId);
      toast({
        title: "Success",
        description: "Session terminated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };
  
  // Handle requiring OTP verification
  const handleRequireOtp = async (userId: string) => {
    try {
      await requireOtp.mutateAsync(userId);
      toast({
        title: "Success",
        description: "OTP verification will be required on next login",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set OTP requirement",
        variant: "destructive",
      });
    }
  };
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Session Monitoring</CardTitle>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by IP, country, or device..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {showFilters && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedSession(null)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Filters if enabled */}
          {showFilters && !selectedSession && (
            <SessionFilters 
              filters={filters} 
              onFilterChange={setFilters} 
            />
          )}
          
          {/* Session details if selected */}
          {selectedSession ? (
            <SessionDetails 
              session={selectedSession} 
              onBack={() => setSelectedSession(null)}
              onTerminate={() => {
                handleTerminateSession(selectedSession.id);
                setSelectedSession(null);
              }}
              onRequireOtp={() => {
                handleRequireOtp(selectedSession.userId);
                setSelectedSession(null);
              }}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading state
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : isError ? (
                    // Error state
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Error loading sessions. Please try again.
                      </TableCell>
                    </TableRow>
                  ) : filteredSessions.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No sessions found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Sessions list
                    filteredSessions.map((session) => (
                      <TableRow 
                        key={session.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedSession(session)}
                      >
                        <TableCell className="font-mono text-xs">
                          {session.deviceId.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{session.ipAddress}</TableCell>
                        <TableCell>{session.country || 'Unknown'}</TableCell>
                        <TableCell>{formatRelativeTime(session.loginTime)}</TableCell>
                        <TableCell>
                          {session.active ? (
                            <Badge>Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTerminateSession(session.id);
                            }}
                          >
                            <UserX className="h-4 w-4" />
                            <span className="sr-only">Terminate</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRequireOtp(session.userId);
                            }}
                          >
                            <Shield className="h-4 w-4" />
                            <span className="sr-only">Require OTP</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionMonitoring;
