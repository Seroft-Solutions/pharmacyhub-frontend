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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  FileText, 
  UserCircle, 
  DollarSign,
  ClipboardList 
} from "lucide-react";

// Import the manual payment hooks
import { 
  useManualRequestsByStatus, 
  useApproveManualRequest, 
  useRejectManualRequest 
} from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';

// Formatting helper function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PaymentApprovalsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Fetch pending payment requests using the hook
  const { data: pendingRequests, isLoading, isError, refetch } = useManualRequestsByStatus('PENDING');
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for selected payment request
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Get approve and reject mutation hooks
  const { mutateAsync: approveRequest, isLoading: isApproving } = useApproveManualRequest();
  const { mutateAsync: rejectRequest, isLoading: isRejecting } = useRejectManualRequest();
  
  // Dialog state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  
  // Form state
  const [approveNote, setApproveNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  
  // Process a filtered list of payment requests
  const filteredRequests = pendingRequests?.filter(request => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.id.toString().includes(searchLower) ||
      request.user?.firstName?.toLowerCase().includes(searchLower) ||
      request.user?.lastName?.toLowerCase().includes(searchLower) ||
      request.user?.email?.toLowerCase().includes(searchLower) ||
      request.transactionReference?.toLowerCase().includes(searchLower) ||
      request.exam?.title?.toLowerCase().includes(searchLower)
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
    setApproveNote('');
    setIsApproveOpen(true);
  };
  
  // Open reject dialog
  const handleRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setRejectReason('');
    setIsRejectOpen(true);
  };
  
  // Handle approve payment
  const handleApprovePayment = async () => {
    if (!selectedRequest) return;
    
    try {
      await approveRequest({
        requestId: selectedRequest.id,
        request: {
          adminNote: approveNote || 'Payment approved'
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
  const handleRejectPayment = async () => {
    if (!selectedRequest) return;
    
    try {
      await rejectRequest({
        requestId: selectedRequest.id,
        request: {
          adminNote: rejectReason || 'Payment rejected'
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
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Approvals</h1>
          <p className="text-muted-foreground">
            Manage and review payment requests submitted by users.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests..."
              className="pl-8 w-full md:w-[250px]"
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pending Payment Requests</CardTitle>
          <CardDescription>
            Review and process payment requests awaiting approval.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
              <p className="text-red-600">
                There was an error loading the payment requests. Please try again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <p className="text-muted-foreground">No matching payment requests found</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                  <h3 className="text-xl font-medium text-blue-900">All Caught Up!</h3>
                  <p className="text-blue-700 mt-1">
                    There are no pending payment requests at the moment.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">#{request.id}</TableCell>
                      <TableCell>
                        {request.user ? (
                          <div className="flex flex-col">
                            <span>{`${request.user.firstName} ${request.user.lastName}`}</span>
                            <span className="text-xs text-muted-foreground">{request.user.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown user</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.exam ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{request.exam.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {request.exam.paperType || 'Standard Exam'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown exam</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(request.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span>{formatDate(request.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveDialog(request)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectDialog(request)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            {filteredRequests.length > 0 && (
              <>Showing {filteredRequests.length} pending {filteredRequests.length === 1 ? 'request' : 'requests'}</>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
      
      {/* View Payment Details Dialog */}
      {selectedRequest && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Request Details</DialogTitle>
              <DialogDescription>
                Transaction #{selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">User</Label>
                <div className="col-span-2 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedRequest.user 
                      ? `${selectedRequest.user.firstName} ${selectedRequest.user.lastName}`
                      : 'Unknown user'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-2">
                  {selectedRequest.user?.email || 'N/A'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Exam</Label>
                <div className="col-span-2">
                  {selectedRequest.exam?.title || 'Unknown exam'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Paper Type</Label>
                <div className="col-span-2">
                  {selectedRequest.exam?.paperType || 'Standard Exam'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Amount</Label>
                <div className="col-span-2 font-medium">
                  {formatCurrency(selectedRequest.amount)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Transaction Reference</Label>
                <div className="col-span-2">
                  {selectedRequest.transactionReference || 'N/A'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right">Date Submitted</Label>
                <div className="col-span-2">
                  {formatDate(selectedRequest.createdAt)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-start gap-4">
                <Label className="text-right py-2">User Notes</Label>
                <div className="col-span-2 bg-muted p-2 rounded-md min-h-[60px]">
                  {selectedRequest.userNote || 'No notes provided'}
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewOpen(false);
                    handleApproveDialog(selectedRequest);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsViewOpen(false);
                    handleRejectDialog(selectedRequest);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Approve Payment Dialog */}
      {selectedRequest && (
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Payment</DialogTitle>
              <DialogDescription>
                Confirm approval for transaction #{selectedRequest.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Payment Details</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-blue-700">Amount:</span>
                  <span className="font-medium text-blue-900">{formatCurrency(selectedRequest.amount)}</span>
                  
                  <span className="text-blue-700">User:</span>
                  <span className="text-blue-900">
                    {selectedRequest.user 
                      ? `${selectedRequest.user.firstName} ${selectedRequest.user.lastName}`
                      : 'Unknown user'}
                  </span>
                  
                  <span className="text-blue-700">Transaction:</span>
                  <span className="text-blue-900">{selectedRequest.transactionReference || 'N/A'}</span>
                  
                  <span className="text-blue-700">Exam:</span>
                  <span className="text-blue-900">{selectedRequest.exam?.title || 'Unknown exam'}</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="approveNote">Admin Note (Optional)</Label>
                <Textarea
                  id="approveNote"
                  placeholder="Add a note about this approval (will be visible to admin only)"
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApproveOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprovePayment}
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
      )}
      
      {/* Reject Payment Dialog */}
      {selectedRequest && (
        <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Payment Request</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this payment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Payment Details</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-red-700">Amount:</span>
                  <span className="font-medium text-red-900">{formatCurrency(selectedRequest.amount)}</span>
                  
                  <span className="text-red-700">User:</span>
                  <span className="text-red-900">
                    {selectedRequest.user 
                      ? `${selectedRequest.user.firstName} ${selectedRequest.user.lastName}`
                      : 'Unknown user'}
                  </span>
                  
                  <span className="text-red-700">Transaction:</span>
                  <span className="text-red-900">{selectedRequest.transactionReference || 'N/A'}</span>
                  
                  <span className="text-red-700">Exam:</span>
                  <span className="text-red-900">{selectedRequest.exam?.title || 'Unknown exam'}</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rejectReason">Reason for Rejection <span className="text-red-500">*</span></Label>
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
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleRejectPayment}
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
      )}
    </div>
  );
}