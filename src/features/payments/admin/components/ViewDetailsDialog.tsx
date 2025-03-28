"use client";

import React from 'react';
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCircle,
  MessageCircle,
  Copy,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  CreditCard,
  FileText
} from 'lucide-react';
import PaymentScreenshot from './PaymentScreenshot';
import { 
  formatCurrency, 
  formatDate, 
  getUserDisplayName, 
  generateWhatsAppLink,
  getStatusColor,
  getUserEmail
} from '../utils';

interface ViewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentRequest: any;
  onApprove: (request: any) => void;
  onReject: (request: any) => void;
}

export const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({
  open,
  onOpenChange,
  paymentRequest,
  onApprove,
  onReject
}) => {
  if (!paymentRequest) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Payment Request Details</DialogTitle>
              <DialogDescription>
                Transaction #{paymentRequest.id} • <span className="font-medium">{formatDate(paymentRequest.createdAt)}</span>
              </DialogDescription>
            </div>
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(paymentRequest.status || 'PENDING')}`}>
              {paymentRequest.status || 'Pending'}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="evidence">Payment Evidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-semibold">{formatCurrency(paymentRequest.amount)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Transaction Reference</Label>
                  <div className="flex items-center space-x-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono truncate">
                      {paymentRequest.transactionId || 'N/A'}
                    </code>
                    {paymentRequest.transactionId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(paymentRequest.transactionId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">User Information</Label>
                    <p className="font-medium">{getUserDisplayName(paymentRequest)}</p>
                    <p className="text-sm text-muted-foreground">{getUserEmail(paymentRequest)}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm">{paymentRequest.user?.phoneNumber || paymentRequest.senderNumber || 'No phone number'}</p>
                      {(paymentRequest.user?.phoneNumber || paymentRequest.senderNumber) && (
                        <a
                          href={generateWhatsAppLink(paymentRequest)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                          >
                            <MessageCircle className="h-3 w-3 mr-1 text-green-600" />
                            WhatsApp
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exam Details</Label>
                    <p className="font-medium">{paymentRequest.exam?.title || paymentRequest.examTitle || 'Unknown exam'}</p>
                    <p className="text-sm text-muted-foreground">{paymentRequest.exam?.paperType || 'Standard Exam'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Timeline</Label>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Submitted:</span> 
                        <span className="ml-2">{formatDate(paymentRequest.createdAt)}</span>
                      </div>
                      {paymentRequest.processedAt && (
                        <div>
                          <span className="text-muted-foreground">Processed:</span> 
                          <span className="ml-2">{formatDate(paymentRequest.processedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">User Notes</Label>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {paymentRequest.notes || 'No notes provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="evidence" className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <PaymentScreenshot 
                screenshotData={paymentRequest.screenshotData}
                attachmentUrl={paymentRequest.attachmentUrl}
                className="w-full max-w-md mx-auto"
                title={`Payment Evidence - Transaction #${paymentRequest.id}`}
                description={`Submitted by ${getUserDisplayName(paymentRequest)} on ${formatDate(paymentRequest.createdAt)}`}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          <div className="flex gap-2 order-2 sm:order-1 w-full sm:w-auto">
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onApprove(paymentRequest);
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onReject(paymentRequest);
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="order-1 sm:order-2 w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsDialog;