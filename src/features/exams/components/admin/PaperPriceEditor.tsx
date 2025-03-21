'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { examApiService } from '@/features/exams/api/services/examApiService';

interface PaperPriceEditorProps {
  examId: number;
  isPremium: boolean;
  price: number;
  title: string;
  onUpdate: () => void;
}

export const PaperPriceEditor: React.FC<PaperPriceEditorProps> = ({
  examId,
  isPremium,
  price,
  title,
  onUpdate
}) => {
  const [premium, setPremium] = useState(isPremium);
  const [examPrice, setExamPrice] = useState(price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (premium && (!examPrice || parseFloat(examPrice) <= 0)) {
      toast.error('Please enter a valid price greater than 0.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update exam with premium status and price
      await examApiService.updateExam(examId, {
        isPremium: premium,
        price: premium ? parseFloat(examPrice) : 0
      });
      
      toast.success('The paper pricing has been successfully updated.');
      
      onUpdate();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update paper. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Premium Settings</CardTitle>
          <CardDescription>
            Configure premium settings for "{title}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="premium" 
              checked={premium} 
              onCheckedChange={(checked) => setPremium(checked as boolean)} 
            />
            <Label htmlFor="premium" className="font-medium">
              Make this paper premium
            </Label>
          </div>
          
          {premium && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input
                id="price"
                type="number"
                value={examPrice}
                onChange={(e) => setExamPrice(e.target.value)}
                placeholder="Enter price"
                step="0.01"
                min="0"
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};