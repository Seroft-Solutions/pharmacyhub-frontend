"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  CreditCard,
  ShieldCheck,
  Infinity,
  BookOpen,
  X,
  Star,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ExamPaperMetadata } from '../../types/StandardTypes';

interface PromotionalOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  paper: ExamPaperMetadata;
}

export const PromotionalOfferDialog: React.FC<PromotionalOfferDialogProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }} 
      modal={true}
    >
      <DialogContent className="w-[92vw] sm:w-auto sm:max-w-md md:max-w-lg rounded-xl p-0 border-0 shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white p-6 relative overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="text-white hover:bg-white/20 absolute top-3 right-3 h-8 w-8 p-0 z-20 rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <Star className="h-6 w-6 text-yellow-300 mr-2" />
              <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-semibold">
                LIMITED TIME PREMIUM DEAL
              </Badge>
            </div>
            
            <DialogTitle className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Unlock Everything!
            </DialogTitle>
            
            <div className="text-white/90 text-lg mb-6 leading-relaxed">
              <div className="font-semibold text-yellow-200 mb-2">
                One-time payment – Full access to all content on the website
              </div>
              <div className="text-sm">
                Pay once, unlock everything – the entire website becomes accessible
              </div>
            </div>
            
            {/* Pricing */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-xl text-white/60 line-through decoration-red-400 decoration-2">
                  PKR 5,000
                </span>
                <span className="absolute -top-4 -right-8 rotate-12 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                  60% OFF
                </span>
              </div>
              <div className="text-4xl font-bold text-white">
                PKR 2,000
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5">
          {/* Main Value Proposition */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-5">
            <div className="flex items-start">
              <Zap className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-green-800 text-lg mb-1">
                  Complete Website Access
                </div>
                <div className="text-green-700 text-sm leading-relaxed">
                  Access every exam paper, every category, every feature. No restrictions, no additional payments needed.
                </div>
              </div>
            </div>
          </div>
          
          {/* Key Benefits */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">All past papers, model papers & practice tests</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Every exam category and subject</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Performance analytics & detailed results</span>
            </div>
            <div className="flex items-center">
              <Infinity className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Lifetime access - never expires</span>
            </div>
          </div>
          
          {/* Urgency */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-amber-800">
                <div className="font-semibold mb-1">Limited Time Offer</div>
                <div className="text-sm">This special pricing won't last long. Secure your lifetime access today!</div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-6 pt-0">
          <div className="flex flex-col items-center w-full gap-3">
            <Button
              onClick={onProceed}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-700 hover:to-blue-800 text-lg py-3 h-auto px-8 font-semibold w-full max-w-xs"
              size="lg"
            >
              <CreditCard className="h-5 w-5" />
              Get Lifetime Access - PKR 2,000
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Maybe later
            </Button>
            
            <div className="flex items-center justify-center mt-2">
              <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xs text-slate-500">Secure payment • Instant activation</span>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};