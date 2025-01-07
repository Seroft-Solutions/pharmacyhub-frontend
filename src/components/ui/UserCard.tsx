import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserCardProps = {
  name: string;
  contact: string;
  universityName: string;
  experience: string;
  role?: string;
  imageUrl?: string;
  onConnect?: (isConnected: boolean) => void;
};

const UserCard = ({
                    name,
                    contact,
                    universityName,
                    experience,
                    role,
                    imageUrl,
                    onConnect,
                  }: UserCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    onConnect?.(!isConnected);
  };

  return (
      <>
        <Card
            className="w-full max-w-4xl cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsDialogOpen(true)}
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
                <h1 className="text-xs md:text-sm truncate">Contact: {contact}</h1>
                <h1 className="text-xs md:text-sm truncate">University: {universityName}</h1>
                <h1 className="text-xs md:text-sm truncate">Experience: {experience}</h1>
                {role && <p className="text-xs md:text-sm text-gray-500 truncate">{role}</p>}
              </div>
            </div>
            <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnect();
                }}
                variant={isConnected ? "destructive" : "default"}
                className="ml-2 text-xs md:text-sm"
                size="sm"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
                User Details
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 md:space-y-6 p-2 md:p-4">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-200">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full rounded-full object-cover"
                    />
                )}
              </div>
              <div className="text-center space-y-1 md:space-y-2">
                <h2 className="text-lg md:text-xl font-bold">{name}</h2>
                {role && <p className="text-gray-500 text-base md:text-lg">{role}</p>}
              </div>
              <div className="w-full overflow-y-auto max-h-[40vh] space-y-2 md:space-y-4 pr-2">
                <div className="border-t pt-3 md:pt-4">
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Contact Information: {contact}</h3>
                  {/*<p className="text-sm md:text-base break-words">{contact}</p>*/}
                </div>
                <div className="border-t pt-3 md:pt-4">
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Education: {universityName}</h3>
                  {/*<p className="text-sm md:text-base break-words">{universityName}</p>*/}
                </div>
                <div className="border-t pt-3 md:pt-4">
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Experience: {experience}</h3>
                  {/*<p className="text-sm md:text-base break-words">{experience}</p>*/}
                </div>
              </div>
              <div className="w-full flex justify-center pt-4 md:pt-6">
                <Button
                    onClick={handleConnect}
                    variant={isConnected ? "destructive" : "default"}
                    className="w-full md:w-auto"
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default UserCard;