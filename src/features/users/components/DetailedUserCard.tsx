import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type ButtonConfig = {
  name: string;
  action: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
};

type DetailedUserCardProps = {
  name: string;
  fields: { name: string; value: string }[];
  open: boolean;
  imageUrl?: string;
  onOpenChange: (open: boolean) => void;
  isConnected: boolean;
  onConnect?: () => void;
  additionalButtons?: ButtonConfig[];
};

const DetailedUserCard = ({
                            name,
                            fields,
                            open,
                            onOpenChange,
                            isConnected,
                            onConnect,
                            imageUrl,
                            additionalButtons = []
                          }: DetailedUserCardProps) => {
  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 overflow-hidden w-[95vw] max-w-[400px] md:max-w-[500px]">
          <Card className="border-0">
            <CardHeader className="px-6 pt-6 pb-4 flex flex-col items-center">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-200 mx-auto mt-4">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-full w-full rounded-full object-cover"
                    />
                )}
              </div>
              <div className="text-center space-y-1 md:space-y-2 mt-4">
                <h2 className="text-lg md:text-xl font-bold">{name}</h2>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col items-center space-y-4 md:space-y-6">
                  <div className="w-full space-y-2 md:space-y-4">
                    {fields.map((field, index) => (
                        <div key={index} className="border-t pt-3 md:pt-4">
                          <h3 className="font-semibold text-sm md:text-base">
                            {field.name}: {field.value}
                          </h3>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <div className="w-full flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-2 pt-4 md:pt-6">
                {additionalButtons.map((button, index) => (
                    <Button
                        key={index}
                        onClick={button.action}
                        variant={button.variant || "default"}
                        className="w-full md:w-auto"
                    >
                      {button.name}
                    </Button>
                ))}
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
  );
};

export default DetailedUserCard;