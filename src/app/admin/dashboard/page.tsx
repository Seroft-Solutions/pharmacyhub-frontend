"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  FileText,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col gap-5 w-full p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Pharmacy Hub admin portal. Manage all aspects of your platform here.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Download Reports</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +43% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,678</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Current active users
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Quick Links */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/exams')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Exam Management</CardTitle>
                </div>
                <CardDescription>
                  Create and manage exams, questions, and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Upload MCQ JSON content</li>
                    <li>Edit exam properties</li>
                    <li>View and manage question banks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/users')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>
                  Manage users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Add/edit user accounts</li>
                    <li>Assign roles and permissions</li>
                    <li>Monitor user activity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => router.push('/admin/inventory')}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Inventory Management</CardTitle>
                </div>
                <CardDescription>
                  Manage products and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Add/edit products</li>
                    <li>Track inventory levels</li>
                    <li>Manage out-of-stock items</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed analytics and statistics will be displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics content will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view detailed reports about platform activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reports content will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings content will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
