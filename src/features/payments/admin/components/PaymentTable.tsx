"use client";

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Copy
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDate, 
  formatTransactionReference, 
  getUserDisplayName,
  getUserEmail,
  getDataState
} from '../utils';
import EmptyState from './EmptyState';

interface PaymentTableProps {
  requests: any[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onView: (request: any) => void;
  onApprove: (request: any) => void;
  onReject: (request: any) => void;
  onRefresh: () => void;
  onClearSearch: () => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  requests,
  isLoading,
  isError,
  searchTerm,
  onView,
  onApprove,
  onReject,
  onRefresh,
  onClearSearch
}) => {
  const dataState = getDataState(isLoading, isError, requests);
  
  // Copy transaction reference to clipboard
  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
  };
  
  // Loading state
  if (dataState === 'loading') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-12" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (dataState === 'error') {
    return (
      <EmptyState
        title="Failed to Load Payments"
        description="There was an error loading the payment requests. Please try again."
        variant="warning"
        action={{
          label: "Retry",
          onClick: onRefresh
        }}
      />
    );
  }
  
  // Empty search results
  if (dataState === 'empty' && searchTerm) {
    return (
      <EmptyState
        title="No Matching Results"
        description="No payment requests match your search criteria."
        variant="search"
        action={{
          label: "Clear Search",
          onClick: onClearSearch
        }}
      />
    );
  }
  
  // Empty state (no pending payments)
  if (dataState === 'empty') {
    return (
      <EmptyState
        title="All Caught Up!"
        description="There are no pending payment requests at the moment."
        variant="success"
      />
    );
  }
  
  // Table with data
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px] font-medium">ID</TableHead>
            <TableHead className="font-medium">User</TableHead>
            <TableHead className="font-medium">Exam</TableHead>
            <TableHead className="font-medium">Transaction</TableHead>
            <TableHead className="font-medium">Amount</TableHead>
            <TableHead className="w-[160px] font-medium">Date</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request.id} 
              className="group cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onView(request)}
            >
              <TableCell className="font-medium">#{request.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[150px]">{getUserDisplayName(request)}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {getUserEmail(request)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[150px]">{request.exam?.title || 'Unknown exam'}</span>
                  <span className="text-xs text-muted-foreground">
                    {request.exam?.paperType || 'Standard Exam'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm truncate max-w-[100px]">
                    {formatTransactionReference(request.transactionId)}
                  </span>
                  {request.transactionId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => copyToClipboard(request.transactionId, e)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{formatCurrency(request.amount)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(request);
                    }}
                    className="hidden md:flex"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(request);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Approve</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(request);
                    }}
                  >
                    <XCircle className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Reject</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentTable;