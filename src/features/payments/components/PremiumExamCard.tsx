'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Wallet } from 'lucide-react';
import { ExamPaper } from '@/features/exams/types/StandardTypes';

interface PremiumExamCardProps {
  exam: ExamPaper;
  onPurchase: (examId: number) => void;
  onStart: (examId: number) => void;
}

export const PremiumExamCard: React.FC<PremiumExamCardProps> = ({ exam, onPurchase, onStart }) => {
  return (
    <Card className="overflow-hidden shadow-lg border-2 border-primary/10 transition-all hover:border-primary/30 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>{exam.title}</CardTitle>
          <Badge variant="secondary" className="bg-white text-primary">
            Premium
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        <p className="text-muted-foreground mb-4">{exam.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{exam.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-muted-foreground" />
            <span>{exam.questionCount} questions</span>
          </div>
        </div>
        
        <div className="flex items-center mt-6 mb-2">
          <Wallet className="w-5 h-5 text-primary mr-2" />
          <span className="text-2xl font-bold text-primary">
            {typeof exam.price === 'number' ? `PKR ${exam.price.toFixed(2)}` : 'Price unavailable'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 pt-4 pb-4">
        {exam.purchased ? (
          <Button className="w-full" variant="default" onClick={() => onStart(exam.id as number)}>
            Start Exam
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => onPurchase(exam.id as number)}
          >
            Purchase Access
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};