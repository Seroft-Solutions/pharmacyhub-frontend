'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SessionData } from '../types';
import { useAntiSharingStore } from '../store';
import { ComputerIcon, MapPinIcon, ClockIcon, XCircleIcon, BadgeAlertIcon } from 'lucide-react';

interface SessionItemProps {
  session: SessionData;
  onTerminate?: (sessionId: string) => void;
  showControls?: boolean;
}

export const SessionItem: React.FC<SessionItemProps> = ({ 
  session, 
  onTerminate,
  showControls = true,
}) => {
  const { deviceId } = useAntiSharingStore();
  const isCurrentDevice = deviceId === session.deviceId;

  // Format the browser/OS from user agent (simplified version)
  const formatUserAgent = (userAgent: string): string => {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    }

    if (userAgent.includes('Windows')) {
      os = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
      os = 'macOS';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    }

    return `${browser} on ${os}`;
  };

  // Format the login time as "X time ago"
  const formatLoginTime = (loginTime: string): string => {
    try {
      return formatDistanceToNow(new Date(loginTime), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  const handleTerminate = () => {
    if (onTerminate && !isCurrentDevice) {
      onTerminate(session.id);
    }
  };

  return (
    <Card className={isCurrentDevice ? 'border-primary' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <ComputerIcon className="h-4 w-4" />
            {formatUserAgent(session.userAgent)}
            {isCurrentDevice && (
              <Badge variant="default" className="ml-2">
                Current Device
              </Badge>
            )}
          </CardTitle>
          {!session.active && (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span>{session.country || session.ipAddress || 'Unknown location'}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span>Logged in {formatLoginTime(session.loginTime)}</span>
          </div>
          {session.lastActive && (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>Last active {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </CardContent>
      {showControls && (
        <CardFooter className="pt-2 flex justify-between">
          <div className="flex-1">
            {isCurrentDevice ? (
              <span className="text-xs text-muted-foreground">Device ID: {deviceId.substring(0, 8)}...</span>
            ) : (
              <span className="text-xs text-muted-foreground">Session ID: {session.id.substring(0, 8)}...</span>
            )}
          </div>
          {!isCurrentDevice && onTerminate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleTerminate}
                    className="whitespace-nowrap"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Terminate
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Log out this device</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
