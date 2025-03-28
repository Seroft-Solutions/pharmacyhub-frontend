"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  XCircle,
  ExternalLink,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import PaymentScreenshot from './PaymentScreenshot';
import { formatCurrency, getUserDisplayName, generateWhatsAppLink } from '../utils';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: any;
  onReject: (reason: string) => Promise<void>;
  isRejecting: boolean;
  onViewScreenshot: () => void;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  onOpenChange,
  paymentRequest,
  onReject,
  isRejecting,
  onViewScreenshot
}) => {
  const [rejectReason, setRejectReason] = useState('');
  
  if (!paymentRequest) return null;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Reject Payment Request
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The user will be notified of the rejection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Payment Information</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
              <span className="text-red-700">Amount:</span>
              <span className="font-medium text-red-900">{formatCurrency(paymentRequest.amount)}</span>
              
              <span className="text-red-700">User:</span>
              <span className="text-red-900">
                {getUserDisplayName(paymentRequest.user)}
              </span>
              
              <span className="text-red-700">Transaction:</span>
              <span className="text-red-900 truncate">{paymentRequest.transactionId || 'N/A'}</span>
              
              <span className="text-red-700">Exam:</span>
              <span className="text-red-900">{paymentRequest.exam?.title || 'Unknown exam'}</span>
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="w-16 h-16 flex-shrink-0">
                <PaymentScreenshot 
                  screenshotData={paymentRequest.screenshotData}
                  attachmentUrl={paymentRequest.attachmentUrl}
                  paymentId={paymentRequest.id}
                  className="h-full w-full rounded"
                  isViewable={false}
                  title={`Payment evidence #${paymentRequest.id}`}
                  description="Evidence of payment for rejection"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={onViewScreenshot}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Evidence
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="rejectReason" className="flex items-center">
              Reason for Rejection 
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="rejectReason"
              placeholder="Please provide a reason for rejecting this payment (will be shared with the user)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              required
              className={rejectReason ? '' : 'border-red-300'}
            />
            {!rejectReason && (
              <p className="text-sm text-red-500">A reason is required when rejecting a payment</p>
            )}
          </div>
          
          <div className="flex justify-between items-center gap-2 mt-3">
            <div className="text-sm text-muted-foreground">
              Need more details?
            </div>
            <a 
              href={generateWhatsAppLink(paymentRequest)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-200 hover:bg-green-50"
              >
                <Smartphone className="h-4 w-4 mr-1 text-green-600" /> 
                Contact on WhatsApp
              </Button>
            </a>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => onReject(rejectReason)}
            disabled={isRejecting || !rejectReason}
          >
            {isRejecting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              'Confirm Rejection'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectDialog;