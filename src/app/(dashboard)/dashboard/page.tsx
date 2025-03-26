"use client";

import { useEffect, useState } from "react";
import { usePermissions, useAccess } from "@/features/core/rbac/hooks";
import { useSession, useAuth } from "@/features/core/auth/hooks";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/features/shell/store/roleStore";
import {ExamDashboard} from "@/features/exams";
import ExamDashboardPage from "@/app/(exams)/exam/dashboard/page";
import { logger } from "@/shared/lib/logger";
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';
import { authService } from '@/features/core/auth/api/services/authService';

function DashboardMetrics() {
  // Using useAccess for feature-specific checks
  const canViewMetrics = useAccess({
    permissions: ['view_reports'],
  });
  const isMobile = useMobileStore(selectIsMobile);

  if (!canViewMetrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div className="bg-white p-3 md:p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700 text-sm md:text-base">Total Orders</h3>
        <p className="text-xl md:text-2xl font-bold">1,234</p>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700 text-sm md:text-base">Revenue</h3>
        <p className="text-xl md:text-2xl font-bold">$45,678</p>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-700 text-sm md:text-base">Active Users</h3>
        <p className="text-xl md:text-2xl font-bold">567</p>
      </div>
    </div>
  );
}

function InventorySection() {
  const { hasPermission } = usePermissions();
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mt-4 md:mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg md:text-xl font-semibold">Inventory Overview</h2>
        {hasPermission('manage_inventory') && (
          <Button variant="outline" size={isMobile ? "sm" : "default"}>Manage Inventory</Button>
        )}
      </div>
      <div className="space-y-3 md:space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-sm md:text-base">Low Stock Items</span>
          <span className="font-semibold text-sm md:text-base">12</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-sm md:text-base">Out of Stock Items</span>
          <span className="font-semibold text-sm md:text-base">3</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm md:text-base">Total Products</span>
          <span className="font-semibold text-sm md:text-base">456</span>
        </div>
      </div>
    </div>
  );
}

function AdminSection() {
  const { isAdmin } = usePermissions();
  const isMobile = useMobileStore(selectIsMobile);

  if (!isAdmin) return null;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mt-4 md:mt-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Admin Controls</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        <Button variant="outline" size={isMobile ? "sm" : "default"}>Manage Users</Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>System Settings</Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>Access Logs</Button>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>Backup Database</Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { session } = useSession({ required: true });
  const { hasRole } = usePermissions();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get user verification status - simulating since user profile should include this
  const userIsVerified = session?.user?.verified !== false; // Default to true if not specified
  
  // Get resend verification mutation
  const { mutateAsync: resendVerification } = authService.useResendVerification();
  
  // Handle resending verification email
  const handleResendVerification = async () => {
    if (!session?.user?.email) return;
    
    try {
      setIsResendingVerification(true);
      
      // Get device info
      const deviceInfo = {
        deviceId: window.navigator.userAgent + Date.now(),
        userAgent: window.navigator.userAgent,
        ipAddress: 'client-side'
      };
      
      // Call the resend verification API
      await resendVerification({
        emailAddress: session.user.email,
        ...deviceInfo
      });
      
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      alert('Failed to resend verification email. Please try again later.');
    } finally {
      setIsResendingVerification(false);
    }
  };
  
  // Check if user has admin role - using the RBAC system directly
  const isAdmin = hasRole('ADMIN') || hasRole('PER_ADMIN');
  
  useEffect(() => {
    // Let the page load first, then check for admin status
    setIsInitialized(true);
  }, []);
  
  // Redirect admin users to the admin dashboard
  useEffect(() => {
    if (isInitialized && isAdmin) {
      logger.debug("[Dashboard] User is admin, redirecting to admin dashboard", {
        userRoles: session?.user?.roles
      });
      router.push("/admin/dashboard");
    }
  }, [isAdmin, router, isInitialized, session]);
  
  // If user is admin, don't render the regular dashboard
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to admin dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold">Welcome, {session?.user?.name || session?.user?.email}</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          User Dashboard
        </p>
      </div>

      {/* Verification Status Alert */}
      {!userIsVerified && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Your account is not verified</p>
              <p className="text-sm text-yellow-600 mt-1">Please check your email for the verification link, or click below to resend it.</p>
              <button 
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      <ExamDashboardPage />

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <AdminSection />
      </div>
    </div>
  );
}