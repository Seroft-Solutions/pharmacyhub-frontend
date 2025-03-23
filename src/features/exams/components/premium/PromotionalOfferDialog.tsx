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
  const benefits = [
    { text: "Access to all premium exams", icon: Award },
    { text: "Unlimited attempts", icon: Infinity },
    { text: "Detailed performance analytics", icon: BookOpen },
    { text: "24/7 access", icon: ShieldCheck },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden rounded-xl p-0 border-0 shadow-2xl">
        {/* Banner section with discount highlight */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-6 relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
              <Badge className="bg-yellow-400 text-yellow-900 px-2 py-0.5">
                SPECIAL OFFER
              </Badge>
            </div>
            
            <DialogTitle className="text-2xl font-bold mb-2">
              Limited Time Premium Deal!
            </DialogTitle>
            
            <DialogDescription className="text-white/90 text-base mb-4">
              Unlock unlimited access to all premium exam papers at an incredible discount.
            </DialogDescription>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="text-xl text-white/70 line-through decoration-red-400 decoration-2">
                  PKR 4,000
                </span>
                <span className="absolute -top-3 -right-14 rotate-12 bg-red-500 text-white text-xs px-2 py-0.5 rounded-md">
                  -50% OFF
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                PKR 2,000
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>
        </div>
        
        {/* Paper preview section */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Selected Paper</h3>
          <p className="text-base font-bold text-slate-800">{paper.title}</p>
          <div className="flex items-center mt-1">
            <Badge className="mr-2 bg-blue-100 text-blue-800 border-blue-200">
              {paper.source}
            </Badge>
            <span className="text-sm text-slate-500">
              {paper.total_questions} questions • {paper.time_limit} minutes
            </span>
          </div>
        </div>
        
        {/* Benefits section */}
        <div className="px-6 py-4">
          <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
            <BadgePercent className="h-5 w-5 text-green-600 mr-2" />
            Pay Once, Get Everything
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                <benefit.icon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-800">
                Limited time offer - Get instant access today!
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-6 pt-2 bg-white border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="order-2 sm:order-1"
            >
              Maybe later
            </Button>
            
            <Button
              onClick={onProceed}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-800 order-1 sm:order-2"
              size="lg"
            >
              <CreditCard className="h-4 w-4" />
              Proceed to Payment
            </Button>
          </div>
          
          <div className="w-full text-center mt-3">
            <p className="text-xs text-slate-500 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
              Secure payment processing • 100% satisfaction guaranteed
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};