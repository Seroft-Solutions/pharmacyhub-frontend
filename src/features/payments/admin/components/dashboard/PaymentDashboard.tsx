"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation';
import {
  Users,
  UserCheck,
  DollarSign,
  CreditCard,
  FileText,
  PieChart,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { usePaymentStatistics, usePaymentHistorySummary } from '@/features/payments/manual/api/hooks/usePaymentStatisticsHooks';
import { formatCurrency } from '../../utils';

const PaymentDashboard: React.FC = () => {
  const router = useRouter();
  const { data: statistics, isLoading: isLoadingStats } = usePaymentStatistics();
  const { data: summary, isLoading: isLoadingSummary } = usePaymentHistorySummary();

  const StatCard = ({ title, value, icon, description, isLoading = false, onClick, className = '' }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    isLoading?: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    if (isLoading) {
      return (
        <Card className={className}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      );
    }

    const card = (
      <Card className={`${className} ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    );

    if (onClick) {
      return (
        <div onClick={onClick}>
          {card}
        </div>
      );
    }

    return card;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <p className="text-muted-foreground">
            Overview of payment metrics and statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/payments/approvals')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Approvals
          </Button>
          <Button 
            onClick={() => router.push('/admin/payments/history')}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Full History
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={statistics?.totalUsers || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Number of registered users"
          isLoading={isLoadingStats}
        />
        
        <StatCard
          title="Paid Users"
          value={statistics?.paidUsers || 0}
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          description={`${((statistics?.paidUsers || 0) / (statistics?.totalUsers || 1) * 100).toFixed(1)}% of total users`}
          isLoading={isLoadingStats}
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(statistics?.totalAmountCollected || 0)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Total amount collected"
          isLoading={isLoadingStats}
        />
        
        <StatCard
          title="Recent Payments"
          value={statistics?.recentPayments || 0}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          description="New payments in last 7 days"
          isLoading={isLoadingStats}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Approval Rate"
          value={`${(statistics?.approvalRate || 0).toFixed(1)}%`}
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
          description="Percentage of approved requests"
          isLoading={isLoadingStats}
        />
        
        <StatCard
          title="Approved Payments"
          value={summary?.approved || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          description="Total approved payment requests"
          isLoading={isLoadingSummary}
          onClick={() => router.push('/admin/payments/history?tab=approved')}
          className="hover:border-green-300"
        />
        
        <StatCard
          title="Rejected Payments"
          value={summary?.rejected || 0}
          icon={<XCircle className="h-4 w-4 text-red-600" />}
          description="Total rejected payment requests"
          isLoading={isLoadingSummary}
          onClick={() => router.push('/admin/payments/history?tab=rejected')}
          className="hover:border-red-300"
        />
        
        <StatCard
          title="Pending Approvals"
          value={summary?.pending || 0}
          icon={<Clock className="h-4 w-4 text-amber-600" />}
          description="Requests waiting for approval"
          isLoading={isLoadingSummary}
          onClick={() => router.push('/admin/payments/approvals')}
          className="hover:border-amber-300"
        />
      </div>
    </div>
  );
};

export default PaymentDashboard;