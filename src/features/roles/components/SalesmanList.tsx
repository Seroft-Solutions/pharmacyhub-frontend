import React, {useEffect, useState} from "react";
import {SalesmanDetails, SalesmenConnectionsDTO} from "@/features/salesman/salesman";
import {Button} from "@/components/ui/button";
import { salesmanService } from '@/features/salesman/salesman';
import {UserCard} from "@/components/shared/UserCard";

interface Props {
  userId: string;
}

export default function SalesmanList() {
  const [salesmen, setSalesman] = useState<SalesmanDetails[]>([]);

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await salesmanService.getSalesman();
        setSalesman(response);
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      }
    };

    fetchSalesmen();
  }, []);

  const handleConnect = async (salesmanId: number) => {
    try {
      const connectionData: SalesmenConnectionsDTO = {
        salesmanId: salesmanId,
      };
      //await connectWithSalesman(connectionData);
      console.log("connect")
    } catch (error) {
      console.error('Error connecting with salesman:', error);
    }
  };

  return (
    <div className="space-y-4">
      {salesmen.map((salesman) => {
        const fields = [
          {name: "Name", value: `$salesman.firstName} ${salesman.lastName}`},
          {name: "Contact", value: salesman.salesman.contactNumber},
          {name: "City", value: salesman.salesman.city},
          {name: "Area", value: salesman.salesman.area},
        ];
        return (
          <UserCard
            key={salesman.salesman.id}
            name={`$salesman.firstName} ${salesman.lastName}`}
            fields={fields}
            actionButtons={[
              {
                name: "Connect",
                action: () => handleConnect(salesman.salesman.id),
                variant: "default"
              }
            ]}
          />
        );
      })}
    </div>
  );
}