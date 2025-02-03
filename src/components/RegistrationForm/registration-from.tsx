"use client"
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PharmacistForm from "@/components/RegistrationForm/PharmacistForm";
import ProprietorForm from "@/components/RegistrationForm/ProprietortForm";
import SalesmanForm from "@/components/RegistrationForm/SalesmanForm";
import PharmacyMangerForm from "@/components/RegistrationForm/PharmacyManagerForm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegistrationForm({ open, onOpenChange }: RegistrationFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const userTypes = [
    { value: "pharmacist", label: "Pharmacist" },
    { value: "proprietor", label: "Proprietor" },
    { value: "pharmacy_manager", label: "Pharmacy Manager" },
    { value: "salesman", label: "Salesman" },
  ];

  const [selectedUserType, setSelectedUserType] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
  };

  const handleNext = () => {
    if (selectedUserType) {
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedUserType("");
    setShowForm(false);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  const renderForm = () => {
    const formProps = {
      formRef: formRef
    };

    switch (selectedUserType) {
      case "pharmacist":
        return <PharmacistForm ref={formRef} />;
      case "proprietor":
        return <ProprietorForm ref={formRef} />;
      case "pharmacy_manager":
        return <PharmacyMangerForm ref={formRef} />;
      case "salesman":
        return <SalesmanForm ref={formRef} />;
      default:
        return null;
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 overflow-hidden max-w-xl w-full" onCloseAutoFocus={handleCancel}>
          <Card className="border-0">
            <CardHeader className="px-6 pt-6 pb-4 flex-shrink-0">
              <CardTitle className="text-xl font-semibold">Complete Registration</CardTitle>
              <p className="text-sm text-gray-500">Please fill in your details to connect with others</p>
            </CardHeader>
            <CardContent className="px-6">
              <div className="min-h-0 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <div className="space-y-4">
                  {!showForm ? (
                      <div className="flex flex-col space-y-4">
                        <label htmlFor="userType" className="block text-sm font-medium">
                          User Type
                        </label>
                        <select
                            id="userType"
                            name="userType"
                            value={selectedUserType}
                            onChange={handleUserTypeChange}
                            className="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-offset-2"
                        >
                          <option value="">Select a user type</option>
                          {userTypes.map((userType) => (
                              <option key={userType.value} value={userType.value}>
                                {userType.label}
                              </option>
                          ))}
                        </select>
                      </div>
                  ) : (
                      <div className="space-y-6">{renderForm()}</div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <div className="flex justify-between w-full mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex-none">
                <Button
                    variant="outline"
                    size="default"
                    className="h-8 sm:h-10 text-sm sm:text-base"
                    onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                    size="default"
                    className="h-8 sm:h-10 text-sm sm:text-base"
                    onClick={showForm ? handleSubmit : handleNext}
                    type="button"
                >
                  {showForm ? "Submit" : "Next"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
  );
}