"use client";

import React from 'react';
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
  CheckCircle2, 
  Sparkles, 
  BadgePercent, 
  Clock, 
  CreditCard,
  ShieldCheck,
  Award,
  Infinity,
  BookOpen,
  X
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
  paper,
}) => {
  // Handle dialog close events
  const handleClose = () => {
    onClose();
  };

  const benefits = [
    { text: "ALL paper types", icon: Award },
    { text: "Lifetime access", icon: Infinity },
    { text: "Performance analytics", icon: BookOpen },
    { text: "24/7 access", icon: ShieldCheck },
  ];

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }} 
      modal={true}
    >
      <DialogContent className="w-[92vw] sm:w-auto sm:max-w-md md:max-w-lg rounded-xl p-0 border-0 shadow-2xl">
        {/* Banner section with discount highlight */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-4 sm:p-6 relative overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose} 
            className="text-white hover:bg-white/20 absolute top-2 right-2 h-10 w-10 p-0 z-20 cursor-pointer rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative z-10">
            <div className="flex items-center mb-1 sm:mb-3">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 mr-1.5 sm:mr-2" />
              <Badge className="bg-yellow-400 text-yellow-900 px-1.5 sm:px-2 py-0.5 text-xs sm:text-sm">
                SPECIAL OFFER
              </Badge>
            </div>
            
            <DialogTitle className="text-lg sm:text-2xl font-bold mb-2">
              Limited Time Premium Deal!
              <span className="text-sm sm:text-xl block mt-0.5">(Until PPSC Exam)</span>
            </DialogTitle>
            
            <DialogDescription className="text-white/90 text-xs sm:text-base mb-3 sm:mb-4 leading-tight">
            Unlock unlimited access to all premium exam papers (Past Papers, Model Papers, and Subject Papers) at an incredible discount. One payment gives you access to everything!
            </DialogDescription>
            
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="relative">
                <span className="text-base sm:text-xl text-white/70 line-through decoration-red-400 decoration-2">
                  PKR 4,000
                </span>
                <span className="absolute -top-3 -right-12 rotate-12 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md font-medium">
                  -50% OFF
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white leading-tight ml-1">
                PKR 2,000
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>
        </div>
        
        {/* Paper preview section removed as requested */}
        
        {/* Benefits section */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="flex items-center text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
            Premium Benefits
          </h3>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3 sm:mb-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-100">
                <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
            <div className="flex items-start">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-green-800 leading-tight">
                <strong>Single payment (PKR 2,000)</strong> for <strong>ALL papers</strong>. After PPSC Exam, pricing changes to per-category.
              </span>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
            <div className="flex items-start">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-amber-800 leading-tight">
                Act now! After PPSC Exam, price will increase to per-category pricing.
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-4 sm:p-6 pt-3 sm:pt-4 bg-white border-t border-slate-100">
          <div className="flex flex-col items-center w-full gap-2">
            <Button
              onClick={onProceed}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 text-xs sm:text-sm py-2 h-auto sm:h-10 px-6 sm:px-8 font-medium w-40 sm:w-48"
              size="default"
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-xs sm:text-sm py-1 font-medium text-slate-500 hover:text-slate-700 hover:bg-transparent"
            >
              Later
            </Button>
          </div>
          
          <div className="w-full text-center mt-2 sm:mt-3">
            <p className="text-[10px] sm:text-xs text-slate-500 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 sm:h-3 sm:w-3 text-green-600 mr-1" />
              Secure payment • 100% satisfaction
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};