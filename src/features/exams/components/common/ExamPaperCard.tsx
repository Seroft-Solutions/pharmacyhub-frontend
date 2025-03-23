"use client";

import React from 'react';
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
  AlertCircle
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

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ 
  paper, 
  progress, 
  onStart 
}) => {
  // Check if paper is premium - handle both properties that might indicate premium status
  const isPremium = paper.is_premium || paper.premium;
  
  // Get the payment status
  const paymentStatus = paper.paymentStatus || (isPremium ? 'NOT_PAID' : 'NOT_REQUIRED');
  
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
            Payment Pending
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
    // Only allow starting the paper if it's non-premium or already paid
    if (paymentStatus === 'PAID' || paymentStatus === 'NOT_REQUIRED') {
      onStart(paper);
    } else if (paymentStatus === 'PENDING') {
      // Maybe redirect to a payment status page
      console.log('Payment is pending');
      // For now, just call onStart which should handle the redirect
      onStart(paper);
    } else {
      // For failed payments or not paid, initiate purchase
      console.log('Initiate purchase');
      onStart(paper);
    }
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
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full overflow-hidden rounded-xl border border-slate-200" >
      {/* Colored bar at the top based on paper type */}
      <div className={`w-full h-2 ${paper.source === 'model' ? 'bg-blue-500' : paper.source === 'past' ? 'bg-purple-500' : paper.source === 'subject' ? 'bg-emerald-500' : 'bg-cyan-500'}`}></div>
      
      <CardHeader className="pb-1 pt-2">
        <div className="flex flex-col w-full">
          {/* Top row with type badges and paper ID */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {/* Paper Type Badge */}
              <Badge className={`${getPaperTypeColor()} font-medium ${paper.source === 'model' ? 'border-blue-200' : paper.source === 'past' ? 'border-purple-200' : paper.source === 'subject' ? 'border-emerald-200' : 'border-cyan-200'} text-xs py-0.5 px-1.5`}>
                <div className="flex items-center gap-1">
                  {getPaperTypeIcon()}
                  <span>{paper.source.charAt(0).toUpperCase() + paper.source.slice(1)}</span>
                </div>
              </Badge>
              
              {/* Premium Badge */}
              {isPremium && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                  <Crown className="h-2.5 w-2.5 text-yellow-600" />
                  Premium
                </Badge>
              )}
              
              {/* Paper ID */}
              <div className="text-xs text-slate-500 ml-1">ID: <span className="font-medium">{paper.id}</span></div>
            </div>
          </div>
          
          {/* Payment Status Badges */}
          <div className="flex flex-wrap gap-1.5 mb-1">
            {isPremium && paymentStatus === 'PAID' && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 font-medium text-xs py-0.5 px-1.5">
                <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                Purchased
              </Badge>
            )}
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
          
          {/* Title - No description here to avoid duplication */}
          <div className="mb-2">
            <CardTitle className="text-base line-clamp-1">{paper.title}</CardTitle>
          </div>
          
          {/* Price tag for premium papers */}
          {isPremium && (paymentStatus === 'NOT_PAID' || paymentStatus === 'FAILED') && paper.price && (
            <div className="mb-2 overflow-hidden relative rounded-md border border-yellow-200 shadow-sm">
              <div className="flex items-center justify-between p-1.5 bg-gradient-to-r from-yellow-50 to-amber-50">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-medium text-yellow-700">PKR</span>
                  <span className="text-base font-bold text-yellow-800">
                    {paper.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
                <div className="px-1.5 py-0.5 bg-green-100 rounded-sm flex items-center gap-1 border border-green-200">
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                  <span className="text-xs text-green-800">Buy once, access all</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-3 pt-0 pb-2 flex-grow">
        <div className="flex flex-col space-y-2">
          {/* Question Count and Time Limit */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex items-center p-1.5 rounded-md bg-slate-50 shadow-sm border border-slate-100">
              <FileText className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
              <span className="text-sm font-bold text-slate-800">{paper.total_questions}</span>
              <span className="text-xs text-slate-500 ml-1">Questions</span>
            </div>
            <div className="flex items-center p-1.5 rounded-md bg-slate-50 shadow-sm border border-slate-100">
              <Clock className="h-3.5 w-3.5 text-purple-600 mr-1.5" />
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
            
            {/* Topics */}
            <div>
              <span className="text-xs font-medium mb-1 inline-block">Topics</span>
              <div className="flex flex-wrap gap-1">
                {paper.topics_covered.slice(0, 3).map(topic => (
                  <Badge key={topic} variant="outline" className="text-xs px-1.5 py-0 border-slate-200 bg-slate-50 text-xs">
                    {topic}
                  </Badge>
                ))}
                {paper.topics_covered.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-slate-200 bg-slate-50">
                    +{paper.topics_covered.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Last Attempt Score */}
          {progress?.score && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center text-muted-foreground justify-between bg-slate-50 rounded-lg p-2">
                <span className="text-xs font-medium">Last Attempt</span>
                <div className="flex items-center bg-white px-2 py-1 rounded-md border border-slate-200">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  <span className="font-medium text-sm">{progress.score}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Updated Card Footer with cleaner styling */}
      <CardFooter className="p-3 pt-2 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            {renderProgressBadge()}
            {/* Show description here instead of in CardTitle section */}
            {paper.description && !renderProgressBadge() && (
              <div className="text-xs text-slate-500 line-clamp-1 max-w-[150px]">{paper.description}</div>
            )}
          </div>
          <Button 
            onClick={handleButtonClick} 
            variant={!hasPremiumAccess ? "outline" : "default"}
            size="sm"
            className={`gap-1 font-medium transition-all duration-300 shadow-sm hover:shadow-md ${hasPremiumAccess 
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
              : getButtonStylesByStatus(paymentStatus)}`}
          >
            {getButtonContentByStatus(paymentStatus)}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};