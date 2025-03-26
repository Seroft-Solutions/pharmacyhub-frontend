"use client";

import { toast } from "./use-toast";

// Wrap the toast functions to ensure they're safely called
export const safeToast = {
  success: (message: string) => {
    try {
      return toast({
        title: "Success",
        description: message,
        variant: "default",
      });
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console if toast fails
      console.log("Success:", message);
      return { id: '0', dismiss: () => {} };
    }
  },
  
  error: (message: string) => {
    try {
      return toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console if toast fails
      console.error("Error:", message);
      return { id: '0', dismiss: () => {} };
    }
  },
  
  info: (message: string) => {
    try {
      return toast({
        title: "Information",
        description: message,
      });
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console if toast fails
      console.info("Info:", message);
      return { id: '0', dismiss: () => {} };
    }
  },
  
  warning: (message: string) => {
    try {
      return toast({
        title: "Warning",
        description: message,
      });
    } catch (error) {
      console.error("Toast error:", error);
      // Fallback to console if toast fails
      console.warn("Warning:", message);
      return { id: '0', dismiss: () => {} };
    }
  }
};
