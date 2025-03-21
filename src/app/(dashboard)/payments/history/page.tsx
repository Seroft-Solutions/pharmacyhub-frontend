'use client';

import React from 'react';
import { PaymentHistory } from '@/features/payments/components/PaymentHistory';

export default function PaymentHistoryPage() {
  return (

      <div className="space-y-6">
        <PaymentHistory />
      </div>
  );
}
