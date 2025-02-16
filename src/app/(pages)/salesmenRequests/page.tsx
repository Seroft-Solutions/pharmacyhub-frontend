"use client"
import {SalesmanDetails} from "@/features/salesman/salesman";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";
import { salesmanService } from '@/features/salesman/salesman';

interface SalesmanConnection {
  id: number;
  connectionStatusEnum: string;
  userGroup: string;
  notes: string;
  userId: string;
  salesmanId: string;

}

export default function SalesmansConnectionRequests() {
  const [salesman, setSalesman] = useState<SalesmanDetails[]>([]);

  useEffect(() => {
    fetchSalesman();
  }, []);
  const fetchSalesman = async () => {
    try {
      const response = await salesmanService.getSalesmanRequests();
      console.log(response);
      setSalesman(response);
    } catch (error) {
      console.error('Error approving salesman:', error);
    }
  }

  const handleApprove = async (salesmanId: string) => {
    try {
      await salesmanService.approveStatus(parseInt(salesmanId));
      await fetchSalesman();
    } catch (error) {
      console.error('Error approving salesman:', error);
    }
  }

  const handleReject = async (salesmanId: string) => {
    try {
      await salesmanService.rejectStatus(parseInt(salesmanId));
      await fetchSalesman();
    } catch (error) {
      console.error('Error rejecting salesman:', error);
    }
  }

  return (
    <div className="space-y-4">
      {salesman.map((pharma) => {
        const fields = [
          {name: "Name", value: `$pharma.firstName} ${pharma.lastName}`},
          {name: "City", value: pharma.salesman.city},
          {name: "Area", value: pharma.salesman.area},
        ];
        const buttonConfigs = [
          {
            name: "Approve",
            action: () => handleApprove(pharma.salesman.id.toString()),
            variant: "default"
          },
          {
            name: "Reject",
            action: () => handleReject(pharma.salesman.id.toString()),
            variant: "destructive"
          }
        ];
        return (
          <UserCard
            key={pharma.salesman.id}
            name={`$pharma.firstName} ${pharma.lastName}`}
            fields={fields}
            buttons={buttonConfigs}
            maxButtons={2}
          />
        );
      })}
    </div>
  )
}