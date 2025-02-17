import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import DetailedUserCard from "@/components/ui/DetailedUserCard";
import RegistrationForm from "@/components/RegistrationForm/registration-from";

type ButtonConfig = {
  name: string;
  action: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
};

type UserCardProps = {
  name: string;
  fields: { name: string; value: string }[];
  imageUrl?: string;
  buttons?: ButtonConfig[];
  maxButtons?: number;
};

const UserCard = ({
                    name,
                    fields,
                    imageUrl,
                    buttons = [],
                    maxButtons = 2
                  }: UserCardProps) => {
  const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleButtonClick = (button: ButtonConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.registered) {
      button.action();
    } else {
      setIsRegistrationDialogOpen(true);
    }
  };

  // Limit buttons to maxButtons
  const displayButtons = buttons.slice(0, maxButtons);

  return (
      <>
        <Card
            className="w-full max-w-4xl cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsDetailedDialogOpen(true)}
        >
          <CardContent className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-200 flex-shrink-0">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full rounded-full object-cover"
                    />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-sm md:text-base truncate">{name}</h3>
                <h1 className="text-xs md:text-sm truncate">
                  City: {fields.find(f => f.name === "City")?.value}
                </h1>
                <h1 className="text-xs md:text-sm truncate">
                  Area: {fields.find(f => f.name === "Area")?.value}
                </h1>
              </div>
            </div>
            <div className="flex space-x-2">
              {displayButtons.map((button, index) => (
                  <Button
                      key={index}
                      onClick={(e) => handleButtonClick(button, e)}
                      variant={button.variant || "default"}
                      className="ml-2 text-xs md:text-sm"
                      size="sm"
                  >
                    {button.name}
                  </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <DetailedUserCard
            name={name}
            fields={fields}
            ImageUrl={imageUrl}
            open={isDetailedDialogOpen}
            onOpenChange={setIsDetailedDialogOpen}
            isConnected={false}
            onConnect={() => {}} // Placeholder, as buttons are now dynamic
            additionalButtons={displayButtons}
        />

        <RegistrationForm
            open={isRegistrationDialogOpen}
            onOpenChange={setIsRegistrationDialogOpen}
        />
      </>
  );
};

export default UserCard;