import React, {useEffect, useState} from "react";
import {UserCard} from "@/components/shared/UserCard";
import {PharmacyManagerDetails, PharmacyManagerConnectionsDTO} from "@/features/pharmacy-manager/pharmacy-manager";
import { pharmacyManagerService } from '@/services/pharmacy-manager';
import {Button} from "@/components/ui/button";


interface Props {
  userId: string;
  pharmacyManagerService: typeof pharmacyManagerService;
}

const PharmacyManagerList = ({userId, pharmacyManagerService}: Props) => {
  const [pharmacyManagers, setPharmacyManager] = useState<PharmacyManagerDetails[]>([]);


  useEffect(() => {
    const fetchPharmacyManagers = async () => {
      if (!userId) {
        console.log("userId", userId)
      }
      try {
        const response = await pharmacyManagerService.getPharmacyManager();
        setPharmacyManager(response);
      } catch (error) {
        console.error('Error fetching pharmacyManagers:', error);
      }
    };

    fetchPharmacyManagers();
  }, [userId, pharmacyManagerService]);

  const handleConnect = async (pharmacyManagerId: number) => {
    try {
      const connectionData: PharmacyManagerConnectionsDTO = {
        pharmacyManagerId: pharmacyManagerId,
      };
      await pharmacyManagerService.connectWithPharmacyManager(connectionData);
    } catch (error) {
      console.error('Error connecting with pharmacyManager:', error);
    }
  };

  return (
    <div className="space-y-4">
      {pharmacyManagers.map((pharmacyManager) => {
        const fields = [
          {name: "Name", value: `${pharmacyManager.firstName} ${pharmacyManager.lastName}`},
          {name: "Contact", value: pharmacyManager.pharmacyManager.contactNumber},
          {name: "City", value: pharmacyManager.pharmacyManager.city},
          {name: "Area", value: pharmacyManager.pharmacyManager.area},
          {name: "Experience", value: pharmacyManager.pharmacyManager.experience},
          {name: "Current Job Status", value: pharmacyManager.pharmacyManager.currentJobStatus},
          {name: "Previous Pharmacy", value: pharmacyManager.pharmacyManager.previousPharmacyName},
          {name: "Time Preference", value: pharmacyManager.pharmacyManager.timePrefernce},
        ];
        return (
          <UserCard
            key={pharmacyManager.pharmacyManager.id}
            name={`$pharmacyManager.firstName} ${pharmacyManager.lastName}`}
            fields={fields}
            actionButtons={[
              {
                name: "Connect",
                action: () => handleConnect(pharmacyManager.pharmacyManager.id),
                variant: "default"
              }
            ]}
            title="Established Connection"
          />
        );
      })}
    </div>
  );
};

export default PharmacyManagerList;