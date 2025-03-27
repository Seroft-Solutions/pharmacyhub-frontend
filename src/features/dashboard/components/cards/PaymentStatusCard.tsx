'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Calendar, ChevronRight } from 'lucide-react';

interface PaymentStatusCardProps {
  isPremium: boolean;
  expiryDate?: string;
  premiumExams?: number;
  loading?: boolean;
  className?: string;
  onUpgrade?: () => void;
}

/**
 * PaymentStatusCard - A component for displaying subscription/payment status
 */
export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  isPremium,
  expiryDate,
  premiumExams = 0,
  loading = false,
  className = '',
  onUpgrade,
}) => {
  // If loading, show a skeleton UI
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <div className="h-4 w-32 animate-pulse bg-muted rounded mt-1"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 animate-pulse bg-muted rounded"></div>
        </CardContent>
        <CardFooter>
          <div className="h-9 w-full animate-pulse bg-muted rounded"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>
          {isPremium ? 'Premium Subscription Active' : 'Free Account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          {isPremium ? (
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Premium Access</p>
                {expiryDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Expires on {expiryDate}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Free Account</p>
                <p className="text-xs text-muted-foreground">
                  {premiumExams} premium exams available
                </p>
              </div>
            </div>
          )}
        </div>

        {isPremium ? (
          <div className="text-sm">
            <p>You have access to all premium exams and features.</p>
          </div>
        ) : (
          <div className="text-sm">
            <p>Upgrade to premium to access all exams and features.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isPremium && (
          <Button 
            className="w-full" 
            onClick={onUpgrade}
          >
            Upgrade to Premium
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
        {isPremium && (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onUpgrade}
          >
            Manage Subscription
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentStatusCard;
