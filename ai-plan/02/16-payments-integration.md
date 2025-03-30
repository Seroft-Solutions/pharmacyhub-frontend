# Task R06: Implement Payment Routes

## Description
Create the routing structure for payment-related features within the Exams app, including payment history, status pages, payment details, and admin payment management.

## Implementation Steps

1. **Create Payment History Routes**
   - Implement user payment history page
   - Set up payment details page for individual payments
   - Create payment status page for ongoing payments

   ```tsx
   // src/app/(exams)/payments/page.tsx
   import { PaymentHistory } from '@/features/exams/components/organisms';
   import { Metadata } from 'next';
   
   export const metadata: Metadata = {
     title: 'Payment History - PharmacyHub Exams',
     description: 'View your exam payment history and status',
   };
   
   export default function PaymentHistoryPage() {
     return (
       <div className="payment-history-page">
         <h1>Payment History</h1>
         <PaymentHistory />
       </div>
     );
   }
   ```

2. **Implement Payment Layout**
   - Create shared layout for payment pages
   - Add payment-specific navigation

   ```tsx
   // src/app/(exams)/payments/layout.tsx
   import { PaymentNavigation } from '@/features/exams/components/navigation';
   
   export const metadata = {
     title: 'Payments - PharmacyHub Exams',
     description: 'Manage your exam payments',
   };
   
   export default function PaymentsLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="payments-layout">
         <PaymentNavigation />
         <div className="payments-content">
           {children}
         </div>
       </div>
     );
   }
   ```

3. **Create Payment Detail Routes**
   - Implement dynamic routes for viewing payment details
   - Add receipt and invoice pages

   ```tsx
   // src/app/(exams)/payments/[requestId]/page.tsx
   import { PaymentDetails } from '@/features/exams/components/organisms';
   import { getPaymentRequestById } from '@/features/exams/api/server';
   import { notFound } from 'next/navigation';
   
   export async function generateMetadata({ 
     params 
   }: { 
     params: { requestId: string } 
   }) {
     const payment = await getPaymentRequestById(params.requestId);
     
     if (!payment) {
       return {
         title: 'Payment Not Found',
       };
     }
     
     return {
       title: `Payment #${params.requestId} - PharmacyHub Exams`,
       description: `Details for payment request #${params.requestId}`,
     };
   }
   
   export default async function PaymentDetailsPage({ 
     params 
   }: { 
     params: { requestId: string } 
   }) {
     const payment = await getPaymentRequestById(params.requestId);
     
     if (!payment) {
       notFound();
     }
     
     return <PaymentDetails payment={payment} />;
   }
   ```

4. **Add Admin Payment Management Routes**
   - Create admin payment management dashboard
   - Implement approval/rejection routes
   - Add payment reports page

   ```tsx
   // src/app/(exams)/admin/payments/page.tsx
   import { AdminPaymentDashboard } from '@/features/exams/components/organisms';
   import { getPaymentSummary } from '@/features/exams/api/server';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   
   export const metadata = {
     title: 'Payment Management - PharmacyHub Admin',
     description: 'Manage exam payments and approvals',
   };
   
   export default async function AdminPaymentsPage() {
     const summary = await getPaymentSummary();
     
     return (
       <ExamOperationGuard operation={ExamOperation.MANAGE_PAYMENTS}>
         <div className="admin-payments-page">
           <h1>Payment Management</h1>
           <AdminPaymentDashboard summary={summary} />
         </div>
       </ExamOperationGuard>
     );
   }
   ```

5. **Implement Admin Payment Detail Routes**
   - Create admin routes for reviewing payment details
   - Add payment approval/rejection actions
   - Implement payment note and history pages

   ```tsx
   // src/app/(exams)/admin/payments/[requestId]/page.tsx
   import { AdminPaymentDetails } from '@/features/exams/components/organisms';
   import { getPaymentRequestById } from '@/features/exams/api/server';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   import { notFound } from 'next/navigation';
   
   export async function generateMetadata({ 
     params 
   }: { 
     params: { requestId: string } 
   }) {
     const payment = await getPaymentRequestById(params.requestId);
     
     if (!payment) {
       return {
         title: 'Payment Not Found - Admin',
       };
     }
     
     return {
       title: `Payment #${params.requestId} - Admin - PharmacyHub`,
       description: `Admin management for payment request #${params.requestId}`,
     };
   }
   
   export default async function AdminPaymentDetailsPage({ 
     params 
   }: { 
     params: { requestId: string } 
   }) {
     const payment = await getPaymentRequestById(params.requestId);
     
     if (!payment) {
       notFound();
     }
     
     return (
       <ExamOperationGuard operation={ExamOperation.MANAGE_PAYMENTS}>
         <AdminPaymentDetails payment={payment} />
       </ExamOperationGuard>
     );
   }
   ```

6. **Create Payment Action Routes**
   - Implement routes for payment actions (approve, reject, refund)
   - Add confirmation pages for important actions
   - Create success/failure pages for payment actions

   ```tsx
   // src/app/(exams)/admin/payments/[requestId]/approve/page.tsx
   'use client'
   
   import { useParams, useRouter } from 'next/navigation';
   import { AdminPaymentApproval } from '@/features/exams/components/organisms';
   import { ExamOperationGuard } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   
   export default function ApprovePaymentPage() {
     const params = useParams();
     const router = useRouter();
     const requestId = params.requestId as string;
     
     const handleCancel = () => {
       router.back();
     };
     
     const handleSuccess = () => {
       router.push(`/exams/admin/payments/${requestId}?approved=true`);
     };
     
     return (
       <ExamOperationGuard operation={ExamOperation.MANAGE_PAYMENTS}>
         <div className="approve-payment-page">
           <h1>Approve Payment</h1>
           <AdminPaymentApproval 
             requestId={requestId}
             onCancel={handleCancel}
             onSuccess={handleSuccess}
           />
         </div>
       </ExamOperationGuard>
     );
   }
   ```

7. **Add Payment Navigation Components**
   - Create payment-specific navigation components
   - Implement breadcrumbs for payment routes
   - Add payment links to main exam navigation

   ```tsx
   // src/features/exams/components/navigation/PaymentNavigation.tsx
   'use client'
   
   import Link from 'next/link';
   import { usePathname } from 'next/navigation';
   
   export function PaymentNavigation() {
     const pathname = usePathname();
     
     return (
       <nav className="payment-navigation">
         <ul>
           <li className={pathname === '/exams/payments' ? 'active' : ''}>
             <Link href="/exams/payments">Payment History</Link>
           </li>
           <li className={pathname === '/exams/payments/pending' ? 'active' : ''}>
             <Link href="/exams/payments/pending">Pending Payments</Link>
           </li>
         </ul>
       </nav>
     );
   }
   ```

8. **Implement Payment Forms**
   - Create forms for initiating payments
   - Add payment method selection components
   - Implement payment verification interfaces

   ```tsx
   // src/features/exams/components/organisms/PaymentForm.tsx
   'use client'
   
   import { useState } from 'react';
   import { useManualPaymentStore } from '@/features/payments';
   import { useRouter } from 'next/navigation';
   import { Button, Select, TextField } from '@/core/ui';
   
   interface PaymentFormProps {
     examId: number;
     examTitle: string;
     amount: number;
   }
   
   export function PaymentForm({ examId, examTitle, amount }: PaymentFormProps) {
     const [paymentMethod, setPaymentMethod] = useState('manual');
     const [notes, setNotes] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const { requestManualPayment } = useManualPaymentStore();
     const router = useRouter();
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);
       
       try {
         await requestManualPayment(examId, notes);
         router.push(`/exams/payments?requested=true`);
       } catch (error) {
         console.error('Payment request failed:', error);
       } finally {
         setIsSubmitting(false);
       }
     };
     
     return (
       <form onSubmit={handleSubmit} className="payment-form">
         <h2>Request Payment for {examTitle}</h2>
         
         <div className="form-group">
           <label>Amount</label>
           <div className="amount">${amount.toFixed(2)}</div>
         </div>
         
         <div className="form-group">
           <label htmlFor="paymentMethod">Payment Method</label>
           <Select
             id="paymentMethod"
             value={paymentMethod}
             onChange={(e) => setPaymentMethod(e.target.value)}
             options={[
               { value: 'manual', label: 'Manual Bank Transfer' }
             ]}
           />
         </div>
         
         <div className="form-group">
           <label htmlFor="notes">Payment Notes (Optional)</label>
           <TextField
             id="notes"
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             multiline
             rows={3}
             placeholder="Add any additional information about your payment"
           />
         </div>
         
         <div className="form-actions">
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
             {isSubmitting ? 'Submitting...' : 'Submit Payment Request'}
           </Button>
         </div>
       </form>
     );
   }
   ```

9. **Create Payment Receipt Components**
   - Implement receipt display components
   - Add printable receipt functionality
   - Create invoice components

   ```tsx
   // src/features/exams/components/organisms/PaymentReceipt.tsx
   import { format } from 'date-fns';
   import { Button } from '@/core/ui';
   
   interface PaymentReceiptProps {
     payment: {
       id: string;
       examTitle: string;
       amount: number;
       status: string;
       createdAt: string;
       approvedAt?: string;
       reference?: string;
     };
   }
   
   export function PaymentReceipt({ payment }: PaymentReceiptProps) {
     const handlePrint = () => {
       window.print();
     };
     
     return (
       <div className="payment-receipt">
         <div className="receipt-header">
           <h2>Payment Receipt</h2>
           <Button
             variant="secondary"
             onClick={handlePrint}
             className="print-button no-print"
           >
             Print Receipt
           </Button>
         </div>
         
         <div className="receipt-body">
           <div className="receipt-row">
             <div className="receipt-label">Receipt ID:</div>
             <div className="receipt-value">{payment.id}</div>
           </div>
           
           <div className="receipt-row">
             <div className="receipt-label">Exam:</div>
             <div className="receipt-value">{payment.examTitle}</div>
           </div>
           
           <div className="receipt-row">
             <div className="receipt-label">Amount:</div>
             <div className="receipt-value">${payment.amount.toFixed(2)}</div>
           </div>
           
           <div className="receipt-row">
             <div className="receipt-label">Status:</div>
             <div className="receipt-value status-{payment.status.toLowerCase()}">
               {payment.status}
             </div>
           </div>
           
           <div className="receipt-row">
             <div className="receipt-label">Date:</div>
             <div className="receipt-value">
               {format(new Date(payment.createdAt), 'PPP')}
             </div>
           </div>
           
           {payment.approvedAt && (
             <div className="receipt-row">
               <div className="receipt-label">Approved:</div>
               <div className="receipt-value">
                 {format(new Date(payment.approvedAt), 'PPP')}
               </div>
             </div>
           )}
           
           {payment.reference && (
             <div className="receipt-row">
               <div className="receipt-label">Reference:</div>
               <div className="receipt-value">{payment.reference}</div>
             </div>
           )}
         </div>
         
         <div className="receipt-footer">
           <p>Thank you for your payment!</p>
         </div>
       </div>
     );
   }
   ```

## Verification Criteria
- All payment routes implemented and accessible
- Payment navigation properly integrated with exam navigation
- Admin payment management routes working with proper access control
- Dynamic routes for payment details functioning correctly
- Payment forms submitting and processing correctly
- Receipt and invoice generation working properly
- Navigation between payment routes functioning correctly
- Loading and error states implemented for payment pages

## Time Estimate
Approximately 6-8 hours

## Dependencies
- Completion of Task R01 (Create Basic Route Group Structure)
- Completion of Task 16 (Integrate Payment System for Exam Preparation)
- Proper integration with payments feature components
