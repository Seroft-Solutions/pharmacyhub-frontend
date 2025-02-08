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

export default function PharmacyManagerConnectionRequests() {
  const {approveStatus,rejectStatus,getPharmacyManagerRequests} = usePharmacyManagerApi();
  const [pharmacyManager, setPharmacyManager] = useState<PharmacyManagerDetails[]>([]);

  useEffect(() => {
    fetchPharmacyManager();
  }, []);
  const fetchPharmacyManager = async () => {
    const response = await getPharmacyManagerRequests();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmacyManager(response.data || []);
  }

  const handleApprove = async (pharmacyManagerId: string) => {
    try {
      const response = await approveStatus(pharmacyManagerId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchPharmacyManager();
    } catch (error) {
      console.error('Error approving pharmacyManager:', error);
    }
  }

  const handleReject = async (pharmacyManagerId: string) => {
    try {
      const response = await rejectStatus(pharmacyManagerId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchPharmacyManager();
    } catch (error) {
      console.error('Error rejecting pharmacyManager:', error);
    }
  }



  return (
      <div className="space-y-4">
        {pharmacyManager.map((pharma) => {
          const fields = [
            { name: "Name", value: `${pharma.firstName} ${pharma.lastName}` },
            { name: "City", value: pharma.pharmacyManager.city },
            { name: "Area", value: pharma.pharmacyManager.area },
          ];
          const buttonConfigs = [
            {
              name: "Approve",
              action: () => handleApprove(pharma.pharmacyManager.id),
              variant: "default"
            },
            {
              name: "Reject",
              action: () => handleReject(pharma.pharmacyManager.id),
              variant: "destructive"
            }
          ];
          return (
              <UserCard
                  key={pharma.pharmacyManager.id}
                  name={`${pharma.firstName} ${pharma.lastName}`}
                  fields={fields}
                  buttons={buttonConfigs}
                  maxButtons={2}
              />
          );
        })}
      </div>
  )
}