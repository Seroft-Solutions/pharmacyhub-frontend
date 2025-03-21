'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2Icon, DollarSignIcon, SaveIcon, AlertCircleIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useExams } from '@/features/exams/hooks/useExams';
import { ExamOperationGuard, ExamOperation } from '@/features/exams/rbac';

interface PaperPrice {
  examId: number;
  price: number;
  isCustomPrice: boolean;
}

export const PaperPricingManager: React.FC = () => {
  const { exams, isLoading, error, refetch } = useExams();
  const [prices, setPrices] = useState<PaperPrice[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize prices when exams load
  useEffect(() => {
    if (exams) {
      const initialPrices = exams.map(exam => ({
        examId: exam.id,
        price: exam.price || 0,
        isCustomPrice: exam.customPrice || false
      }));
      setPrices(initialPrices);
    }
  }, [exams]);
  
  // Handle price change
  const handlePriceChange = (examId: number, price: number) => {
    setPrices(prev => prev.map(item => 
      item.examId === examId ? { ...item, price } : item
    ));
  };
  
  // Handle custom price toggle
  const handleCustomPriceToggle = (examId: number) => {
    setPrices(prev => prev.map(item => 
      item.examId === examId ? { ...item, isCustomPrice: !item.isCustomPrice } : item
    ));
  };
  
  // Save all prices
  const handleSaveAll = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, we would call an API to update the prices
      // For now, just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("All paper prices have been updated successfully.");
    } catch (error) {
      toast.error(`Failed to update prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
        <h3 className="text-destructive font-medium">Error Loading Exams</h3>
        <p className="text-destructive-foreground">
          {error instanceof Error ? error.message : 'An error occurred while loading exams.'}
        </p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <ExamOperationGuard 
      operation={ExamOperation.MANAGE_EXAMS}
      fallback={
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <span className="font-medium">You don't have permission to manage premium features</span>
            </div>
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5" />
            Paper Pricing Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Premium Status</TableHead>
                <TableHead>Custom Price</TableHead>
                <TableHead>Price (PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams?.map(exam => {
                const priceData = prices.find(p => p.examId === exam.id);
                if (!priceData) return null;
                
                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>
                      {exam.tags?.find(tag => 
                        ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
                      ) || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {exam.premium ? 
                        <Badge className="bg-primary">Premium</Badge> : 
                        <Badge variant="outline">Free</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`custom-${exam.id}`}
                          checked={priceData.isCustomPrice}
                          onCheckedChange={() => handleCustomPriceToggle(exam.id)}
                          disabled={!exam.premium}
                        />
                        <Label htmlFor={`custom-${exam.id}`} className="cursor-pointer">Allow Custom</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceData.price}
                        onChange={(e) => handlePriceChange(exam.id, parseFloat(e.target.value))}
                        disabled={!exam.premium}
                        className="w-24"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveAll} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" /> Save All Prices
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ExamOperationGuard>
  );
};