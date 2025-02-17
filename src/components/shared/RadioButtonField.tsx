import React, { ElementType } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Option {
  value: string;
  label: string;
}

interface RadioButtonFieldProps {
  name: string;
  label?: string;
  icon?: ElementType;
  control: Control<{ [x: string]: string }>;
  options: Option[];
  required?: boolean;
}

export const RadioButtonField = ({
                                                                    name,
                                                                    label,
                                                                    icon: Icon,
                                                                    control,
                                                                    options,
                                                                    required,
                                                                  }: RadioButtonFieldProps) => {
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
                <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-row flex-wrap gap-6"
                >
                  {options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                        <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer">{option.label}</Label>
                      </div>
                  ))}
                </RadioGroup>
            )}
        />
      </div>
  );
};
