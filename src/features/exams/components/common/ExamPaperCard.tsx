"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight,
  Tag,
  Crown,
  Lock,
  Clock3,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExamPaperMetadata, 
  ExamPaperProgress, 
  ExamPaperCardProps 
} from '../../types/StandardTypes';
import { PromotionalOfferDialog } from '../premium/PromotionalOfferDialog';
import ManualPaymentForm from '@/features/payments/manual/components/ManualPaymentForm';

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ 
  paper, 
  progress, 
  onStart 
}) => {
  const [promotionalDialogOpen, setPromotionalDialogOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  // Check if paper is premium - handle both properties that might indicate premium status
  const isPremium = paper.is_premium || paper.premium;
  
  // Get the payment status
  const paymentStatus = paper.paymentStatus || (isPremium ? 'NOT_PAID' : 'NOT_REQUIRED');
  
  // Debug payment status
  console.log('ExamPaperCard: Paper ID:', paper.id, 'Payment Status:', paper.paymentStatus, 'isPremium:', isPremium);
  
  // Check if user has access to this premium paper
  const hasPremiumAccess = 
    // Either the paper isn't premium, or...
    !isPremium || 
    // User has purchased this specific paper, or...
    paper.purchased || 
    // User has universal access to all premium content, or...
    paper.universalAccess || 
    // The payment status is PAID
    paymentStatus === 'PAID';

  const getButtonStylesByStatus = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'NOT_REQUIRED':
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
      case 'PENDING':
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-blue-300";
      case 'FAILED':
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 hover:from-red-200 hover:to-red-300";
      case 'NOT_PAID':
      default:
        return "bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border-yellow-300 hover:from-yellow-200 hover:to-amber-300";
    }
  };

  const getButtonContentByStatus = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'NOT_REQUIRED':
        return (
          <>
            Start Paper
            <ArrowRight className="h-4 w-4" />
          </>
        );
      case 'PENDING':
        return (
          <>
            Waiting for approval
            <Clock3 className="h-4 w-4" />
          </>
        );
      case 'FAILED':
        return (
          <>
            Retry Payment
            <AlertCircle className="h-4 w-4" />
          </>
        );
      case 'NOT_PAID':
      default:
        return (
          <>
            Purchase Access
            <Lock className="h-4 w-4" />
          </>
        );
    }
  };

  // Handle button click based on payment status
  const handleButtonClick = () => {
    // Debug the button click with payment status
    console.log('Button clicked. Payment status:', paymentStatus);
    
    // Only allow starting the paper if it's non-premium or already paid
    if (paymentStatus === 'PAID' || paymentStatus === 'NOT_REQUIRED') {
      onStart(paper);
    } else if (paymentStatus === 'PENDING') {
      // For pending payments, either show a message or do nothing
      console.log('Payment is pending approval');
      // We could optionally redirect to a payment status page
      // onStart(paper);
    } else {
      // For failed payments or not paid, show promotional dialog
      console.log('Opening promotional dialog');
      setPromotionalDialogOpen(true);
    }
  };
  
  // Handle proceeding to payment form from promotional dialog
  const handleProceedToPayment = () => {
    setPromotionalDialogOpen(false);
    setPaymentFormOpen(true);
  };
  
  // Handle payment form submission
  const handlePaymentFormClose = () => {
    setPaymentFormOpen(false);
    // We don't need to handle data here as the existing ManualPaymentForm
    // component already handles the API call and navigation
  };

  const difficultyVariants = {
    'easy': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    'medium': 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
    'hard': 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
  };
  
  const paperTypeColors = {
    'model': 'bg-blue-100 text-blue-700',
    'past': 'bg-purple-100 text-purple-700',
    'subject': 'bg-emerald-100 text-emerald-700',
    'practice': 'bg-cyan-100 text-cyan-700'
  };
  
  const typeIcon = {
    'model': Award,
    'past': FileText,
    'subject': BookOpen,
    'practice': Tag
  };

  const getDifficultyVariant = () => {
    const difficulty = paper.difficulty.toLowerCase();
    return difficultyVariants[difficulty as keyof typeof difficultyVariants] || difficultyVariants.medium;
  };

  const renderDifficultyBadge = () => (
    <Badge 
      className={`${getDifficultyVariant()} px-2 py-1 font-medium`}
      variant="outline"
    >
      {paper.difficulty.charAt(0).toUpperCase() + paper.difficulty.slice(1)}
    </Badge>
  );
  
  const getPaperTypeColor = () => {
    const source = paper.source.toLowerCase();
    return paperTypeColors[source as keyof typeof paperTypeColors] || paperTypeColors.model;
  };
  
  const getPaperTypeIcon = () => {
    const source = paper.source.toLowerCase();
    const IconComponent = typeIcon[source as keyof typeof typeIcon] || typeIcon.model;
    return <IconComponent className="h-5 w-5" />;
  };

  const renderProgressBadge = () => {
    if (progress?.completed) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      {/* PHAR-172: Optimized card width and spacing */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full overflow-hidden rounded-xl border border-slate-200 max-w-xs mx-auto w-full" >
      {/* Colored bar at the top based on paper type */}
      <div className={`w-full h-2 ${paper.source === 'model' ? 'bg-blue-500' : paper.source === 'past' ? 'bg-purple-500' : paper.source === 'subject' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></div>
      
      <CardHeader className="pb-1 pt-2 px-2">
        <div className="flex flex-col w-full">
          {/* Badge row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {/* Premium Badge */}
              {isPremium && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                  <Crown className="h-2.5 w-2.5 text-yellow-600" />
                  Premium
                </Badge>
              )}
              
              {/* Purchased badge */}
              {isPremium && paymentStatus === 'PAID' && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                  Purchased
                </Badge>
              )}
            </div>
          </div>
          
          {/* Payment Status Badges (except Purchased, which was moved above) */}
          <div className="flex flex-wrap gap-1.5 mb-1 justify-center">
            {isPremium && paymentStatus === 'PENDING' && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                <Clock3 className="h-2.5 w-2.5 text-blue-600" />
                Pending
              </Badge>
            )}
            {isPremium && paymentStatus === 'FAILED' && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                <AlertCircle className="h-2.5 w-2.5 text-red-600" />
                Failed
              </Badge>
            )}
          </div>
          
          {/* Title and description */}
          <div className="mb-2 text-center">
            <CardTitle className="text-base line-clamp-1 mb-1">{paper.title}</CardTitle>
            {paper.description && (
                <CardDescription className="text-xs line-clamp-2 text-slate-500">{paper.description}</CardDescription>
              )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-0 pb-2 flex-grow">
        <div className="flex flex-col space-y-2">
          {/* PHAR-172: Optimized Question Count and Time Limit with tighter spacing */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="flex items-center p-1.5 rounded-md bg-slate-50 shadow-sm border border-slate-100">
              <FileText className="h-3.5 w-3.5 text-blue-600 mr-1" />
              <span className="text-sm font-bold text-slate-800">{paper.total_questions}</span>
              <span className="text-xs text-slate-500 ml-1">Questions</span>
            </div>
            <div className="flex items-center p-1.5 rounded-md bg-slate-50 shadow-sm border border-slate-100">
              <Clock className="h-3.5 w-3.5 text-purple-600 mr-1" />
              <span className="text-sm font-bold text-slate-800">{paper.time_limit}</span>
              <span className="text-xs text-slate-500 ml-1">Minutes</span>
            </div>
          </div>
        
          <div>
            {/* Difficulty */}
            <div className="flex justify-between items-center mb-1.5 bg-slate-50 p-1.5 rounded-md shadow-sm border border-slate-100">
              <span className="text-xs font-medium">Difficulty</span>
              {renderDifficultyBadge()}
            </div>
          </div>

          {/* Last Attempt Score - More compact layout */}
          {progress?.score && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center text-muted-foreground justify-between bg-slate-50 rounded-lg p-1.5">
                <span className="text-xs font-medium">Last Attempt</span>
                <div className="flex items-center bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  <span className="font-medium text-sm">{progress.score}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Card Footer */}
      <CardFooter className="p-2.5 pt-2 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center mb-1.5">
            {renderProgressBadge()}
          </div>
          <Button 
            onClick={handleButtonClick} 
            variant={!hasPremiumAccess ? "outline" : "default"}
            size="sm"
            // Disable the button if payment is pending
            disabled={paymentStatus === 'PENDING'}
            className={`w-5/6 gap-1 font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
              // If user has premium access, use the blue gradient
              hasPremiumAccess 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                // Otherwise, use the style based on payment status
                : getButtonStylesByStatus(paymentStatus)
            }`}
          >
            {/* Button content based on payment status */}
            {paymentStatus === 'PENDING' ? (
              <>
                Waiting for approval
                <Clock3 className="h-4 w-4" />
              </>
            ) : getButtonContentByStatus(paymentStatus)}
          </Button>
        </div>
      </CardFooter>
    </Card>
      
      {/* Promotional Dialog */}
      <PromotionalOfferDialog
        isOpen={promotionalDialogOpen}
        onClose={() => setPromotionalDialogOpen(false)}
        onProceed={handleProceedToPayment}
        paper={paper}
      />
      
      {/* Manual Payment Form */}
      {paymentFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Payment Details</h2>
              <Button variant="ghost" size="sm" onClick={handlePaymentFormClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ManualPaymentForm 
              exam={{
                ...paper,
                id: Number(paper.id),
                // Convert to ExamPaper structure expected by ManualPaymentForm
                questionCount: paper.total_questions,
                durationMinutes: paper.time_limit,
                tags: paper.topics_covered,
                type: paper.source,
                attemptCount: 0,
                successRatePercent: 0,
                lastUpdatedDate: new Date().toISOString()
              }} 
              onSuccess={handlePaymentFormClose}
            />
          </div>
        </div>
      )}
    </>
  );
};