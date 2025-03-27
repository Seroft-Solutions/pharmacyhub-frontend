"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, RefreshCw, Search, CreditCard, FileText } from 'lucide-react';
import { 
  useManualRequestsByStatus, 
  useAllManualRequests 
} from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';

import { 
  PaymentHistory, 
  ViewDetailsDialog 
} from '@/features/payments/admin';

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State for the selected payment request and dialog visibility
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch payment requests data
  const { 
    data: approvedRequests, 
    isLoading: isLoadingApproved, 
    refetch: refetchApproved 
  } = useManualRequestsByStatus('APPROVED');
  
  const { 
    data: rejectedRequests, 
    isLoading: isLoadingRejected, 
    refetch: refetchRejected 
  } = useManualRequestsByStatus('REJECTED');
  
  const { 
    data: allRequests, 
    isLoading: isLoadingAll, 
    refetch: refetchAll 
  } = useAllManualRequests();
  
  // Calculate summary statistics
  const approvedCount = approvedRequests?.length || 0;
  const rejectedCount = rejectedRequests?.length || 0;
  const totalRequests = (allRequests?.length || 0);
  const approvalRate = totalRequests > 0 ? Math.round((approvedCount / totalRequests) * 100) : 0;

  // Handle viewing payment details
  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsViewOpen(true);
  };

  // Tabs config
  const tabs = [
    { id: 'all', label: 'All History', count: totalRequests, data: allRequests, isLoading: isLoadingAll },
    { id: 'approved', label: 'Approved', count: approvedCount, data: approvedRequests, isLoading: isLoadingApproved, badgeClass: 'bg-green-50 text-green-700' },
    { id: 'rejected', label: 'Rejected', count: rejectedCount, data: rejectedRequests, isLoading: isLoadingRejected, badgeClass: 'bg-red-50 text-red-700' }
  ];
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
            <p className="text-muted-foreground mt-1">
              View a complete history of payment requests and their outcomes.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                All-time payment requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRate}%</div>
              <p className="text-xs text-muted-foreground">
                Percentage of approved requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRequests && allRequests.length > 0 ? 
                  allRequests[0].status : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Status of the most recent request
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Request History</CardTitle>
            <CardDescription>
              View all payment requests and their outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                    <Badge variant="outline" className={`ml-2 ${tab.badgeClass || ''}`}>
                      {tab.isLoading ? <Spinner size="xs" /> : tab.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id}>
                  <PaymentHistory 
                    requests={tab.data || []}
                    isLoading={tab.isLoading}
                    onViewDetails={handleViewDetails}
                    onRefresh={() => {
                      if (tab.id === 'all') refetchAll();
                      else if (tab.id === 'approved') refetchApproved();
                      else if (tab.id === 'rejected') refetchRejected();
                    }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* View Details Dialog */}
      {selectedRequest && (
        <ViewDetailsDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          paymentRequest={selectedRequest}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
}
