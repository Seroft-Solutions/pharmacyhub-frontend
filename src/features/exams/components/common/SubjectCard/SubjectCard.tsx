"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export interface SubjectCardProps {
  subject: string;
  count: number;
  onClick: () => void;
}

/**
 * SubjectCard component displays a card for a subject with a count of papers
 * 
 * @param subject - The name of the subject to display
 * @param count - The number of papers for this subject
 * @param onClick - Callback function when the card is clicked
 */
export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, count, onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full overflow-hidden rounded-xl border border-slate-200 max-w-xs mx-auto w-full">
      {/* Colored bar at the top */}
      <div className="w-full h-2 bg-emerald-500"></div>
      
      <CardContent className="flex flex-col items-center justify-center p-6 flex-grow">
        <div className="bg-emerald-100 p-4 rounded-full mb-4">
          <BookOpen className="h-12 w-12 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-center mb-2">{subject}</h3>
        <p className="text-slate-500 text-center">
          {count} {count === 1 ? 'Paper' : 'Papers'} Available
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50">
        <Button 
          onClick={onClick}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          View Papers
        </Button>
      </CardFooter>
    </Card>
  );
};