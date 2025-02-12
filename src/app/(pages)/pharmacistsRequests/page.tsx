"use client"
import {PharmacistDetails, PharmacistsConnectionsDTO, usePharmacistApi} from "@/api/pharmacist";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

interface PharmacistConnection{
  id:number;
  connectionStatusEnum:string;
  userGroup:string;
  notes:string;
  userId:string;
  pharmacistId:string;

}

export default function PharmacistsConnectionRequests() {
  const {approveStatus,rejectStatus,getPharmacistRequests} = usePharmacistApi();
  const [pharmasict, setPharmasict] = useState<PharmacistDetails[]>([]);

  useEffect(() => {
    fetchPharmasict();
  }, []);
  const fetchPharmasict = async () => {
    const response = await getPharmacistRequests();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmasict(response.data || []);
  }

  const handleApprove = async (pharmacistId: string) => {
    try {
      const response = await approveStatus(pharmacistId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchPharmasict();
    } catch (error) {
      console.error('Error approving pharmacist:', error);
    }
  }

  const handleReject = async (pharmacistId: string) => {
    try {
      const response = await rejectStatus(pharmacistId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchPharmasict();
    } catch (error) {
      console.error('Error rejecting pharmacist:', error);
    }
  }



  return (
      <div className="space-y-4">
        {pharmasict.map((pharma) => {
          const fields = [
            { name: "Name", value: `${pharma.firstName} ${pharma.lastName}` },
            { name: "City", value: pharma.pharmacist.city },
            { name: "Area", value: pharma.pharmacist.area },
          ];
          const buttonConfigs = [
            {
              name: "Approve",
              action: () => handleApprove(pharma.pharmacist.id),
              variant: "default"
            },
            {
              name: "Reject",
              action: () => handleReject(pharma.pharmacist.id),
              variant: "destructive"
            }
          ];
          return (
              <UserCard
                  key={pharma.pharmacist.id}
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