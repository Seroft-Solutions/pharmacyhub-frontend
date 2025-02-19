"use client"
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";
import {ProprietorDetails, useProprietorApi,ProprietorsConnectionsDTO} from "@/api/proprietor";

export default function ProprietorList() {
  const {getProprietor,connectWithProprietor} = useProprietorApi();
  const [proprietors, setProprietor] = useState<ProprietorDetails[]>([]);

  useEffect(() => {
    fetchProprietor();
  }, []);
  const fetchProprietor = async () => {
    const response = await getProprietor();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setProprietor(response.data || []);
  }

  const handleConnect = async (proprietorId: number) => {

    try {
      const connectionData: ProprietorsConnectionsDTO = {
        proprietorId: proprietorId, // This will be set by the backend using TenantContext
      };

      const response = await connectWithProprietor(connectionData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Optionally refresh the pharmacist list or update UI state
      await fetchProprietor();

    } catch (error) {
      console.error('Error connecting with pharmacist:', error);
      // Handle error (show error message to user)
    }
  };


  return (
      <div className="space-y-4">
        {proprietors.map((proprietor) => {
          const fields = [
            { name: "Name", value: `${proprietor.firstName} ${proprietor.lastName}` },
            { name: "Contact", value: proprietor.proprietor.contactNumber },
            { name: "Pharmacy Name", value: proprietor.proprietor.pharmacyName },
            { name: "City", value: proprietor.proprietor.city },
            { name: "Area", value: proprietor.proprietor.area },
            { name: "License Required", value: proprietor.proprietor.licenseRequired },
            { name: "Required License Duration", value: proprietor.proprietor.requiredLicenseDuration },
          ];
          const buttonConfigs = [
            {
              name: "Connect",
              action: () => handleConnect(proprietor.proprietor.id),
              variant: "default"
            },
          ];
          return (
              <UserCard
                  key={proprietor.proprietor.id}
                  name={`${proprietor.firstName} ${proprietor.lastName}`}
                  fields={fields}
                  buttons={buttonConfigs}
                  maxButtons={1}
              />
          );
        })}
      </div>
  );
}