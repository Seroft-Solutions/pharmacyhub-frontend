'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DashboardShell } from '@/components/shells/dashboard-shell';
import { PaymentHistory } from '@/features/payments/components/PaymentHistory';

export default function PaymentHistoryPage() {
  return (
    <DashboardShell>
      <PageHeader
        heading="Payment History"
        description="View all your past transactions and payment history"
      />
      <div className="space-y-6">
        <PaymentHistory />
      </div>
    </DashboardShell>
  );
}
