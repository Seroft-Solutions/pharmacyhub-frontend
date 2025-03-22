'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, InfoIcon, ImageIcon, ExternalLinkIcon, SendIcon } from 'lucide-react';
import { 
  useAllManualRequests, 
  useManualRequestsByStatus,
  useApproveManualRequest,
  useRejectManualRequest
} from '../../api/hooks/useManualPaymentApiHooks';
import { ManualPaymentResponseDTO } from '../../types';
import Image from 'next/image';

export const ManualPaymentsAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ManualPaymentResponseDTO | null>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [screenshotDialog, setScreenshotDialog] = useState(false);
  const [screenshotUrls, setScreenshotUrls] = useState<Record<number, string>>({});
  
  // Queries
  const { data: allRequests, isLoading: isLoadingAll, refetch: refetchAll } = useAllManualRequests();
  const { data: pendingRequests, isLoading: isLoadingPending, refetch: refetchPending } = useManualRequestsByStatus('PENDING');
  const { data: approvedRequests, isLoading: isLoadingApproved, refetch: refetchApproved } = useManualRequestsByStatus('APPROVED');
  const { data: rejectedRequests, isLoading: isLoadingRejected, refetch: refetchRejected } = useManualRequestsByStatus('REJECTED');
  
  // Mutations
  const { mutate: approveRequest, isLoading: isApproving } = useApproveManualRequest();
  const { mutate: rejectRequest, isLoading: isRejecting } = useRejectManualRequest();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleApprove = () => {
    if (!selectedRequest) return;
    
    approveRequest(
      {
        requestId: selectedRequest.id,
        request: { adminNotes }
      },
      {
        onSuccess: () => {
          setApprovalDialog(false);
          setAdminNotes('');
          refetchAll();
          refetchPending();
          refetchApproved();
          toast({
            title: "Payment approved",
            description: `Payment for ${selectedRequest.examTitle} has been approved.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to approve payment",
            description: error.message || 'Please try again.',
            variant: "destructive"
          });
        }
      }
    );
  };
  
  const handleReject = () => {
    if (!selectedRequest) return;
    
    rejectRequest(
      {
        requestId: selectedRequest.id,
        request: { adminNotes }
      },
      {
        onSuccess: () => {
          setRejectionDialog(false);
          setAdminNotes('');
          refetchAll();
          refetchPending();
          refetchRejected();
          toast({
            title: "Payment rejected",
            description: `Payment for ${selectedRequest.examTitle} has been rejected.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to reject payment",
            description: error.message || 'Please try again.',
            variant: "destructive"
          });
        }
      }
    );
  };
  
    // Process base64 screenshot data
  useEffect(() => {
    // Function to convert base64 to data URLs for rendering
    const processScreenshots = (requests: ManualPaymentResponseDTO[] | undefined) => {
      if (!requests) return;
      
      const newScreenshotUrls: Record<number, string> = {};
      
      requests.forEach(request => {
        if (request.screenshotData && !screenshotUrls[request.id]) {
          // Create a data URL from the base64 data
          newScreenshotUrls[request.id] = `data:image/jpeg;base64,${request.screenshotData}`;
        }
      });
      
      if (Object.keys(newScreenshotUrls).length > 0) {
        setScreenshotUrls(prev => ({ ...prev, ...newScreenshotUrls }));
      }
    };
    
    processScreenshots(allRequests);
    processScreenshots(pendingRequests);
    processScreenshots(approvedRequests);
    processScreenshots(rejectedRequests);
  }, [allRequests, pendingRequests, approvedRequests, rejectedRequests]);
  
  // Get screenshot URL (from either attachmentUrl or screenshotData)
  const getScreenshotUrl = (request: ManualPaymentResponseDTO) => {
    if (request.attachmentUrl) return request.attachmentUrl;
    if (screenshotUrls[request.id]) return screenshotUrls[request.id];
    return null;
  };

  // Check if a request has a screenshot
  const hasScreenshot = (request: ManualPaymentResponseDTO) => {
    return !!(request.attachmentUrl || screenshotUrls[request.id] || request.screenshotData);
  };

  // Handle WhatsApp contact
  const contactViaWhatsApp = (request: ManualPaymentResponseDTO) => {
    if (!request) return;
    
    // The WhatsApp number (with country code)
    const phoneNumber = '923456142607';
    
    // Format message with request details
    const messageText = `*Payment Request Information*%0A%0A` +
      `🆔 *Request ID*: ${request.id}%0A` +
      `👤 *User*: ${request.userId}%0A` +
      `📚 *Exam*: ${request.examTitle}%0A` +
      `💳 *Transaction ID*: ${request.transactionId}%0A` +
      `📞 *Sender Number*: ${request.senderNumber}%0A` +
      `📊 *Status*: ${request.status}%0A` +
      `⏱️ *Submitted*: ${formatDistanceToNow(parseISO(request.createdAt), { addSuffix: true })}%0A%0A` +
      `📋 *Notes from User*: ${request.notes || 'None'}%0A%0A` +
      `${hasScreenshot(request) ? '🖼️ *Screenshot*: Received and available on admin dashboard' : '⚠️ *Screenshot*: Not provided'}`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${phoneNumber}?text=${messageText}`, '_blank');
  };
  
  const renderRequestsTable = (requests: ManualPaymentResponseDTO[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      );
    }
    
    if (!requests?.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No payment requests found
        </div>
      );
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Exam</th>
                <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Sender Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Screenshot</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm">{request.examTitle}</td>
                  <td className="px-4 py-3 text-sm">{request.userId}</td>
                  <td className="px-4 py-3 text-sm">{request.senderNumber}</td>
                  <td className="px-4 py-3 text-sm">{request.transactionId}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatDistanceToNow(parseISO(request.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {hasScreenshot(request) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={() => {
                          setSelectedRequest(request);
                          setScreenshotDialog(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      {/* WhatsApp contact button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-8 w-8"
                        onClick={() => contactViaWhatsApp(request)}
                        title="Contact via WhatsApp"
                      >
                        <SendIcon className="h-4 w-4 text-green-600" />
                      </Button>
                      
                      {/* View details button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-8 w-8"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAdminNotes(request.adminNotes || '');
                          setDetailsDialog(true);
                        }}
                        title="View details"
                      >
                        <InfoIcon className="h-4 w-4" />
                      </Button>
                      
                      {/* Pending-specific actions */}
                      {request.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setRejectionDialog(true);
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setApprovalDialog(true);
                            }}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" /> Pending
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircleIcon className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircleIcon className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Payment Requests</CardTitle>
          <CardDescription>
            Manage and process manual JazzCash payment requests for premium exams.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  All
                  {allRequests?.length ? <Badge variant="secondary" className="ml-2">{allRequests.length}</Badge> : null}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  {pendingRequests?.length ? <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge> : null}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved
                  {approvedRequests?.length ? <Badge variant="secondary" className="ml-2">{approvedRequests.length}</Badge> : null}
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                  {rejectedRequests?.length ? <Badge variant="secondary" className="ml-2">{rejectedRequests.length}</Badge> : null}
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchAll();
                  refetchPending();
                  refetchApproved();
                  refetchRejected();
                  toast({
                    title: "Data refreshed"
                  });
                }}
              >
                Refresh
              </Button>
            </div>
            
            <TabsContent value="all">
              {renderRequestsTable(allRequests, isLoadingAll)}
            </TabsContent>
            
            <TabsContent value="pending">
              {renderRequestsTable(pendingRequests, isLoadingPending)}
            </TabsContent>
            
            <TabsContent value="approved">
              {renderRequestsTable(approvedRequests, isLoadingApproved)}
            </TabsContent>
            
            <TabsContent value="rejected">
              {renderRequestsTable(rejectedRequests, isLoadingRejected)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this payment request?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exam:</span>
                  <span className="text-sm font-medium">{selectedRequest.examTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="text-sm font-medium">{selectedRequest.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sender Number:</span>
                  <span className="text-sm font-medium">{selectedRequest.senderNumber}</span>
                </div>
                
                {/* Screenshot thumbnail */}
                {hasScreenshot(selectedRequest) && (
                  <div className="mt-4">
                    <span className="text-sm font-medium">Payment Screenshot:</span>
                    <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setApprovalDialog(false);
                        setScreenshotDialog(true);
                      }}
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Image 
                          src={getScreenshotUrl(selectedRequest) || ''} 
                          alt="Payment Screenshot" 
                          width={300} 
                          height={200}
                          className="object-contain"
                        />
                      </div>
                      <div className="text-xs text-center p-1 bg-muted/50">
                        Click to view full image
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes (Optional)</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this approval..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? <Spinner className="mr-2" size="sm" /> : null}
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this payment request?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exam:</span>
                  <span className="text-sm font-medium">{selectedRequest.examTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="text-sm font-medium">{selectedRequest.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sender Number:</span>
                  <span className="text-sm font-medium">{selectedRequest.senderNumber}</span>
                </div>
                
                {/* Screenshot thumbnail */}
                {hasScreenshot(selectedRequest) && (
                  <div className="mt-4">
                    <span className="text-sm font-medium">Payment Screenshot:</span>
                    <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setRejectionDialog(false);
                        setScreenshotDialog(true);
                      }}
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Image 
                          src={getScreenshotUrl(selectedRequest) || ''} 
                          alt="Payment Screenshot" 
                          width={300} 
                          height={200}
                          className="object-contain"
                        />
                      </div>
                      <div className="text-xs text-center p-1 bg-muted/50">
                        Click to view full image
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason (Recommended)</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Explain why this payment was rejected..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? <Spinner className="mr-2" size="sm" /> : null}
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Request Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedRequest && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Exam:</span>
                  <span className="text-sm font-medium">{selectedRequest.examTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="text-sm font-medium">{selectedRequest.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="text-sm font-medium">{selectedRequest.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sender Number:</span>
                  <span className="text-sm font-medium">{selectedRequest.senderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium">{selectedRequest.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created At:</span>
                  <span className="text-sm font-medium">{formatDistanceToNow(parseISO(selectedRequest.createdAt), { addSuffix: true })}</span>
                </div>
                {selectedRequest.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processed At:</span>
                    <span className="text-sm font-medium">{formatDistanceToNow(parseISO(selectedRequest.processedAt), { addSuffix: true })}</span>
                  </div>
                )}
                
                {/* Screenshot thumbnail */}
                {hasScreenshot(selectedRequest) && (
                  <div className="mt-4">
                    <span className="text-sm font-medium">Payment Screenshot:</span>
                    <div className="mt-2 border rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setDetailsDialog(false);
                        setScreenshotDialog(true);
                      }}
                    >
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Image 
                          src={getScreenshotUrl(selectedRequest) || ''} 
                          alt="Payment Screenshot" 
                          width={300} 
                          height={200}
                          className="object-contain"
                        />
                      </div>
                      <div className="text-xs text-center p-1 bg-muted/50">
                        Click to view full image
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedRequest.notes && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">User Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRequest.notes}</p>
                  </div>
                )}
                
                {selectedRequest.adminNotes && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Admin Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRequest.adminNotes}</p>
                  </div>
                )}
                
                {/* WhatsApp contact button */}
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => {
                      contactViaWhatsApp(selectedRequest);
                      setDetailsDialog(false);
                    }}
                  >
                    <SendIcon className="h-4 w-4" />
                    Contact User via WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Screenshot Dialog */}
      <Dialog open={screenshotDialog} onOpenChange={setScreenshotDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
            {selectedRequest && (
              <DialogDescription>
                {selectedRequest.examTitle} - Transaction ID: {selectedRequest.transactionId}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <div className="flex justify-center p-2">
            {selectedRequest && getScreenshotUrl(selectedRequest) ? (
              <div className="relative max-h-[60vh] overflow-hidden rounded-lg border">
                <Image
                  src={getScreenshotUrl(selectedRequest) || ''}
                  alt="Payment Screenshot"
                  width={800}
                  height={600}
                  className="object-contain"
                />
                
                {/* Open in new tab button */}
                {selectedRequest.attachmentUrl && (
                  <a 
                    href={selectedRequest.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-background/80 text-primary p-1.5 rounded-full"
                    title="Open in new tab"
                  >
                    <ExternalLinkIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />
                <span>No screenshot available</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setScreenshotDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualPaymentsAdminDashboard;