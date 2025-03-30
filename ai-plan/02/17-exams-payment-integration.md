# Task 16: Integrate Payment System for Exam Preparation

## Description
Integrate the payment feature with the exams feature to support premium exams that require payment. This includes implementing payment guards, payment status indicators, and payment request flows within the exams feature.

## Current State Analysis
The payments feature provides components, hooks, and utilities for handling premium content access, including a Zustand store for payment state management. The exams feature needs to integrate with this system to support premium exams that require payment.

## Implementation Steps

1. **Create Payment Integration Components**
   - Develop components for displaying payment status and options
   - Create payment requirement indicators
   - Implement payment request flows for premium exams

   ```tsx
   // src/features/exams/components/molecules/PaymentRequiredBadge.tsx
   import { Badge } from '@/core/ui';
   
   interface PaymentRequiredBadgeProps {
     variant?: 'default' | 'small';
   }
   
   export function PaymentRequiredBadge({ 
     variant = 'default' 
   }: PaymentRequiredBadgeProps) {
     return (
       <Badge 
         className={`payment-required-badge ${variant}`}
         title="Payment required for access"
       >
         Premium
       </Badge>
     );
   }
   
   // src/features/exams/components/molecules/PaymentStatusIndicator.tsx
   import { usePremiumExamInfo } from '@/features/payments';
   
   interface PaymentStatusIndicatorProps {
     examId: number;
   }
   
   export function PaymentStatusIndicator({ examId }: PaymentStatusIndicatorProps) {
     const { isPremium, hasAccess, hasPending, isLoading } = usePremiumExamInfo();
     
     if (isLoading) {
       return <span className="payment-status loading">Checking access...</span>;
     }
     
     if (!isPremium) {
       return null;
     }
     
     if (hasAccess) {
       return <span className="payment-status paid">Paid</span>;
     }
     
     if (hasPending) {
       return <span className="payment-status pending">Payment Pending</span>;
     }
     
     return <span className="payment-status required">Payment Required</span>;
   }
   ```

2. **Implement Payment Guards**
   - Create access control components for premium content
   - Implement payment verification for exam access
   - Add payment requirement checks to exam components

   ```tsx
   // src/features/exams/components/guards/PaymentRequiredGuard.tsx
   import { useRouter } from 'next/navigation';
   import { Button } from '@/core/ui';
   import { usePremiumExamInfo } from '@/features/payments';
   
   interface PaymentRequiredGuardProps {
     examId: number;
     children: React.ReactNode;
     fallback?: React.ReactNode;
   }
   
   export function PaymentRequiredGuard({
     examId,
     children,
     fallback,
   }: PaymentRequiredGuardProps) {
     const router = useRouter();
     const { isPremium, hasAccess, hasPending, isLoading } = usePremiumExamInfo();
     
     // If not premium or loading, show children
     if (!isPremium || isLoading) {
       return <>{children}</>;
     }
     
     // If has access, show children
     if (hasAccess) {
       return <>{children}</>;
     }
     
     // If payment is pending, show pending message
     if (hasPending) {
       return fallback || (
         <div className="payment-pending-message">
           <h2>Payment Pending</h2>
           <p>Your payment for this exam is being processed. You'll get access once payment is confirmed.</p>
           <Button 
             onClick={() => router.push(`/exams/payments`)}
             variant="secondary"
           >
             View Payment Status
           </Button>
         </div>
       );
     }
     
     // Otherwise, show payment required message
     return fallback || (
       <div className="payment-required-message">
         <h2>Payment Required</h2>
         <p>This exam requires payment for access.</p>
         <Button 
           onClick={() => router.push(`/exams/[examId]/payment`, `/exams/${examId}/payment`)}
           variant="primary"
         >
           Make Payment
         </Button>
       </div>
     );
   }
   ```

3. **Create Payment Request Flow**
   - Implement payment request screen for exams
   - Create payment confirmation components
   - Add payment tracking and status updates

   ```tsx
   // src/features/exams/components/organisms/ExamPaymentRequest.tsx
   'use client'
   
   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   import { useManualPaymentStore } from '@/features/payments';
   import { Button, TextField } from '@/core/ui';
   
   interface ExamPaymentRequestProps {
     examId: number;
     examTitle: string;
     price: number;
   }
   
   export function ExamPaymentRequest({
     examId,
     examTitle,
     price
   }: ExamPaymentRequestProps) {
     const [notes, setNotes] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const router = useRouter();
     const { requestManualPayment } = useManualPaymentStore();
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);
       
       try {
         await requestManualPayment(examId, notes);
         router.push(`/exams/payment-confirmation?examId=${examId}`);
       } catch (error) {
         console.error('Payment request failed:', error);
         setIsSubmitting(false);
       }
     };
     
     return (
       <div className="exam-payment-request">
         <h2>Payment Request for {examTitle}</h2>
         
         <div className="exam-details">
           <div className="detail-row">
             <span className="label">Exam:</span>
             <span className="value">{examTitle}</span>
           </div>
           <div className="detail-row">
             <span className="label">Price:</span>
             <span className="value">${price.toFixed(2)}</span>
           </div>
         </div>
         
         <form onSubmit={handleSubmit}>
           <div className="form-row">
             <label htmlFor="notes">Additional Notes (Optional)</label>
             <TextField
               id="notes"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               multiline
               rows={3}
               placeholder="Add any additional information for this payment"
             />
           </div>
           
           <div className="action-buttons">
             <Button
               type="button"
               variant="secondary"
               onClick={() => router.back()}
             >
               Cancel
             </Button>
             <Button
               type="submit"
               variant="primary"
               disabled={isSubmitting}
             >
               {isSubmitting ? 'Processing...' : 'Submit Payment Request'}
             </Button>
           </div>
         </form>
       </div>
     );
   }
   ```

4. **Update Exam Components for Payment Integration**
   - Modify exam card and list components to show payment status
   - Update exam details page to handle premium exams
   - Integrate payment guards into exam attempt flows

   ```tsx
   // src/features/exams/components/molecules/ExamCard.tsx (Updated)
   import Link from 'next/link';
   import { ExamCardProps } from '@/features/exams/types';
   import { PaymentRequiredBadge } from './PaymentRequiredBadge';
   import { PaymentStatusIndicator } from './PaymentStatusIndicator';
   
   export function ExamCard({ exam }: ExamCardProps) {
     return (
       <div className="exam-card">
         <div className="card-header">
           <h3 className="exam-title">
             <Link href={`/exams/${exam.id}`}>
               {exam.title}
             </Link>
           </h3>
           {exam.isPremium && <PaymentRequiredBadge />}
         </div>
         
         <div className="card-body">
           <p className="exam-description">{exam.description}</p>
           <div className="exam-details">
             <span className="question-count">
               {exam.questionCount} questions
             </span>
             <span className="time-limit">
               {exam.timeLimit ? `${exam.timeLimit} minutes` : 'No time limit'}
             </span>
           </div>
         </div>
         
         <div className="card-footer">
           {exam.isPremium && (
             <PaymentStatusIndicator examId={exam.id} />
           )}
           <Link 
             href={`/exams/${exam.id}`}
             className="view-details-link"
           >
             View Details
           </Link>
         </div>
       </div>
     );
   }
   ```

5. **Implement Exam Attempt with Payment Check**
   - Add payment verification before starting exam
   - Implement redirects for unpaid premium exams
   - Create fallback components for payment required scenarios

   ```tsx
   // src/features/exams/components/organisms/ExamStartScreen.tsx (Updated)
   'use client'
   
   import { useRouter } from 'next/navigation';
   import { Button } from '@/core/ui';
   import { PaymentRequiredGuard } from '../guards/PaymentRequiredGuard';
   import { useExamFeatureAccess } from '@/features/exams/rbac';
   import { Exam } from '@/features/exams/types';
   
   interface ExamStartScreenProps {
     exam: Exam;
   }
   
   export function ExamStartScreen({ exam }: ExamStartScreenProps) {
     const router = useRouter();
     const { canTakeExams } = useExamFeatureAccess();
     
     const handleStartExam = () => {
       router.push(`/exams/${exam.id}/attempt`);
     };
     
     return (
       <PaymentRequiredGuard examId={exam.id}>
         <div className="exam-start-screen">
           <h2>{exam.title}</h2>
           <div className="exam-details">
             <p>{exam.description}</p>
             <ul className="exam-info-list">
               <li>Questions: {exam.questionCount}</li>
               <li>Time Limit: {exam.timeLimit ? `${exam.timeLimit} minutes` : 'No time limit'}</li>
               <li>Passing Score: {exam.passingScore}%</li>
             </ul>
           </div>
           
           <div className="start-actions">
             {canTakeExams ? (
               <Button
                 variant="primary"
                 size="large"
                 onClick={handleStartExam}
               >
                 Start Exam
               </Button>
             ) : (
               <p className="no-permission-message">
                 You don't have permission to take exams.
               </p>
             )}
           </div>
         </div>
       </PaymentRequiredGuard>
     );
   }
   ```

6. **Create Premium Exam Integration**
   - Implement PremiumExamInfoProvider at appropriate levels
   - Update exam context to include payment information
   - Add payment methods to API hooks

   ```tsx
   // src/features/exams/components/templates/ExamContainer.tsx (Updated)
   import { PremiumExamInfoProvider } from '@/features/payments';
   import { ExamContext } from '@/features/exams/context';
   
   interface ExamContainerProps {
     examId: number;
     children: React.ReactNode;
   }
   
   export function ExamContainer({ examId, children }: ExamContainerProps) {
     return (
       <PremiumExamInfoProvider examId={examId}>
         <ExamContext.Provider value={{ examId }}>
           <div className="exam-container">
             {children}
           </div>
         </ExamContext.Provider>
       </PremiumExamInfoProvider>
     );
   }
   ```

7. **Add Payment Status Indicators to Admin Interface**
   - Update admin exam list to show payment status
   - Implement payment information in admin exam details
   - Add payment filtering options to admin views

   ```tsx
   // src/features/exams/components/admin/ExamListItem.tsx (Updated)
   import Link from 'next/link';
   import { format } from 'date-fns';
   import { ExamStatusBadge } from '../molecules/ExamStatusBadge';
   import { PaymentRequiredBadge } from '../molecules/PaymentRequiredBadge';
   
   interface ExamListItemProps {
     exam: {
       id: number;
       title: string;
       status: string;
       createdAt: string;
       isPremium: boolean;
       paymentCount: number;
     };
   }
   
   export function ExamListItem({ exam }: ExamListItemProps) {
     return (
       <div className="exam-list-item">
         <div className="exam-info">
           <h3 className="exam-title">
             <Link href={`/exams/admin/${exam.id}`}>
               {exam.title}
             </Link>
           </h3>
           <div className="exam-meta">
             <span className="created-date">
               Created: {format(new Date(exam.createdAt), 'MMM d, yyyy')}
             </span>
             <ExamStatusBadge status={exam.status} />
             {exam.isPremium && <PaymentRequiredBadge />}
           </div>
         </div>
         
         <div className="exam-actions">
           {exam.isPremium && (
             <Link 
               href={`/exams/admin/${exam.id}/payments`}
               className="payments-link"
             >
               {exam.paymentCount} Payments
             </Link>
           )}
           <Link 
             href={`/exams/admin/${exam.id}`}
             className="edit-link"
           >
             Edit
           </Link>
         </div>
       </div>
     );
   }
   ```

8. **Update Exam API Hooks for Payment Integration**
   - Add payment-related data fetching to exam hooks
   - Implement payment status checks in exam queries
   - Create hooks for exam payment management

   ```tsx
   // src/features/exams/api/hooks/useExamPayments.ts
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { apiClient } from '@/core/api';
   
   export const useExamPaymentsQuery = (examId: number) => {
     return useQuery({
       queryKey: ['exam-payments', examId],
       queryFn: async () => {
         const { data } = await apiClient.get(`/exams/${examId}/payments`);
         return data;
       },
       enabled: !!examId,
     });
   };
   
   export const useUpdateExamPremiumStatusMutation = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: async ({ 
         examId, 
         isPremium 
       }: { 
         examId: number; 
         isPremium: boolean 
       }) => {
         const { data } = await apiClient.patch(`/exams/${examId}/premium-status`, {
           isPremium
         });
         return data;
       },
       onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
         queryClient.invalidateQueries({ queryKey: ['exams'] });
       },
     });
   };
   
   export const useSetExamPriceMutation = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: async ({ 
         examId, 
         price 
       }: { 
         examId: number; 
         price: number 
       }) => {
         const { data } = await apiClient.patch(`/exams/${examId}/price`, {
           price
         });
         return data;
       },
       onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
       },
     });
   };
   ```

9. **Implement Exam Types for Payment**
   - Update types to include payment-related fields
   - Create interfaces for payment requests and status
   - Add premium exam type definitions

   ```tsx
   // src/features/exams/types/payment.ts
   export interface PaymentRequest {
     id: string;
     examId: number;
     userId: string;
     amount: number;
     status: PaymentStatus;
     notes?: string;
     createdAt: string;
     updatedAt: string;
     approvedAt?: string;
     rejectedAt?: string;
     reference?: string;
   }
   
   export enum PaymentStatus {
     PENDING = 'PENDING',
     APPROVED = 'APPROVED',
     REJECTED = 'REJECTED',
     REFUNDED = 'REFUNDED'
   }
   
   export interface PaymentSummary {
     totalPayments: number;
     pendingPayments: number;
     approvedPayments: number;
     rejectedPayments: number;
     totalRevenue: number;
   }
   
   // src/features/exams/types/exam.ts (Updated)
   export interface Exam {
     id: number;
     title: string;
     description?: string;
     status: ExamStatus;
     questionCount: number;
     timeLimit?: number;
     passingScore: number;
     createdAt: string;
     updatedAt: string;
     publishedAt?: string;
     // Payment-related fields
     isPremium: boolean;
     price?: number;
   }
   ```

## Integration Code Samples

### Exam Container with Payment Integration

```tsx
// src/features/exams/components/organisms/ExamContainer.tsx
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { PremiumExamInfoProvider } from '@/features/payments';
import { ExamContext } from '@/features/exams/context';
import { ExamHeader } from '@/features/exams/components/molecules';
import { LoadingSpinner } from '@/features/exams/components/feedback';

interface ExamContainerProps {
  children: React.ReactNode;
}

export function ExamContainer({ children }: ExamContainerProps) {
  const params = useParams();
  const examId = parseInt(params.examId as string, 10);
  
  return (
    <PremiumExamInfoProvider examId={examId}>
      <ExamContext.Provider value={{ examId }}>
        <div className="exam-container">
          <Suspense fallback={<LoadingSpinner />}>
            <ExamHeader examId={examId} />
          </Suspense>
          
          <main className="exam-content">
            {children}
          </main>
        </div>
      </ExamContext.Provider>
    </PremiumExamInfoProvider>
  );
}
```

### Admin Premium Exam Settings

```tsx
// src/features/exams/components/admin/ExamPremiumSettings.tsx
'use client'

import { useState } from 'react';
import { Switch, TextField, Button } from '@/core/ui';
import { 
  useUpdateExamPremiumStatusMutation,
  useSetExamPriceMutation
} from '@/features/exams/api/hooks';

interface ExamPremiumSettingsProps {
  examId: number;
  isPremium: boolean;
  price: number;
}

export function ExamPremiumSettings({
  examId,
  isPremium: initialIsPremium,
  price: initialPrice,
}: ExamPremiumSettingsProps) {
  const [isPremium, setIsPremium] = useState(initialIsPremium);
  const [price, setPrice] = useState(initialPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updatePremiumMutation = useUpdateExamPremiumStatusMutation();
  const setPriceMutation = useSetExamPriceMutation();
  
  const handleTogglePremium = async (checked: boolean) => {
    setIsPremium(checked);
    
    try {
      await updatePremiumMutation.mutateAsync({
        examId,
        isPremium: checked
      });
    } catch (error) {
      console.error('Failed to update premium status:', error);
      setIsPremium(!checked); // Revert on error
    }
  };
  
  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setPriceMutation.mutateAsync({
        examId,
        price: parseFloat(price)
      });
    } catch (error) {
      console.error('Failed to update price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="exam-premium-settings">
      <h3>Premium Settings</h3>
      
      <div className="premium-toggle">
        <Switch
          checked={isPremium}
          onChange={handleTogglePremium}
          label="Premium Exam"
        />
        <p className="toggle-description">
          {isPremium 
            ? 'This exam requires payment to access' 
            : 'This exam is free to access'}
        </p>
      </div>
      
      {isPremium && (
        <form onSubmit={handlePriceSubmit} className="price-form">
          <div className="form-row">
            <label htmlFor="price">Price ($)</label>
            <TextField
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="secondary"
          >
            {isSubmitting ? 'Saving...' : 'Update Price'}
          </Button>
        </form>
      )}
    </div>
  );
}
```

## Verification Criteria
- Premium exams correctly identified in the UI
- Payment guards preventing access to unpaid premium exams
- Payment request flow working correctly
- Payment status indicators showing correct information
- Admin interfaces updated to show and manage premium status
- PremiumExamInfoProvider correctly integrated at appropriate levels
- API hooks updated for payment-related operations
- Types updated to include payment-related fields

## Time Estimate
Approximately 8-10 hours

## Dependencies
- Integration with the payments feature
- Availability of payment-related API endpoints
- Proper RBAC configuration for payment management

## Risks
- API changes may be required for premium exam management
- Integration points between features may introduce complexity
- Payment flow testing requires careful verification
