"use client"
import {PharmacistDetails, PharmacistsConnectionsDTO, usePharmacistApi} from "@/api/pharmacist";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

interface PharmacistConnection {
  id: number;
  connectionStatusEnum: string;
  userGroup: string;
  notes: string;
  userId: string;
  pharmacistId: string;

}

export default function PharmacistList() {
  const {getPharmacist, connectWithPharmacist} = usePharmacistApi();
  const [pharmasict, setPharmasict] = useState<PharmacistDetails[]>([]);

  useEffect(() => {
    fetchPharmasict();
  }, []);
  const fetchPharmasict = async () => {
    const response = await getPharmacist();
    if (response.error) {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmasict(response.data || []);
  }

  const handleConnect = async (pharmacistId: number) => {

    try {
      const connectionData: PharmacistsConnectionsDTO = {
        pharmacistId: pharmacistId, // This will be set by the backend using TenantContext
      };

      const response = await connectWithPharmacist(connectionData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Optionally refresh the pharmacist list or update UI state
      await fetchPharmasict();

    } catch (error) {
      console.error('Error connecting with pharmacist:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="space-y-4">
      {pharmasict.map((pharma) => {
        const fields = [
          {name: "Name", value: `${pharma.firstName} ${pharma.lastName}`},
          {name: "Contact", value: pharma.pharmacist.contactNumber},
          {name: "City", value: pharma.pharmacist.city},
          {name: "Area", value: pharma.pharmacist.area},
          {name: "Experience", value: pharma.pharmacist.experience},
          {name: "Current Job Status", value: pharma.pharmacist.currentJobStatus},
          {name: "Previous Pharmacy", value: pharma.pharmacist.previousPharmacyName},
          {name: "Shift Time", value: pharma.pharmacist.timePreference},
          {name: "Category Available", value: pharma.pharmacist.categoryAvailable},
          {name: "License Duration", value: pharma.pharmacist.licenseDuration},
          {name: "University Name", value: pharma.pharmacist.universityName},
          {name: "Batch", value: pharma.pharmacist.batch},
        ];
        const buttonConfigs = [
          {
            name: "Connect",
            action: () => handleConnect(pharma.pharmacist.id),
            variant: "default"
          },

        ];
        return (
          <UserCard
            key={pharma.pharmacist.id}
            name={`${pharma.firstName} ${pharma.lastName}`}
            fields={fields}
            buttons={buttonConfigs}
            maxButtons={1}
          />
        );
      })}
    </div>
  )
}