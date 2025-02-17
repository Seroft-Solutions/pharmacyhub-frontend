import React from 'react';

interface DialogHeaderFieldProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const DialogHeaderField: React.FC<DialogHeaderFieldProps> = ({
                                                                      title,
                                                                      icon,
                                                                      className = '',
                                                                      ...props
                                                                    }) => {
  return (
    <div
      className="bg-primary p-6 relative overflow-hidden rounded-t-lg flex justify-center items-center"
      {...props}
    >
      <div className="flex items-center space-x-4 justify-center">
        <div className="relative p-3 rounded-full bg-primary-foreground">
          <div className="relative">
            {icon && React.cloneElement(icon as React.ReactElement, {
              className: "h-8 w-8 text-primary"
            })}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-primary-foreground">
          {title}
        </h2>
      </div>
    </div>
  );
};

DialogHeaderField.displayName = "DialogHeaderField";