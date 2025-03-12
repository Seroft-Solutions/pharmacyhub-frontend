"use client";

import { AppLayout } from "@/features/shell";
import { EXAMS_FEATURE } from "@/features/shell/navigation/features";

/**
 * Layout for all exam-related pages under the /exam route
 * 
 * This layout uses the AppLayout from the shell feature for consistent navigation
 * and directly provides the exams navigation items.
 */
export default function ExamPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout 
      features={[EXAMS_FEATURE]} 
      appName="Pharmacy Exams"
    >
      {children}
    </AppLayout>
  );
}
