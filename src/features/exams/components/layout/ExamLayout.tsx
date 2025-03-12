"use client";

import React from "react";
import { AppLayout } from "@/features/shell";
import { ExamFeatureRoot } from "./ExamFeatureRoot";

interface ExamLayoutProps {
  children: React.ReactNode;
}

/**
 * ExamLayout - Specialized layout for the Exams feature
 * 
 * This layout:
 * 1. Registers exams navigation with the shell via ExamFeatureRoot
 * 2. Uses the AppLayout from the shell feature
 * 3. Can add exams-specific UI if needed
 * 
 * This is an alternative to using ExamFeatureRoot directly with AppLayout.
 */
export function ExamLayout({ children }: ExamLayoutProps) {
  return (
    <ExamFeatureRoot>
      <AppLayout appName="Pharmacy Exams">
        {/* You could add exams-specific UI elements here if needed */}
        <div className="space-y-6">
          {children}
        </div>
      </AppLayout>
    </ExamFeatureRoot>
  );
}
