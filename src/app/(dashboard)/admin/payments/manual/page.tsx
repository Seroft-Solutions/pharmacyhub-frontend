'use client';

import React from 'react';
import { ManualPaymentsAdminDashboard } from '@/features/payments/manual/components/admin/ManualPaymentsAdminDashboard';
import { usePermissions } from '@/features/core/rbac/hooks/usePermissions';
import { PERMISSIONS } from '@/features/core/rbac/permissions';
import { AccessDenied } from '@/components/AccessDenied';

export default function AdminManualPaymentsPage() {
  const { hasPermission } = usePermissions();
  
  // Check if user has permission to manage manual payments
  const canManagePayments = hasPermission(PERMISSIONS.PAYMENTS.MANAGE_MANUAL_PAYMENTS);
  
  if (!canManagePayments) {
    return (
      <div className="container py-8">
        <AccessDenied message="You don't have permission to manage manual payments." />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Manual Payments Administration</h1>
      <ManualPaymentsAdminDashboard />
    </div>
  );
}