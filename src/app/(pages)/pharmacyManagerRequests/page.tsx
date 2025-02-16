"use client"

import React, {useEffect, useState} from "react";
import {PharmacyManagerDetails} from "@/features/pharmacy-manager/pharmacy-manager";
import {UserCard} from "@/components/shared/UserCard";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import { pharmacyManagerService } from '@/features/pharmacy-manager/pharmacy-manager';

interface Props {
  userId?: string;
}

export default function PharmacyManagerRequests({ userId }: Props) {

  const router = useRouter()
  const [pharmacyManager, setPharmacyManager] = useState<PharmacyManagerDetails[]>([]);

  useEffect(() => {
    const fetchPharmacyManagers = async () => {
      if (!userId) {
        console.log("userId", userId)
      }
      try {
        const response = await pharmacyManagerService.getPharmacyManagerRequests();
        setPharmacyManager(response);
      } catch (error) {
        console.error('Error approving pharmacyManager:', error);
      }
    };

    fetchPharmacyManagers();
  }, [userId]);

  const handleApprove = async (pharmacyManagerId: string) => {
    try {
      await pharmacyManagerService.approveStatus(parseInt(pharmacyManagerId));
    } catch (error) {
      console.error('Error approving pharmacyManager:', error);
    }
  };

  const handleReject = async (pharmacyManagerId: string) => {
    try {
      await pharmacyManagerService.rejectStatus(parseInt(pharmacyManagerId));
    } catch (error) {
      console.error('Error rejecting pharmacyManager:', error);
    }
  };

  return (
    <div className="space-y-4">
      {pharmacyManager.map((pharma) => {
        const fields = [
          {name: "Name", value: `$pharma.firstName} ${pharma.lastName}`},
          {name: "City", value: pharma.pharmacyManager.city},
          {name: "Area", value: pharma.pharmacyManager.area},
        ];
        return (
          <UserCard
            key={pharma.pharmacyManager.id}
            name={`$pharma.firstName} ${pharma.lastName}`}
            fields={fields}
            actionButtons={[
              {
                name: "Approve",
                action: () => handleApprove(pharma.pharmacyManager.id.toString()),
                variant: "default"
              },
              {
                name: "Reject",
                action: () => handleReject(pharma.pharmacyManager.id.toString()),
                variant: "destructive"
              }
            ]}
          />
        );
      })}
    </div>
  );
};