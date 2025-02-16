"use client"
import {ProprietorDetails, useProprietorApi} from "@/api/proprietor";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

interface ProprietorConnection {
  id: number;
  connectionStatusEnum: string;
  userGroup: string;
  notes: string;
  userId: string;
  proprietorId: string;

}

export default function ProprietorsConnections() {
  const {getAllConnections} = useProprietorApi();
  const [proprietor, setProprietor] = useState<ProprietorDetails[]>([]);

  useEffect(() => {
    fetchProprietor();
  }, []);
  const fetchProprietor = async () => {
    const response = await getAllConnections();
    if (response.error) {
      throw new Error(response.error);
    }
    console.log(response.data);
    setProprietor(response.data || []);
  }

  function handleDisconnect() {

  }

  return (
    <div className="space-y-4">
      {proprietor.map((proprietor) => {
        const fields = [
          {name: "Name", value: `${proprietor.firstName} ${proprietor.lastName}`},
          {name: "Contact", value: proprietor.proprietor.contactNumber},
          {name: "Pharmacy Name", value: proprietor.proprietor.pharmacyName},
          {name: "City", value: proprietor.proprietor.city},
          {name: "Area", value: proprietor.proprietor.area},
          {name: "License Required", value: proprietor.proprietor.licenseRequired},
          {name: "Required License Duration", value: proprietor.proprietor.requiredLicenseDuration},
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
            key={proprietor.proprietor.id}
            name={`${proprietor.firstName} ${proprietor.lastName}`}
            fields={fields}
            buttons={buttonConfigs}
            maxButtons={2}
          />
        );
      })}
    </div>
  )
}