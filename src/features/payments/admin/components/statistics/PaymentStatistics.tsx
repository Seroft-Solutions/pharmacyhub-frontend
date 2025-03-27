"use client";

import React from 'react';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  CreditCard, 
  BarChart3
} from 'lucide-react';
import { usePaymentStatistics, usePaymentHistorySummary } from '@/features/payments/manual/api/hooks/usePaymentStatisticsHooks';
import { formatCurrency } from '../../utils';
import PaymentStatisticsCard from './PaymentStatisticsCard';

/**
 * PaymentStatistics Component
 * Displays a grid of payment statistics cards
 */
const PaymentStatistics: React.FC = () => {
  const { data: statistics, isLoading: isLoadingStats } = usePaymentStatistics();
  const { data: summary, isLoading: isLoadingSummary } = usePaymentHistorySummary();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PaymentStatisticsCard
        title="Total Users"
        value={statistics?.totalUsers || 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: "+12",
          positive: true
        }}
        isLoading={isLoadingStats}
      />

      <PaymentStatisticsCard
        title="Paid Users"
        value={statistics?.paidUsers || 0}
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: "+5%",
          positive: true
        }}
        isLoading={isLoadingStats}
      />

      <PaymentStatisticsCard
        title="Total Revenue"
        value={formatCurrency(statistics?.totalAmountCollected || 0)}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: "+18%",
          positive: true
        }}
        isLoading={isLoadingStats}
      />

      <PaymentStatisticsCard
        title="Recent Payments"
        value={statistics?.recentPayments || 0}
        icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        trend={{
          value: "Last 7 days",
          positive: true
        }}
        isLoading={isLoadingStats}
      />

      <PaymentStatisticsCard
        title="Approval Rate"
        value={`${statistics?.approvalRate || 0}%`}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        isLoading={isLoadingStats}
      />

      <PaymentStatisticsCard
        title="Approved Payments"
        value={summary?.approved || 0}
        icon={<CreditCard className="h-4 w-4 text-green-600" />}
        isLoading={isLoadingSummary}
      />

      <PaymentStatisticsCard
        title="Rejected Payments"
        value={summary?.rejected || 0}
        icon={<CreditCard className="h-4 w-4 text-red-600" />}
        isLoading={isLoadingSummary}
      />

      <PaymentStatisticsCard
        title="Pending Approvals"
        value={summary?.pending || 0}
        icon={<CreditCard className="h-4 w-4 text-amber-600" />}
        isLoading={isLoadingSummary}
        className={summary?.pending ? 'border-amber-300 shadow-amber-100/50' : ''}
      />
    </div>
  );
};

export default PaymentStatistics;