"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaperType } from '../../types/StandardTypes';
import { getPaperTypeFields, getRequiredFields } from '../../utils/paperTypeUtils';

interface PaperMetadataFieldsProps {
  paperType: string;
  metadata: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

/**
 * Component for rendering dynamic metadata fields based on paper type
 */
const PaperMetadataFields: React.FC<PaperMetadataFieldsProps> = ({
  paperType,
  metadata,
  onChange,
  errors,
  disabled = false
}) => {
  // Get fields for this paper type
  const fields = getPaperTypeFields(paperType);
  const requiredFields = getRequiredFields(paperType);

  // If no fields for this type, return empty
  if (fields.length === 0) {
    return null;
  }

  // Render different field types based on field name
  const renderField = (field: string) => {
    const isRequired = requiredFields.includes(field);
    const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    const hasError = errors[field] ? true : false;

    // Determine the appropriate input type for each field
    switch (field) {
      case 'year':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={field}
              type="number"
              min={1900}
              max={new Date().getFullYear() + 1}
              value={metadata[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              required={isRequired}
              disabled={disabled}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      case 'month':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={metadata[field] || ''}
              onValueChange={(value) => onChange(field, value)}
              disabled={disabled}
            >
              <SelectTrigger id={field} className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      case 'season':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={metadata[field] || ''}
              onValueChange={(value) => onChange(field, value)}
              disabled={disabled}
            >
              <SelectTrigger id={field} className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spring">Spring</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
                <SelectItem value="Fall">Fall</SelectItem>
                <SelectItem value="Winter">Winter</SelectItem>
              </SelectContent>
            </Select>
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      case 'academicLevel':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={metadata[field] || ''}
              onValueChange={(value) => onChange(field, value)}
              disabled={disabled}
            >
              <SelectTrigger id={field} className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                <SelectItem value="Graduate">Graduate</SelectItem>
                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                <SelectItem value="Doctorate">Doctorate</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      case 'skillLevel':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Select
              value={metadata[field] || ''}
              onValueChange={(value) => onChange(field, value)}
              disabled={disabled}
            >
              <SelectTrigger id={field} className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );
        
      case 'estimatedCompletionTime':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} (minutes) {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={field}
              type="number"
              min={1}
              value={metadata[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${fieldLabel.toLowerCase()} in minutes`}
              required={isRequired}
              disabled={disabled}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      case 'learningObjectives':
      case 'prerequisites':
      case 'explanation':
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              id={field}
              value={metadata[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              required={isRequired}
              disabled={disabled}
              className={`min-h-[80px] ${hasError ? 'border-red-500' : ''}`}
            />
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );

      // Default to a text input for all other fields
      default:
        return (
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor={field}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={field}
              value={metadata[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              required={isRequired}
              disabled={disabled}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        );
    }
  };

  // Group title based on paper type
  const getGroupTitle = () => {
    switch (paperType) {
      case PaperType.SUBJECT:
        return 'Subject Paper Details';
      case PaperType.PAST:
        return 'Past Paper Details';
      case PaperType.MODEL:
        return 'Model Paper Details';
      case PaperType.PRACTICE:
        return 'Practice Paper Details';
      default:
        return 'Paper Details';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-md">{getGroupTitle()}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field} className={field === 'learningObjectives' || field === 'prerequisites' ? 'md:col-span-2' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperMetadataFields;