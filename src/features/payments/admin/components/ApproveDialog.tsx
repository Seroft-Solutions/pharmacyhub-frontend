"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  CheckCircle2,
  DollarSign,
  ExternalLink,
  User,
  CreditCard,
  FileTextIcon
} from 'lucide-react';
import PaymentScreenshot from './PaymentScreenshot';
import { formatCurrency, formatDate, getUserDisplayName } from '../utils';

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: any;
  onApprove: (note: string) => Promise<void>;
  isApproving: boolean;
  onViewScreenshot: () => void;
}

export const ApproveDialog: React.FC<ApproveDialogProps> = ({
  open,
  onOpenChange,
  paymentRequest,
  onApprove,
  isApproving,
  onViewScreenshot
}) => {
  const [approveNote, setApproveNote] = useState('');
  
  if (!paymentRequest) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Approve Payment
          </DialogTitle>
          <DialogDescription>
            Confirm approval for transaction #{paymentRequest.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <PaymentScreenshot 
                screenshotData={paymentRequest.screenshotData}
                attachmentUrl={paymentRequest.attachmentUrl}
                paymentId={paymentRequest.id}
                className="h-full w-full"
                title={`Payment evidence #${paymentRequest.id}`}
                description="Evidence of payment for approval"
              />
            </div>
            
            <div className="w-full sm:w-2/3 space-y-3">
              <div className="bg-green-50 rounded-lg border border-green-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Payment Summary</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <div className="text-green-700">Amount:</div>
                  <div className="font-medium text-green-900">{formatCurrency(paymentRequest.amount)}</div>
                  
                  <div className="text-green-700">Reference:</div>
                  <div className="text-green-900 truncate">{paymentRequest.transactionId || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-start gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">User:</span>
                </div>
                <div>{getUserDisplayName(paymentRequest.user)}</div>
                
                <div className="flex items-start gap-1">
                  <FileTextIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">Exam:</span>
                </div>
                <div>{paymentRequest.exam?.title || 'Unknown exam'}</div>
                
                <div className="flex items-start gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">Date:</span>
                </div>
                <div>{formatDate(paymentRequest.createdAt)}</div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={onViewScreenshot}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Full Image
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="approveNote">Admin Note (Optional)</Label>
            <Textarea
              id="approveNote"
              placeholder="Add a note about this approval (will be visible to admin only)"
              value={approveNote}
              onChange={(e) => setApproveNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-2 sm:order-1"
            onClick={() => onApprove(approveNote)}
            disabled={isApproving}
          >
            {isApproving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Confirm Approval
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveDialog;