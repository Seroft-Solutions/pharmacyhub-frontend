'use client';

import React from 'react';
import { ExamOperationGuard } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';
import { PaperPricingManager } from '@/features/payments/components/PaperPricingManager';

export default function PaperPricingPage() {
  return (
    <ExamOperationGuard operation={ExamOperation.MANAGE_PAYMENTS}>
      <div className="space-y-6">
        <PaperPricingManager />
      </div>
    </ExamOperationGuard>
  );
}
