"use client"
import { useEffect, useState } from "react";
import UserCard from "@/components/ui/UserCard";
import { PharmacyManagerDetails, usePharmacyManagerApi } from "@/api/pharmacy-manager";

export default function PharmacyManagerList() {
  const { getPharmacyManager } = usePharmacyManagerApi();
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
            { name: "Time Preference", value: pharmacyManager.pharmacyManager.timePrefernce },
          ];

          return (
              <UserCard
                  key={pharmacyManager.pharmacyManager.id}
                  name={`${pharmacyManager.firstName} ${pharmacyManager.lastName}`}
                  fields={fields}
              />
          );
        })}
      </div>
  );
}