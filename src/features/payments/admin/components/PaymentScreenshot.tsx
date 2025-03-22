"use client";

import React, { useState, useEffect } from 'react';
import { ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentScreenshotProps {
  screenshotData?: string;
  attachmentUrl?: string;
  className?: string;
  isViewable?: boolean;
  title?: string;
  description?: string;
}

export const PaymentScreenshot: React.FC<PaymentScreenshotProps> = ({ 
  screenshotData, 
  attachmentUrl, 
  className = '',
  isViewable = true,
  title = "Payment Screenshot",
  description = "Verification evidence"
}) => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to use base64 data first if available
      if (screenshotData) {
        // Check if it already has the data URL prefix
        if (screenshotData.startsWith('data:image')) {
          setScreenshotUrl(screenshotData);
        } else {
          // Add the data URL prefix
          setScreenshotUrl(`data:image/jpeg;base64,${screenshotData}`);
        }
      } 
      // Fall back to attachment URL if available
      else if (attachmentUrl) {
        setScreenshotUrl(attachmentUrl);
      } else {
        setScreenshotUrl(null);
        setError('No screenshot available');
      }
    } catch (err) {
      console.error('Error processing screenshot:', err);
      setError('Error loading screenshot');
      setScreenshotUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [screenshotData, attachmentUrl]);
  
  if (isLoading) {
    return (
      <div className={`${className} w-full relative`}>
        <AspectRatio ratio={3/4} className="bg-muted rounded-md overflow-hidden">
          <Skeleton className="h-full w-full" />
        </AspectRatio>
      </div>
    );
  }
  
  if (error || !screenshotUrl) {
    return (
      <Card className={`${className} w-full`}>
        <CardContent className="flex flex-col items-center justify-center p-6 h-full">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">{error || 'No screenshot available'}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className={`${className} group relative overflow-hidden rounded-md border bg-background`}>
        <AspectRatio ratio={3/4} className="bg-muted">
          <img
            src={screenshotUrl}
            alt="Payment screenshot"
            className="object-cover h-full w-full transition-all"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Error loading image');
              setIsLoading(false);
            }}
          />
        </AspectRatio>
        
        {isViewable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setIsEnlarged(true)}
              className="shadow-lg"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        )}
      </div>
      
      {isViewable && (
        <Dialog open={isEnlarged} onOpenChange={setIsEnlarged}>
          <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            
            <div className="flex justify-center items-center py-4">
              <img
                src={screenshotUrl}
                alt="Payment screenshot"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEnlarged(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PaymentScreenshot;