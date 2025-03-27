"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  FileText,
  Package,
  Settings,
  ClockIcon,
} from "lucide-react";
import { useManualRequestsByStatus, useAllManualRequests } from "@/features/payments/manual/api/hooks/useManualPaymentApiHooks";
import { PaymentStatistics, PaymentHistory, ViewDetailsDialog, PaymentDashboard } from "@/features/payments/admin";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forceAdminMode } from "@/features/shell/store/roleStore";
import { useAuth } from "@/features/core/auth/hooks";
import { logger } from '@/shared/lib/logger';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { hasRole, isAuthenticated, isLoading, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State for the selected payment request and dialog visibility
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Fetch payment data
  const { data: pendingRequests, isLoading: isLoadingPending } = useManualRequestsByStatus('PENDING');
  const { data: allRequests, isLoading: isLoadingAll, refetch: refetchAll } = useAllManualRequests();
  
  // Force admin mode when this page is accessed directly
  useEffect(() => {
    // Skip during SSR or while authentication is loading
    if (typeof window === 'undefined' || isLoading) return;
    
    setIsInitialized(true);
    
    // If user is not authenticated, this will be handled by the AppLayout
    if (!isAuthenticated) return;
    
    logger.debug('[AdminDashboard] User authenticated, checking admin access', {
      email: user?.email,
      roles: user?.roles
    });
    
    // Check if user has admin role
    const hasAdminAccess = hasRole('ADMIN') || hasRole('PER_ADMIN');
    
    if (!hasAdminAccess) {
      // Redirect non-admin users
      logger.debug('[AdminDashboard] User lacks admin role, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
    
    // Force admin mode
    logger.debug('[AdminDashboard] Forcing admin mode');
    const success = forceAdminMode();
    
    if (!success) {
      logger.warn('[AdminDashboard] Failed to force admin mode, user may not have correct admin privileges');
    }
    
    // Log that we successfully accessed the admin dashboard
    logger.debug('[AdminDashboard] Admin dashboard accessed successfully');
  }, [isAuthenticated, isLoading, hasRole, router, user]);
  
  // If still loading or not initialized, show loading state
  if (isLoading || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen p-4">Loading admin dashboard...</div>;
  }
  
  // Check for admin access
  const hasAdminAccess = hasRole('ADMIN') || hasRole('PER_ADMIN');
  
  // If not admin, don't render admin content
  if (!hasAdminAccess) {
    return <div className="flex items-center justify-center min-h-screen p-4">Redirecting to dashboard...</div>;
  }
  
  return (
    <div className="flex flex-col gap-5 w-full p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Pharmacy Hub admin portal. Manage all aspects of your platform here.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Download Reports</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Payment Dashboard */}
          <PaymentDashboard />
          
          {/* Admin Quick Links */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/exams')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Exam Management</CardTitle>
                </div>
                <CardDescription>
                  Create and manage exams, questions, and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Upload MCQ JSON content</li>
                    <li>Edit exam properties</li>
                    <li>View and manage question banks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/users')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>
                  Manage users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Add/edit user accounts</li>
                    <li>Assign roles and permissions</li>
                    <li>Monitor user activity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/payments/approvals')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle>Payment Approvals</CardTitle>
                </div>
                <CardDescription>
                  Manage payment approvals and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Review pending payments</li>
                    <li>Approve or reject transactions</li>
                    <li>View payment history</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Payment History</h3>
              <p className="text-sm text-muted-foreground">Recent payment history and transaction details</p>
            </div>
            
            <PaymentHistory
              requests={allRequests?.slice(0, 5) || []}
              isLoading={isLoadingAll}
              onViewDetails={(request) => {
                setSelectedRequest(request);
                setIsViewOpen(true);
              }}
              onRefresh={() => refetchAll()}
            />
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/payments/history')}
              >
                View Full History
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view detailed reports about platform activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reports content will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings content will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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