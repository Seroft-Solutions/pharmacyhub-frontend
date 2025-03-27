"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText, RefreshCw, Search } from 'lucide-react';
import { 
  formatCurrency, 
  formatDate, 
  getUserDisplayName, 
  getUserEmail,
  getStatusColor 
} from '../../utils';
import EmptyState from '../../components/EmptyState';

interface PaymentHistoryProps {
  requests: any[];
  isLoading?: boolean;
  isError?: boolean;
  onViewDetails?: (request: any) => void;
  onRefresh?: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ 
  requests = [],
  isLoading = false,
  isError = false,
  onViewDetails,
  onRefresh
}) => {
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter requests by search term
  const filteredRequests = requests.filter(request => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      request.id?.toString().includes(searchLower) ||
      (getUserDisplayName(request) || '').toLowerCase().includes(searchLower) ||
      (getUserEmail(request) || '').toLowerCase().includes(searchLower) ||
      (request.transactionId || '').toLowerCase().includes(searchLower) ||
      (request.exam?.title || request.examTitle || '').toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <EmptyState
        title="Failed to Load History"
        description="There was an error loading the payment history. Please try again."
        variant="warning"
        action={{
          label: "Retry",
          onClick: onRefresh || (() => {})
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search payment history..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No Matching Results" : "No Payment History"}
          description={
            searchTerm 
              ? "No payment requests match your search criteria." 
              : "No payment history available."
          }
          variant={searchTerm ? "search" : "info"}
          action={searchTerm ? {
            label: "Clear Search",
            onClick: () => setSearchTerm('')
          } : undefined}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[70px] font-medium">ID</TableHead>
                <TableHead className="font-medium">User</TableHead>
                <TableHead className="font-medium">Exam</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="w-[150px] font-medium">Date</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[150px]">
                        {getUserDisplayName(request)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {getUserEmail(request)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[150px]">
                        {request.exam?.title || request.examTitle || 'Unknown exam'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {request.exam?.paperType || 'Standard Exam'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(request.amount || 0)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">{formatDate(request.processedAt || request.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {onViewDetails && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(request)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;