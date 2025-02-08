"use client"
import {SalesmanDetails, useSalesmanApi} from "@/api/salesman";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

interface SalesmanConnection{
  id:number;
  connectionStatusEnum:string;
  userGroup:string;
  notes:string;
  userId:string;
  salesmanId:string;

}

export default function SalesmansConnectionRequests() {
  const {approveStatus,rejectStatus,getSalesmanRequests} = useSalesmanApi();
  const [salesman, setSalesman] = useState<SalesmanDetails[]>([]);

  useEffect(() => {
    fetchSalesman();
  }, []);
  const fetchSalesman = async () => {
    const response = await getSalesmanRequests();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setSalesman(response.data || []);
  }

  const handleApprove = async (salesmanId: string) => {
    try {
      const response = await approveStatus(salesmanId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchSalesman();
    } catch (error) {
      console.error('Error approving salesman:', error);
    }
  }

  const handleReject = async (salesmanId: string) => {
    try {
      const response = await rejectStatus(salesmanId);
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchSalesman();
    } catch (error) {
      console.error('Error rejecting salesman:', error);
    }
  }



  return (
      <div className="space-y-4">
        {salesman.map((pharma) => {
          const fields = [
            { name: "Name", value: `${pharma.firstName} ${pharma.lastName}` },
            { name: "City", value: pharma.salesman.city },
            { name: "Area", value: pharma.salesman.area },
          ];
          const buttonConfigs = [
            {
              name: "Approve",
              action: () => handleApprove(pharma.salesman.id),
              variant: "default"
            },
            {
              name: "Reject",
              action: () => handleReject(pharma.salesman.id),
              variant: "destructive"
            }
          ];
          return (
              <UserCard
                  key={pharma.salesman.id}
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