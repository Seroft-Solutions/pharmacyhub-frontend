'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { useSubmitManualPayment } from '../api/hooks/useManualPaymentApiHooks';
import { ExamPaper } from '@/features/exams/types/StandardTypes';
import { Upload, Send, Phone, Building, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form schema without Transaction ID
const formSchema = z.object({
  senderNumber: z.string().min(11, 'Phone number must be at least 11 digits'),
  notes: z.string().optional(),
  // Screenshot validation handled separately
});

type FormValues = z.infer<typeof formSchema>;

interface ManualPaymentFormProps {
  exam: ExamPaper;
  onSuccess?: () => void;
}

export const ManualPaymentForm: React.FC<ManualPaymentFormProps> = ({ exam, onSuccess }) => {
  const router = useRouter();
  const { mutate: submitPayment, isLoading } = useSubmitManualPayment();
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  
  // State for file upload
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderNumber: '',
      notes: '',
    },
  });
  
  // Account details with all payment methods
  const accountDetails = {
    mobile: {
      name: "Hafiz Gulshair Ahmad",
      number: "03137020758",
      amount: exam?.price || 2000,
    },
    bank: {
      name: "Hafiz Gulshair Ahmad",
      bank: "Meezan Bank",
      accountNumber: "12750106766713",
      amount: exam?.price || 2000,
    }
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScreenshotError(null);
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setScreenshotError('Please upload a JPG or PNG image');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setScreenshotError('Image must be smaller than 5MB');
      return;
    }
    
    // Set file for preview
    setScreenshot(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Compress and convert to base64
    compressAndConvertToBase64(file);
  };
  
  // Remove selected file
  const removeFile = () => {
    setScreenshot(null);
    setPreviewUrl(null);
    setScreenshotBase64(null);
    setScreenshotError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Compress image and convert to base64
  const compressAndConvertToBase64 = async (file: File) => {
    try {
      setIsCompressing(true);
      setCompressProgress(10);
      
      // Create image element to load the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          // Progress update - image loaded
          setCompressProgress(30);
          
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions (max 1200px width/height)
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;
          
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Progress update - dimensions calculated
          setCompressProgress(50);
          
          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Progress update - image drawn
          setCompressProgress(70);
          
          // Convert to base64 with reduced quality
          const quality = 0.7; // 70% quality for compression
          const fullBase64String = canvas.toDataURL('image/jpeg', quality);
          
          // Extract only the base64 data part (after the comma)
          const base64Data = fullBase64String.split(',')[1];
          
          // Progress update - conversion complete
          setCompressProgress(90);
          
          // Set the base64 string for submission
          setScreenshotBase64(base64Data);
          
          // Finish compression
          setCompressProgress(100);
          
          setTimeout(() => {
            setIsCompressing(false);
          }, 500);
        } catch (err) {
          console.error('Error during image processing:', err);
          setScreenshotError('Failed to process the image. Please try another image.');
          setIsCompressing(false);
        }
      };
      
      img.onerror = () => {
        setScreenshotError('Failed to load the image. Please try another image.');
        setIsCompressing(false);
      };
    } catch (err) {
      console.error('Error compressing image:', err);
      setScreenshotError('Failed to process the image. Please try another image.');
      setIsCompressing(false);
    }
  };
  
  // Handle WhatsApp sharing
  const shareToWhatsApp = () => {
    if (!screenshot) return;
    
    // The WhatsApp phone number (include country code)
    const phoneNumber = '923137020758'; // Include country code
    
    // Craft message text with enhanced information
    const messageText = `*Payment Details for ${exam?.title || 'Premium Content'}*%0A%0A` +
    `🧾 *Transaction Information*:%0A` +
    `- Transaction ID: ${paymentMethod === 'mobile' ? 'Mobile' : 'Bank'}-Payment%0A` +
    `- Payment Method: ${paymentMethod === 'mobile' ? 'JazzCash/EasyPaisa' : 'Meezan Bank'}%0A` +
    `- Amount: PKR ${paymentMethod === 'mobile' ? accountDetails.mobile.amount : accountDetails.bank.amount}%0A` +
    `- Sender Number: ${form.getValues('senderNumber')}%0A%0A` +
    `📱 *User Notes*: ${form.getValues('notes') || 'None'}%0A%0A` +
    `⚠️ *IMPORTANT*: Please attach your payment screenshot now using the paperclip icon below.`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${phoneNumber}?text=${messageText}`, '_blank');
  };
  
  const onSubmit = async (values: FormValues) => {
    // Validate screenshot
    if (!screenshot || !screenshotBase64) {
      setScreenshotError('Please upload your payment screenshot');
      return;
    }
    
    try {
      // Create request payload
      const payload = {
        examId: exam.id as number,
        senderNumber: values.senderNumber,
        transactionId: `${paymentMethod === 'mobile' ? 'Mobile' : 'Bank'}-Payment`, // Generic identifier 
        notes: values.notes || '',
        screenshotData: screenshotBase64,
      };
      
      // Debug: Log the payload (without the full image data)
      console.log('Submitting payload:', {
        ...payload, 
        screenshotData: screenshotBase64 ? `${screenshotBase64.substring(0, 50)}... [truncated]` : null
      });
      
      // Submit directly using fetch for debugging
      try {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        
        console.log(`Making direct API call to ${apiUrl}/api/v1/payments/manual/request`);
        
        const response = await fetch(`${apiUrl}/api/v1/payments/manual/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        console.log('Direct API response:', responseData);
        
        if (response.ok) {
          // Success handling
          toast({
            title: "Payment details submitted",
            description: "Your payment is pending admin verification.",
            variant: "default",
          });
          
          // Show WhatsApp sharing dialog
          setShowShareDialog(true);
          
          // Handle navigation after dialog is closed
          // This will happen when the user clicks one of the dialog buttons
        } else {
          // Error handling
          const errorMessage = responseData.message || responseData.error || 'Server error, please try again.';
          toast({
            title: "Failed to submit payment",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error making direct API call:', err);
        
        // Fall back to using the hook if direct call fails
        submitPayment(payload, {
          onSuccess: (data) => {
            console.log('Submit payment hook success:', data);
            
            toast({
              title: "Payment details submitted",
              description: "Your payment is pending admin verification.",
              variant: "default",
            });
            
            // Show WhatsApp sharing dialog
            setShowShareDialog(true);
            
            // Handle navigation after dialog is closed
            // This will happen when the user clicks one of the dialog buttons
          },
          onError: (error: any) => {
            console.error('Submit payment hook error:', error);
            
            // Error handling
            const errorMessage = error?.message || 'Server error, please try again.';
            toast({
              title: "Failed to submit payment",
              description: errorMessage,
              variant: "destructive",
            });
          }
        });
      }
    } catch (err) {
      console.error('Exception during payment submission:', err);
      toast({
        title: "Failed to submit payment",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  return (
    <div className="w-full flex justify-center items-start pl-4 pr-6 py-4"> {/* Adjusted positioning */}
      {/* WhatsApp Sharing Alert Dialog */}
      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Payment Details to WhatsApp</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Would you like to send your payment details to our support team on WhatsApp for faster verification?</p>
              <div className="mt-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">Important:</p>
                <ol className="text-sm text-blue-700 list-decimal pl-4 space-y-1">
                  <li>WhatsApp will open with pre-filled payment details</li>
                  <li>You'll need to <strong>manually attach your screenshot</strong> after WhatsApp opens</li>
                  <li>Use the paperclip/attachment icon in WhatsApp to attach the same screenshot you uploaded here</li>
                </ol>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              // Handle navigation after choosing not to share
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(`/payments/pending?examId=${exam.id}`);
              }
            }}>Skip WhatsApp</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              // Share to WhatsApp
              shareToWhatsApp();
              
              // Then handle navigation
              if (onSuccess) {
                onSuccess();
              } else {
                router.push(`/payments/pending?examId=${exam.id}`);
              }
            }} className="gap-1.5 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
              Send to WhatsApp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Card className="w-full max-w-2xl shadow-sm overflow-hidden border-border"> {/* Reduced max width */}
        <CardHeader className="border-b bg-primary/5 pb-3">
          <CardTitle className="text-lg md:text-xl font-bold">Manual Payment Form</CardTitle>
          <CardDescription className="text-sm">
            Please submit your payment details
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Payment Method Tabs */}
          <div className="mb-4">
            <Tabs defaultValue="mobile" value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="mobile" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span>JazzCash/EasyPaisa</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  <span>Bank Transfer</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mobile" className="mt-0">
                <div className="bg-muted/30 rounded-lg border border-border p-3">
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <span className="text-sm font-medium">Account Name:</span>
                    <span className="text-sm text-right">{accountDetails.mobile.name}</span>
                    
                    <span className="text-sm font-medium">Mobile Number:</span>
                    <span className="text-sm font-mono text-right">{accountDetails.mobile.number}</span>
                    
                    <span className="text-sm font-medium">Amount:</span>
                    <span className="text-sm text-right">PKR {accountDetails.mobile.amount}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1 mt-2 border-t pt-2">
                    <p>1. Open JazzCash or EasyPaisa app, select "Send Money"</p>
                    <p>2. Enter the number above, and complete payment</p>
                    <p>3. Take a screenshot of your payment confirmation</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bank" className="mt-0">
                <div className="bg-muted/30 rounded-lg border border-border p-3">
                  <div className="grid grid-cols-2 gap-1 mb-1">
                    <span className="text-sm font-medium">Bank:</span>
                    <span className="text-sm text-right">{accountDetails.bank.bank}</span>
                    
                    <span className="text-sm font-medium">Account Name:</span>
                    <span className="text-sm text-right">{accountDetails.bank.name}</span>
                    
                    <span className="text-sm font-medium">Account Number:</span>
                    <span className="text-sm font-mono text-right">{accountDetails.bank.accountNumber}</span>
                    
                    <span className="text-sm font-medium">Amount:</span>
                    <span className="text-sm text-right">PKR {accountDetails.bank.amount}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1 mt-2 border-t pt-2">
                    <p>1. Transfer the amount to the account number above</p>
                    <p>2. Take a screenshot of your payment confirmation</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Sender Number */}
              <FormField
                control={form.control}
                name="senderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Your Mobile Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="03001234567" 
                        {...field} 
                        className="h-9"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      The phone number you used for payment
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              {/* Screenshot upload field */}
              <div>
                <FormLabel className="text-sm font-medium block mb-1">
                  Payment Screenshot
                </FormLabel>
                
                {!previewUrl ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-lg p-4 text-center transition-colors
                      ${screenshotError 
                        ? 'border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400'
                        : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'}`
                    }
                  >
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                    <p className="text-xs font-medium">Upload your payment screenshot</p>
                    <p className="text-xs text-muted-foreground">JPG or PNG, max 5MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-lg border overflow-hidden">
                    <div className="h-36 bg-muted flex items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Payment Screenshot" 
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-background/80 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full p-1"
                      aria-label="Remove screenshot"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                    {isCompressing && (
                      <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-1">
                        <Progress value={compressProgress} className="h-1 w-full" />
                        <p className="text-xs text-center mt-0.5 text-muted-foreground">
                          Processing... {compressProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {screenshotError && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {screenshotError}
                  </p>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload payment screenshot"
                />
              </div>
              
              {/* Optional notes field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information..." 
                        {...field} 
                        className="min-h-[60px] resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              {/* WhatsApp info */}
              <Alert variant="default" className="bg-blue-50 border-blue-200 py-2 px-3">
                <div className="flex items-start gap-2">
                  <Send className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <AlertDescription className="text-blue-600 text-xs">
                      You can also send your payment details directly to us via WhatsApp for faster verification.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
              
              <Button 
                type="submit" 
                className="w-full h-10 text-sm" 
                disabled={isLoading || isCompressing}
              >
                {(isLoading || isCompressing) && <Spinner className="mr-2" size="sm" />}
                Submit Payment Details
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPaymentForm;