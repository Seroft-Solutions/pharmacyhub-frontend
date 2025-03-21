'use client';

import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DashboardShell } from '@/components/shells/dashboard-shell';
import { PaperPricingManager } from '@/features/payments/components/PaperPricingManager';

export default function PaperPricingPage() {
  return (
    <DashboardShell>
      <PageHeader
        heading="Exam Pricing Management"
        description="Manage premium status and pricing for exams and papers"
      />
      <div className="space-y-6">
        <PaperPricingManager />
      </div>
    </DashboardShell>
  );
}
