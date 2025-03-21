'use client';

import React from 'react';
import { PaymentHistory } from '@/features/payments/components/PaymentHistory';

export default function PaymentHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      <PaymentHistory />
    </div>
  );
}