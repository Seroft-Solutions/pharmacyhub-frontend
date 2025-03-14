'use client';

import React from 'react';
import { FeatureGuard, OperationGuard, AdminOnly } from './ui/FeatureGuard';
import { useFeatureAccess } from './hooks/useFeatureAccess';

/**
 * Example component showing how to use the new RBAC mechanism
 */
export function RbacUsageExample() {
  const { features, hasFeature, hasOperation } = useFeatureAccess();
  
  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold">RBAC Usage Examples</h1>
      
      {/* Display all available features */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Features</h2>
        <ul className="list-disc pl-5 space-y-1">
          {features.map(feature => (
            <li key={feature.featureCode}>
              <span className="font-medium">{feature.name}</span>
              {feature.hasAccess && (
                <span className="text-green-600 ml-2">
                  ✓ (Operations: {feature.allowedOperations.join(', ')})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Example 1: Feature Guard */}
      <div className="border p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Example 1: Feature Guard</h2>
        <p className="mb-4">This content is only visible to users with access to the 'exams' feature</p>
        
        <FeatureGuard 
          featureCode="exams" 
          fallback={<p className="text-red-500">You don't have access to the exams feature</p>}
        >
          <div className="bg-green-100 p-4 rounded">
            <p>This content is for users with access to exams</p>
          </div>
        </FeatureGuard>
      </div>
      
      {/* Example 2: Operation Guard */}
      <div className="border p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Example 2: Operation Guard</h2>
        <p className="mb-4">This content is only visible to users who can publish exams</p>
        
        <OperationGuard 
          featureCode="exams" 
          operation="PUBLISH"
          fallback={<p className="text-red-500">You don't have permission to publish exams</p>}
        >
          <div className="bg-blue-100 p-4 rounded">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Publish Exam
            </button>
          </div>
        </OperationGuard>
      </div>
      
      {/* Example 3: Conditional Rendering with Hooks */}
      <div className="border p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Example 3: Using Hooks</h2>
        <p className="mb-4">This demonstrates using hooks for conditional rendering</p>
        
        <div className="space-y-2">
          {hasFeature('exams') && (
            <p className="text-green-600">You have access to exams</p>
          )}
          
          {hasOperation('exams', 'WRITE') && (
            <p className="text-green-600">You can create and edit exams</p>
          )}
          
          {hasOperation('exams', 'DELETE') && (
            <p className="text-green-600">You can delete exams</p>
          )}
        </div>
      </div>
      
      {/* Example 4: Admin Only */}
      <div className="border p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Example 4: Admin Only</h2>
        <p className="mb-4">This content is only visible to administrators</p>
        
        <AdminOnly fallback={<p className="text-red-500">Admin access required</p>}>
          <div className="bg-purple-100 p-4 rounded">
            <p>This is admin-only content</p>
          </div>
        </AdminOnly>
      </div>
    </div>
  );
}
