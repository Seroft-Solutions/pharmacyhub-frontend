"use client"
import {PharmacyManagerDetails, usePharmacyManagerApi} from "@/api/pharmacy-manager";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

interface PharmacyManagerConnection{
  id:number;
  connectionStatusEnum:string;
  userGroup:string;
  notes:string;
  userId:string;
  pharmacyManagerId:string;

}

export default function PharmacyManagersConnections() {
  const {getAllConnections} = usePharmacyManagerApi();
  const [pharmacyManager, setPharmacyManager] = useState<PharmacyManagerDetails[]>([]);

  useEffect(() => {
    fetchPharmacyManager();
  }, []);
  const fetchPharmacyManager = async () => {
    const response = await getAllConnections();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmacyManager(response.data || []);
  }


  function handleDisconnect()
  {

  }

  return (
      <div className="space-y-4">
        {pharmacyManager.map((pharmacyManager) => {
          const fields = [
            { name: "Name", value: `${pharmacyManager.firstName} ${pharmacyManager.lastName}` },
            { name: "Contact", value: pharmacyManager.pharmacyManager.contactNumber },
            { name: "City", value: pharmacyManager.pharmacyManager.city },
            { name: "Area", value: pharmacyManager.pharmacyManager.area },
            { name: "Experience", value: pharmacyManager.pharmacyManager.experience },
            { name: "Current Job Status", value: pharmacyManager.pharmacyManager.currentJobStatus },
            { name: "Previous Pharmacy", value: pharmacyManager.pharmacyManager.previousPharmacyName },
            { name: "Time Preference", value: pharmacyManager.pharmacyManager.timePrefernce },
          ];
          const buttonConfigs = [
            {
              name: "Disconnect",
              action: () => handleDisconnect(),
              variant: "destructive"
            }
          ];
          return (
              <UserCard
                  key={pharmacyManager.pharmacyManager.id}
                  name={`${pharmacyManager.firstName} ${pharmacyManager.lastName}`}
                  fields={fields}
                  buttons={buttonConfigs}
                  maxButtons={2}
              />
          );
        })}
      </div>
  )
}