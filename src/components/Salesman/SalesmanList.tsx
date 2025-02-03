"use client"
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";
import {SalesmanDetails, useSalesmanApi} from "@/api/salesman";

export default function SalesmanList() {
  const {getSalesman} = useSalesmanApi();
  const [salesmen, setSalesman] = useState<SalesmanDetails[]>([]);

  useEffect(() => {
    fetchSalesman();
  }, []);
  const fetchSalesman = async () => {
    const response = await getSalesman();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setSalesman(response.data || []);
  }

  return (
      <div className="space-y-4">
        {salesmen.map((salesman) => {
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

          return (
              <UserCard
                  key={salesman.salesman.id}
                  name={`${salesman.firstName} ${salesman.lastName}`}
                  fields={fields}
              />
          );
        })}
      </div>
  );
}