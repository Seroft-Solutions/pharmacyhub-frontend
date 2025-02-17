import React, { ElementType } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label?: string;
  icon?: ElementType;
  control: Control<any>;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
                                                          name,
                                                          label,
                                                          icon: Icon,
                                                          control,
                                                          options,
                                                          placeholder,
                                                          required,
                                                        }) => {
  return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Icon && (
              <Icon
                  className="h-4 w-4"
                  aria-hidden="true"
              />
          )}
          {label && (
              <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
          )}
        </div>
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Select
                    value={field.value}
                    onValueChange={field.onChange}
                >
                  <SelectTrigger id={name} aria-label={label}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
        />
      </div>
  );
};