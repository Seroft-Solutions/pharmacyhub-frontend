"use client"
import {SalesmanDetails, SalesmenConnectionsDTO, useSalesmanApi} from "@/api/salesman";
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

export default function SalesmenConnections() {
  const {getAllConnections} = useSalesmanApi();
  const [salesman, setSalesman] = useState<SalesmanDetails[]>([]);

  useEffect(() => {
    fetchSalesman();
  }, []);
  const fetchSalesman = async () => {
    const response = await getAllConnections();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setSalesman(response.data || []);
  }


  function handleDisconnect()
  {

  }

  return (
      <div className="space-y-4">
        {salesman.map((salesman) => {
          const fields = [
            { name: "Name", value: `${salesman.firstName} ${salesman.lastName}` },
            { name: "Contact", value: salesman.salesman.contactNumber },
            { name: "Previous Pharmacy Name", value: salesman.salesman.previousPharmacyName },
            { name: "City", value: salesman.salesman.city },
            { name: "Area", value: salesman.salesman.area },
            { name: "Experience", value: salesman.salesman.experience },
            { name: "Current Job Status", value: salesman.salesman.currentJobStatus},
            { name: "Education", value: salesman.salesman.education},
            { name: "Time Preference", value: salesman.salesman.timePrefernce},
            { name: "Salery Expectation", value: salesman.salesman.saleryExpectation},
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
                  key={salesman.salesman.id}
                  name={`${salesman.firstName} ${salesman.lastName}`}
                  fields={fields}
                  buttons={buttonConfigs}
                  maxButtons={2}
              />
          );
        })}
      </div>
  )
}