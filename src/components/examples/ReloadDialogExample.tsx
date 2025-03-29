'use client';

import React, { useState } from 'react';
import { ReloadSiteDialog } from '@/core/ui/dialogs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * ReloadDialogExample Component
 * 
 * A demonstration component showing how to use the ReloadSiteDialog
 * in a real-world scenario with form inputs.
 */
export function ReloadDialogExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Update form data and mark as dirty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setIsDirty(true);
  };

  // Submit form and reset dirty state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsDirty(false);
    alert('Form submitted successfully!');
  };

  // Show dialog if form is dirty
  const handleReset = () => {
    if (isDirty) {
      setShowDialog(true);
    } else {
      resetForm();
    }
  };

  // Reset form without confirmation
  const resetForm = () => {
    setFormData({ name: '', email: '' });
    setIsDirty(false);
  };

  // Dialog handlers
  const handleReload = () => {
    resetForm();
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ReloadSiteDialog Example</CardTitle>
        <CardDescription>
          Fill out the form and try to reset it to see the reload dialog in action.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleReset}
        >
          Reset Form
        </Button>
        
        <Button 
          type="submit" 
          disabled={!isDirty}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </CardFooter>
      
      <ReloadSiteDialog
        isOpen={showDialog}
        onReload={handleReload}
        onCancel={handleCancel}
        message="You have unsaved changes. Proceeding will reset the form."
      />
    </Card>
  );
}

export default ReloadDialogExample;