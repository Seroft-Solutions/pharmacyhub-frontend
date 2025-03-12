"use client";

import React from "react";

interface ExamFeatureRootProps {
  children: React.ReactNode;
}

/**
 * ExamFeatureRoot - Root component for the Exams feature
 * 
 * This is now just a passthrough component for backward compatibility.
 * The navigation registration is handled directly in the layout component.
 */
export function ExamFeatureRoot({ children }: ExamFeatureRootProps) {
  return <>{children}</>;
}
