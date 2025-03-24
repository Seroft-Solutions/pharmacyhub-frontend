"use client";

import React from 'react';
import { SessionData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserX, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import UAParser from 'ua-parser-js';

interface SessionDetailsProps {
  session: SessionData;
  onBack: () => void;
  onTerminate: () => void;
  onRequireOtp: () => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({
  session,
  onBack,
  onTerminate,
  onRequireOtp
}) => {
  // Parse user agent for better display
  const uaParser = new UAParser(session.userAgent);
  const browser = uaParser.getBrowser();
  const os = uaParser.getOS();
  const device = uaParser.getDevice();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPpp'); // e.g., "Apr 29, 2023, 1:15 PM"
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to list
          </Button>
          
          {session.active ? (
            <Badge>Active</Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          )}
        </div>
        <CardTitle>Session Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Device ID</h3>
            <p className="font-mono text-sm">{session.deviceId}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
            <div className="flex items-center space-x-2">
              <p>{session.ipAddress}</p>
              <a 
                href={`https://whatismyipaddress.com/ip/${session.ipAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Lookup IP</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
            <p>{session.country || 'Unknown'}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Login Time</h3>
            <p>{formatDate(session.loginTime)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Device Information</h3>
          <div className="bg-muted p-3 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground">Browser:</span> 
                <span className="text-sm ml-2">{browser.name} {browser.version}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">OS:</span> 
                <span className="text-sm ml-2">{os.name} {os.version}</span>
              </div>
            </div>
            {device.vendor && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">Device:</span> 
                <span className="text-sm ml-2">{device.vendor} {device.model} {device.type}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">User Agent</h3>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs font-mono break-all">{session.userAgent}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onRequireOtp}
        >
          <Shield className="h-4 w-4 mr-2" />
          Require OTP
        </Button>
        <Button 
          variant="destructive"
          onClick={onTerminate}
        >
          <UserX className="h-4 w-4 mr-2" />
          Terminate Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionDetails;
