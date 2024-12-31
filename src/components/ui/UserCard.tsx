import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UserCardProps = {
  name: string;
  role: string;
  imageUrl?: string;
  onConnect?: (isConnected: boolean) => void;
};

const UserCard = ({ name, role, imageUrl, onConnect }: UserCardProps) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    onConnect?.(!isConnected);
  };

  return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200">
              {imageUrl && (
                  <img
                      src={imageUrl}
                      alt={name}
                      className="h-full w-full rounded-full object-cover"
                  />
              )}
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
          <Button
              onClick={handleConnect}
              variant={isConnected ? "destructive" : "default"}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </CardContent>
      </Card>
  );
};

export default UserCard;