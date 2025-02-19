import React from 'react';
import {Label} from '@/components/ui/label';

interface FormFieldProps {
  name: string;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({name, label, icon: Icon, children}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center space-x-2">
      <Icon className="w-4 h-4"/>
      <span>{label}</span>
    </Label>
    {children}
  </div>
);