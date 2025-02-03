import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {useAuth} from "@/hooks/useAuth";
import DetailedUserCard from "@/components/ui/DetailedUserCard";
import RegistrationForm from "@/components/RegistrationForm/registration-from";

type Field = {
  name: string;
  value: string;
};

type UserCardProps = {
  name: string;
  fields: Field[];
  imageUrl?: string;
  onConnect?: (isConnected: boolean) => void;
};

const UserCard = ({name, fields, onConnect,imageUrl}: UserCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const {user} = useAuth();

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.registered)
    {
      setIsConnected(!isConnected);
      onConnect?.(!isConnected);
    } else
    {
      setIsRegistrationDialogOpen(true);
    }
  };

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
                )}              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-sm md:text-base truncate">{name}</h3>
                <h1 className="text-xs md:text-sm truncate">City: {fields.find(f => f.name === "City")?.value}</h1>
                <h1 className="text-xs md:text-sm truncate">Area: {fields.find(f => f.name === "Area")?.value}</h1>
              </div>
            </div>
            <Button
                onClick={handleConnect}
                variant={isConnected ? "destructive" : "default"}
                className="ml-2 text-xs md:text-sm"
                size="sm"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </CardContent>
        </Card>

        <DetailedUserCard
            name={name}
            fields={fields}
            ImageUrl={imageUrl}
            open={isDetailedDialogOpen}
            onOpenChange={setIsDetailedDialogOpen}
            isConnected={isConnected}
            onConnect={handleConnect}
        />

        <RegistrationForm
            open={isRegistrationDialogOpen}
            onOpenChange={setIsRegistrationDialogOpen}
        />
      </>
  );
};

export default UserCard;