"use client";

import React from 'react';
import { SessionMonitoring } from '@/features/core/auth/anti-sharing/components/admin';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SessionMonitoringPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Session Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and manage user sessions to prevent account sharing
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <SessionMonitoring />
        </TabsContent>
        
        <TabsContent value="active">
          <SessionMonitoring
            filters={{ active: true }}
            showFilters={false}
          />
        </TabsContent>
        
        <TabsContent value="suspicious">
          <SessionMonitoring
            filters={{ suspicious: true }}
            showFilters={false}
          />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What is Account Sharing?</CardTitle>
            <CardDescription>
              Account sharing occurs when multiple people use the same credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The system tracks sessions by device ID, IP address, and browser fingerprint.
              Suspicious activity may include:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Multiple active sessions from different locations</li>
              <li>Rapid switching between devices</li>
              <li>Inconsistent login patterns</li>
              <li>Geographical anomalies</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>
              Actions you can take to manage user sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Terminate Session:</strong> End a specific session, forcing the user to log in again.</li>
              <li><strong>Require OTP:</strong> Force the user to verify their identity via OTP on their next login attempt.</li>
              <li><strong>View Details:</strong> Check browser, OS, device, and geographical information.</li>
              <li><strong>Filter Sessions:</strong> Focus on active, suspicious, or specific date ranges.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
