import React from "react";
import {DialogOverlay, DialogPortal} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {cn} from "@/lib/utils";
import {X} from "lucide-react";
import {DialogHeaderField} from "@/components/ui/DialogHeaderField";
import {Button} from "@/components/ui/button";
import {AiOutlineEdit, AiOutlinePlus} from "react-icons/ai";

interface DialogContentFieldProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    title: string;
    icon: React.ReactNode;
    operation?: 'Edit' | 'Add';
    onSubmit?: () => void;
    isSubmitting?: boolean;
}

export const DialogContentField = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentFieldProps
>(({ className, children, title, icon, operation, onSubmit, isSubmitting, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay
            className="fixed inset-0 bg-black/40 backdrop-blur-sm
                      data-[state=open]:animate-in data-[state=closed]:animate-out
                      data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                      transition-all duration-300"/>
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-background",
                "flex flex-col",
                "max-h-[90vh]", // Set maximum height
                "rounded-2xl overflow-hidden", // Increased border radius
                "shadow-lg",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=open]:scale-100 data-[state=closed]:scale-95",
                "data-[state=open]:slide-in-from-bottom-[48%] data-[state=closed]:slide-out-to-bottom-[48%]",
                "transition-all duration-300 ease-out",
                className
            )}
            {...props}
        >
            {/* Fixed Header */}
            <div className="flex-none">
                <DialogHeaderField
                    title={operation ? 'Edit ' + title : 'Add ' + title}
                    icon={icon}
                />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-6">
                    {children}
                </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-none border-t bg-background p-4">
                <div className="flex justify-center space-x-20 px-4">
                    <DialogPrimitive.Close
                        className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium bg-red-600 text-white rounded-full shadow-md transition-all duration-200 transform hover:bg-red-700 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                    >
                        <X className="h-4 w-4 mr-2"/>
                        Close
                    </DialogPrimitive.Close>

                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="rounded-full px-6 shadow-md hover:scale-105 transition-transform">
                        {isSubmitting ? (
                            'Saving...'
                        ) : operation ? (
                            <>
                                <AiOutlineEdit className="mr-2"/> Update
                            </>
                        ) : (
                            <>
                                <AiOutlinePlus className="mr-2"/> Add
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </DialogPrimitive.Content>
    </DialogPortal>
));

DialogContentField.displayName = "DialogContentField";