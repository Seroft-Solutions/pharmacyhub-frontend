'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ManualPaymentsAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Payment Requests</CardTitle>
          <CardDescription>
            Manage and process manual JazzCash payment requests for premium exams.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            This feature is being migrated to the new architecture. Please check back soon.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPaymentsAdminDashboard;