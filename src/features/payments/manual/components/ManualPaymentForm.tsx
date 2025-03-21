'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useSubmitManualPayment } from '../api/hooks/useManualPaymentApiHooks';
import { ExamPaper } from '@/features/exams/types/StandardTypes';

const formSchema = z.object({
  senderNumber: z.string().min(11, 'Phone number must be at least 11 digits'),
  transactionId: z.string().min(4, 'Transaction ID is required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ManualPaymentFormProps {
  exam: ExamPaper;
  onSuccess?: () => void;
}

export const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({ exam, onSuccess }) => {
  const router = useRouter();
  const { mutate: submitPayment, isLoading } = useSubmitManualPayment();
  
  // Remove dev logging
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderNumber: '',
      transactionId: '',
      notes: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      // Log form submission
      console.log('Submitting payment form with values:', values);
      console.log('Exam ID:', exam.id);
      
      // Set loading state
      form.formState.isSubmitting = true;
      
      // Get the auth token if available
      const token = localStorage.getItem('accessToken');
      console.log('Auth token available:', !!token);
      
      // Create request payload
      const payload = {
        examId: exam.id as number,
        senderNumber: values.senderNumber,
        transactionId: values.transactionId,
        notes: values.notes || '',
      };
      
      console.log('Submitting payment with payload:', payload);
      
      // Make direct API call using fetch
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/v1/payments/manual/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Received API response:', response.status, response.statusText);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      // Reset loading state
      form.formState.isSubmitting = false;
      
      if (response.ok) {
        // Success flow
        toast.success('Payment request submitted', {
          description: 'Your payment is pending admin verification.',
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/payments/pending?examId=${exam.id}`);
        }
      } else {
        // Error flow
        const errorMessage = responseData.message || responseData.error || 'Server error, please try again.';
        console.error('Payment submission error:', errorMessage);
        toast.error('Failed to submit payment', {
          description: errorMessage,
        });
      }
    } catch (err) {
      // Reset loading state
      form.formState.isSubmitting = false;
      
      console.error('Exception during payment submission:', err);
      toast.error('Failed to submit payment', {
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <Card className="shadow-md overflow-hidden border-border">
        <CardHeader className="border-b bg-card/50 pb-6">
          <CardTitle className="text-xl md:text-2xl font-bold">Manual Payment Form</CardTitle>
          <CardDescription className="text-sm mt-2 max-w-2xl">
            Please submit your JazzCash payment details
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-8 p-5 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold text-base mb-3 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              JazzCash Payment Instructions
            </h3>
            <div className="h-px w-full bg-border/60 mb-4"></div>
            <ol className="list-decimal pl-5 space-y-2.5 text-sm text-muted-foreground">
              <li>Open JazzCash mobile app or dial <span className="font-medium text-foreground">*786#</span></li>
              <li>Select "Send Money" or "Mobile Account"</li>
              <li>Enter recipient number: <span className="font-medium text-foreground">03001234567</span></li>
              <li>Enter amount: <span className="font-medium text-foreground">PKR {exam.price || 2000}</span></li>
              <li>Confirm and complete the transaction</li>
              <li>Save the transaction ID and enter it below</li>
            </ol>
          </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="senderNumber"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-base font-medium">Sender Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="03001234567" 
                      {...field} 
                      className="h-11 mt-1.5"
                    />
                  </FormControl>
                  <FormDescription className="text-xs mt-1.5">
                    The phone number you used to send the payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-base font-medium">Transaction ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456789" 
                      {...field} 
                      className="h-11 mt-1.5"
                    />
                  </FormControl>
                  <FormDescription className="text-xs mt-1.5">
                    The transaction ID from your JazzCash payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-base font-medium">Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information..." 
                      {...field} 
                      className="min-h-[100px] mt-1.5 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-4" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner className="mr-2" size="sm" /> : null}
              Submit Payment Details
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t py-4 px-6 bg-muted/20 text-sm text-muted-foreground">
        <div>Need help? Contact <span className="text-primary hover:underline">support@pharmacyhub.pk</span></div>
      </CardFooter>
    </Card>
    </div>
  );
};

export default ManualPaymentForm;