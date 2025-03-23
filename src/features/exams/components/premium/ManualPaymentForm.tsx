"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExamPaperMetadata } from '../../types/StandardTypes';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  ChevronsUpDown,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ArrowLeft
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface ManualPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  paper: ExamPaperMetadata;
}

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  paymentMethod: z.string({
    required_error: "Please select a payment method.",
  }),
  transactionId: z.string().optional(),
  message: z.string().optional(),
});

export const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  paper,
}) => {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'instructions' | 'form'>('instructions');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: "",
      transactionId: "",
      message: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText("HABIB BANK LIMITED - 123456789012345");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Manual Payment Details
          </DialogTitle>
          <DialogDescription>
            Complete your payment to gain access to all premium content.
          </DialogDescription>
        </DialogHeader>

        {step === 'instructions' ? (
          <>
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">Payment Instructions</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Follow these steps to complete your payment and unlock premium access.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 border rounded-lg bg-slate-50">
                <h3 className="font-semibold mb-2 text-slate-800">1. Transfer PKR 2,000 to our account</h3>
                <div className="bg-white p-3 rounded border flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">HABIB BANK LIMITED - 123456789012345</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyAccountDetails}
                    className="flex items-center"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-600 mb-4">Account Title: PharmacyHub Education</p>
                
                <h3 className="font-semibold mb-2 text-slate-800">2. Complete the payment form</h3>
                <p className="text-sm text-slate-600 mb-2">
                  After making the payment, fill out the form with your payment details. We'll verify your 
                  payment and grant you access within 24 hours.
                </p>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4">
                  <p className="text-sm text-amber-800 flex items-start">
                    <AlertCircle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                    If you've already made the payment, proceed to the form and provide your transaction details.
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={() => setStep('form')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              >
                Continue to Payment Form
                <ChevronsUpDown className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('instructions')}
                className="mb-2 text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Instructions
              </Button>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <h3 className="text-sm font-medium text-blue-800">Order Summary</h3>
                <p className="text-sm text-blue-700 mt-1">Premium Access: PKR 2,000</p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Your full name" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Your email address" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Your phone number" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="easy_paisa">EasyPaisa</SelectItem>
                            <SelectItem value="jazz_cash">JazzCash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="transactionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter transaction ID or reference number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please provide the transaction ID or reference number from your payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Textarea
                            placeholder="Any additional details about your payment"
                            className="min-h-[80px] pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Payment Details
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};