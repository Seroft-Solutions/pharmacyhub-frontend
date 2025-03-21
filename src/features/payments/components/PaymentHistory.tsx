'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePaymentHistoryQuery } from '../api/hooks';
import { Loader2Icon, ReceiptIcon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PaymentStatus } from '../types';

export const PaymentHistory: React.FC = () => {
  const { data: payments, isLoading, error, refetch } = usePaymentHistoryQuery();
  
  // Get status badge variant based on payment status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case PaymentStatus.COMPLETED:
        return <Badge variant="success">Completed</Badge>;
      case PaymentStatus.PENDING:
        return <Badge variant="warning">Pending</Badge>;
      case PaymentStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case PaymentStatus.REFUNDED:
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error Loading Payment History</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An error occurred while loading payment history.'}
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ReceiptIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No payment history</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You haven't made any payments yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{payment.itemName || `${payment.itemType} #${payment.itemId}`}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(payment.status)}
                  <span className="text-lg font-bold">
                    PKR {typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-muted/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{payment.method}</span>
                </div>
                {payment.completedAt && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium">{formatDate(payment.completedAt)}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};