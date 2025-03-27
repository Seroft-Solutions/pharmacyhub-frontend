"use client";

import React from 'react';
import { PaymentDashboard } from '@/features/payments/admin/components/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentStatistics } from '@/features/payments/admin/components/statistics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PaymentsManagementPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage, analyze, and track all payment activities across the platform.
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="guides">Admin Guides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <PaymentDashboard />
          </TabsContent>
          
          <TabsContent value="statistics">
            <PaymentStatistics />
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Verification Guide</CardTitle>
                  <CardDescription>
                    How to properly verify and process payment requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    <li>Check that the payment screenshot shows a valid transaction ID</li>
                    <li>Verify the amount matches the exam price in our system</li>
                    <li>Ensure the payment date is recent (within 7 days)</li>
                    <li>Confirm the payment method is one we accept</li>
                    <li>If rejecting, always provide a clear reason to help the user</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues & Solutions</CardTitle>
                  <CardDescription>
                    Handling typical payment verification problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li><strong>Blurry Screenshot:</strong> Ask user to resubmit with clear, readable image</li>
                    <li><strong>Suspicious Transaction ID:</strong> Cross-check with payment processor records</li>
                    <li><strong>Incorrect Amount:</strong> Verify if there were discounts or special offers</li>
                    <li><strong>Old Transaction:</strong> Check if this is a resubmission of previously rejected request</li>
                    <li><strong>Multiple Submissions:</strong> Check if user has accidentally submitted multiple times</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}