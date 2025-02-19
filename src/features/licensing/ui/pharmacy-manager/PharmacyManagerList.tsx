"use client"
import { useEffect, useState } from "react";
import UserCard from "@/components/ui/UserCard";
import { PharmacyManagerDetails, usePharmacyManagerApi,PharmacyManagerConnectionsDTO } from "@/api/pharmacy-manager";

export default function PharmacyManagerList() {
  const { getPharmacyManager,connectWithPharmacyManager } = usePharmacyManagerApi();
  const [pharmacyManagers, setPharmacyManager] = useState<PharmacyManagerDetails[]>([]);

  useEffect(() => {
    fetchPharmacyManager();
  }, []);

  const fetchPharmacyManager = async () => {
    const response = await getPharmacyManager();
    if (response.error) {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmacyManager(response.data || []);
  };
  const handleConnect = async (pharmacyManagerId: number) => {

    try {
      const connectionData: PharmacyManagerConnectionsDTO = {
        pharmacyManagerId: pharmacyManagerId, // This will be set by the backend using TenantContext
      };

      const response = await connectWithPharmacyManager(connectionData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Optionally refresh the pharmacist list or update UI state
      await fetchPharmacyManager();

    } catch (error) {
      console.error('Error connecting with pharmacy manager:', error);
      // Handle error (show error message to user)
    }
  };

  return (
      <div className="space-y-4">
        {pharmacyManagers.map((pharmacyManager) => {
          const fields = [
            { name: "Name", value: `${pharmacyManager.firstName} ${pharmacyManager.lastName}` },
            { name: "Contact", value: pharmacyManager.pharmacyManager.contactNumber },
            { name: "City", value: pharmacyManager.pharmacyManager.city },
            { name: "Area", value: pharmacyManager.pharmacyManager.area },
            { name: "Experience", value: pharmacyManager.pharmacyManager.experience },
            { name: "Current Job Status", value: pharmacyManager.pharmacyManager.currentJobStatus },
            { name: "Previous Pharmacy", value: pharmacyManager.pharmacyManager.previousPharmacyName },
            { name: "Time Preference", value: pharmacyManager.pharmacyManager.timePrefernce }

          ];
          const buttonConfigs = [
            {
              name: "Connect",
              action: () => handleConnect(pharmacyManager.pharmacyManager.id),
              variant: "default"
            },
          ];

          return (
              <UserCard
                  key={pharmacyManager.pharmacyManager.id}
                  name={`${pharmacyManager.firstName} ${pharmacyManager.lastName}`}
                  fields={fields}
                  buttons={buttonConfigs}
                  maxButtons={1}
              />
          );
        })}
      </div>
  );
}