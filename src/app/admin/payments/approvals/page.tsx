"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Search } from 'lucide-react';

// Import components from features directory
import { 
  PaymentTable, 
  ViewDetailsDialog,
  ApproveDialog,
  RejectDialog
} from '@/features/payments/admin';

// Import the manual payment hooks
import { 
  useManualRequestsByStatus, 
  useApproveManualRequest, 
  useRejectManualRequest 
} from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';

export default function PaymentApprovalsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Fetch pending payment requests using the hook
  const { data: pendingRequests, isLoading, isError, refetch } = useManualRequestsByStatus('PENDING');
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for selected payment request
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // State for screenshot enlargement
  const [isScreenshotEnlarged, setIsScreenshotEnlarged] = useState(false);
  
  // Get approve and reject mutation hooks
  const { mutateAsync: approveRequest, isLoading: isApproving } = useApproveManualRequest();
  const { mutateAsync: rejectRequest, isLoading: isRejecting } = useRejectManualRequest();
  
  // Dialog state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  
  // Process a filtered list of payment requests
  const filteredRequests = pendingRequests?.filter(request => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.id.toString().includes(searchLower) ||
      (request.user?.firstName || '').toLowerCase().includes(searchLower) ||
      (request.user?.lastName || '').toLowerCase().includes(searchLower) ||
      (request.user?.email || '').toLowerCase().includes(searchLower) ||
      (request.transactionId || '').toLowerCase().includes(searchLower) ||
      (request.exam?.title || '').toLowerCase().includes(searchLower)
    );
  }) || [];
  
  // View payment details
  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsViewOpen(true);
  };
  
  // Open approve dialog
  const handleApproveDialog = (request: any) => {
    setSelectedRequest(request);
    setIsApproveOpen(true);
  };
  
  // Open reject dialog
  const handleRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setIsRejectOpen(true);
  };
  
  // Handle approve payment
  const handleApprovePayment = async (adminNote: string) => {
    if (!selectedRequest) return;
    
    try {
      await approveRequest({
        requestId: selectedRequest.id,
        request: {
          adminNote: adminNote || 'Payment approved'
        }
      });
      
      toast({
        title: 'Payment Approved',
        description: `Payment request #${selectedRequest.id} has been approved successfully.`,
        variant: 'default'
      });
      
      setIsApproveOpen(false);
      refetch();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        title: 'Approval Failed',
        description: 'There was an error approving the payment. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle reject payment
  const handleRejectPayment = async (rejectReason: string) => {
    if (!selectedRequest || !rejectReason) return;
    
    try {
      await rejectRequest({
        requestId: selectedRequest.id,
        request: {
          adminNote: rejectReason
        }
      });
      
      toast({
        title: 'Payment Rejected',
        description: `Payment request #${selectedRequest.id} has been rejected.`,
        variant: 'default'
      });
      
      setIsRejectOpen(false);
      refetch();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast({
        title: 'Rejection Failed',
        description: 'There was an error rejecting the payment. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // View enlarged screenshot
  const handleViewScreenshot = () => {
    setIsScreenshotEnlarged(true);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Approvals</h1>
            <p className="text-muted-foreground mt-1">
              Manage and review payment requests submitted by users.
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 md:min-w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search requests..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {/* Pending Payments Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Pending Payment Requests</h2>
              <p className="text-sm text-muted-foreground">
                Review and process payment requests awaiting approval.
              </p>
            </div>
            {filteredRequests.length > 0 && (
              <div className="bg-yellow-50 text-yellow-800 border border-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} pending
              </div>
            )}
          </div>
          
          <PaymentTable 
            requests={filteredRequests}
            isLoading={isLoading}
            isError={isError}
            searchTerm={searchTerm}
            onView={handleViewDetails}
            onApprove={handleApproveDialog}
            onReject={handleRejectDialog}
            onRefresh={refetch}
            onClearSearch={() => setSearchTerm('')}
          />
          
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dialogs */}
      {selectedRequest && (
        <>
          <ViewDetailsDialog
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            paymentRequest={selectedRequest}
            onApprove={handleApproveDialog}
            onReject={handleRejectDialog}
          />
          
          <ApproveDialog
            open={isApproveOpen}
            onOpenChange={setIsApproveOpen}
            paymentRequest={selectedRequest}
            onApprove={handleApprovePayment}
            isApproving={isApproving}
            onViewScreenshot={handleViewScreenshot}
          />
          
          <RejectDialog
            open={isRejectOpen}
            onOpenChange={setIsRejectOpen}
            paymentRequest={selectedRequest}
            onReject={handleRejectPayment}
            isRejecting={isRejecting}
            onViewScreenshot={handleViewScreenshot}
          />
        </>
      )}
    </div>
  );
}