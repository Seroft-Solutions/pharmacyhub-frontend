'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, CreditCard, Heart, ShieldCheck, Star, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DetailedPaymentStatusProps {
  isPremium: boolean;
  expiryDate?: string;
  nextPaymentDate?: string;
  planName?: string;
  paymentMethod?: string;
  paymentHistory?: Payment[];
  loading?: boolean;
  onUpgrade?: () => void;
  onManageSubscription?: () => void;
  remainingPercentage?: number;
}

/**
 * DetailedPaymentStatus - A comprehensive card showing payment status and subscription details
 */
export function DetailedPaymentStatus({
  isPremium,
  expiryDate,
  nextPaymentDate,
  planName = 'Premium Plan',
  paymentMethod,
  paymentHistory = [],
  loading = false,
  onUpgrade,
  onManageSubscription,
  remainingPercentage = 0,
}: DetailedPaymentStatusProps) {
  const router = useRouter();
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push('/payments/premium');
    }
  };
  
  const handleManageSubscription = () => {
    if (onManageSubscription) {
      onManageSubscription();
    } else {
      router.push('/payments/manage');
    }
  };
  
  // Format a date in a more readable way
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining if expiry date is provided
  const calculateDaysRemaining = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Days remaining in subscription
  const daysRemaining = expiryDate ? calculateDaysRemaining(expiryDate) : 0;
  
  // Generate loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <Separator />
          <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </CardContent>
        <CardFooter>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${isPremium ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isPremium ? (
                <>
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Premium Subscription</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                  <span>Free Account</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isPremium 
                ? `Your premium benefits are active until ${formatDate(expiryDate || '')}`
                : 'Upgrade to premium for full access to all features'}
            </CardDescription>
          </div>
          {isPremium && (
            <Badge variant="outline" className="bg-yellow-100 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {isPremium ? (
          <>
            {/* Subscription details for premium users */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Subscription Status</div>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className="font-medium">{daysRemaining} days</span>
                </div>
                <Progress value={remainingPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Plan</div>
                  <div className="font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {planName}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Next Payment</div>
                  <div className="font-medium">
                    {nextPaymentDate 
                      ? formatDate(nextPaymentDate)
                      : 'N/A'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-medium flex items-center gap-1">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    {paymentMethod || 'Not specified'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Auto-Renewal</div>
                  <div className="font-medium flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Enabled
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Recent Payment History */}
            {paymentHistory && paymentHistory.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Recent Payments</div>
                <div className="space-y-2">
                  {paymentHistory.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        {payment.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {payment.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {payment.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <div>
                          <div className="text-sm font-medium">${payment.amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(payment.date)}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${payment.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : ''}
                            ${payment.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' : ''}
                            ${payment.status === 'failed' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : ''}
                          `}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Premium benefits for free users */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Premium Benefits</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 bg-blue-100 p-1.5 rounded-full text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Unlimited Access</div>
                    <div className="text-xs text-muted-foreground">
                      Access all exam papers including premium content
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 bg-purple-100 p-1.5 rounded-full text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Advanced Analytics</div>
                    <div className="text-xs text-muted-foreground">
                      Detailed insights into your performance metrics
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 bg-green-100 p-1.5 rounded-full text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Personalized Study Plan</div>
                    <div className="text-xs text-muted-foreground">
                      Tailored study recommendations based on your performance
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 bg-amber-100 p-1.5 rounded-full text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Priority Support</div>
                    <div className="text-xs text-muted-foreground">
                      Get help faster with dedicated support channels
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-2 px-4 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400">
              Upgrade today to unlock all premium features and enhance your exam preparation!
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 flex gap-3 dark:bg-gray-800 px-6 py-4">
        {isPremium ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleManageSubscription}
              className="flex-1"
            >
              Manage Subscription
            </Button>
            <Button 
              variant="default" 
              onClick={() => router.push('/payments/history')}
              className="flex-1"
            >
              Payment History
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DetailedPaymentStatus;