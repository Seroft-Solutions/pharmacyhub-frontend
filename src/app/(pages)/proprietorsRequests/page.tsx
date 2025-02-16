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

export default function ProprietorsConnectionRequests() {
  const {approveStatus, rejectStatus, getProprietorRequests} = useProprietorApi();
  const [proprietor, setProprietor] = useState<ProprietorDetails[]>([]);

  useEffect(() => {
    fetchProprietor();
  }, []);
  const fetchProprietor = async () => {
    const response = await getProprietorRequests();
    if (response.error) {
      throw new Error(response.error);
    }
    console.log(response.data);
    setProprietor(response.data || []);
  }

  const handleApprove = async (proprietorId: string) => {
    try {
      const response = await approveStatus(proprietorId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchProprietor();
    } catch (error) {
      console.error('Error approving proprietor:', error);
    }
  }

  const handleReject = async (proprietorId: string) => {
    try {
      const response = await rejectStatus(proprietorId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchProprietor();
    } catch (error) {
      console.error('Error rejecting proprietor:', error);
    }
  }

  return (
    <div className="space-y-4">
      {proprietor.map((pharma) => {
        const fields = [
          {name: "Name", value: `${pharma.firstName} ${pharma.lastName}`},
          {name: "City", value: pharma.proprietor.city},
          {name: "Area", value: pharma.proprietor.area},
        ];
        const buttonConfigs = [
          {
            name: "Approve",
            action: () => handleApprove(pharma.proprietor.id),
            variant: "default"
          },
          {
            name: "Reject",
            action: () => handleReject(pharma.proprietor.id),
            variant: "destructive"
          }
        ];
        return (
          <UserCard
            key={pharma.proprietor.id}
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