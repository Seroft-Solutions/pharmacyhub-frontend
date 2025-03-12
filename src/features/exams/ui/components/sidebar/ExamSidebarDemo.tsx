"use client";

import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { ExamSidebar } from './ExamSidebar';
import { ExamSidebarProps } from './types';

/**
 * Demo layout that shows how to use the ExamSidebar in a real application
 * This includes a navigation header, sidebar, and main content area
 */
export function ExamSidebarDemo({ 
  sidebarProps
}: { 
  sidebarProps?: Partial<ExamSidebarProps>
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ExamSidebar {...sidebarProps} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search exams..."
                  className="pl-8 w-[300px] bg-gray-50 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-4">Exam Preparation Dashboard</h1>
              
              <p className="text-gray-600 mb-6">
                Welcome to your exam preparation dashboard. From here, you can access past papers, 
                model papers, and subject-specific study materials to help you prepare for your pharmacist exams.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample cards for different exam types */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Past Papers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Practice with previous exam papers to understand the format and common questions.
                  </p>
                  <Button variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-100">
                    View Past Papers
                  </Button>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-700 mb-2">Model Papers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Study model exam papers created by experts to test your knowledge.
                  </p>
                  <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-100">
                    View Model Papers
                  </Button>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-700 mb-2">Subject Papers</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Focus on specific subjects with dedicated practice materials.
                  </p>
                  <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-100">
                    View Subject Papers
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Your Progress</h3>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[35%]"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  You've completed 35% of the recommended preparation materials.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
