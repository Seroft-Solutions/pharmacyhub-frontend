"use client"
import {PharmacistDetails, usePharmacistApi} from "@/api/pharmacist";
import {useEffect, useState} from "react";
import UserCard from "@/components/ui/UserCard";

export default function PharmacistList() {
  const {getPharmacist} = usePharmacistApi();
  const [pharmasict, setPharmasict] = useState<PharmacistDetails[]>([]);

  useEffect(() => {
    fetchPharmasict();
  }, []);
  const fetchPharmasict = async () => {
    const response = await getPharmacist();
    if (response.error)
    {
      throw new Error(response.error);
    }
    console.log(response.data);
    setPharmasict(response.data || []);
  }

  return (
      <div className="space-y-4">
        {pharmasict.map((pharma) => {
          const fields = [
            { name: "Name", value: `${pharma.firstName} ${pharma.lastName}` },
            { name: "Contact", value: pharma.pharmacist.contactNumber },
            { name: "City", value: pharma.pharmacist.city },
            { name: "Area", value: pharma.pharmacist.area },
            { name: "Experience", value: pharma.pharmacist.experience },
            { name: "Current Job Status", value: pharma.pharmacist.currentJobStatus },
            { name: "Previous Pharmacy", value: pharma.pharmacist.previousPharmacyName },
            { name: "Shift Time", value: pharma.pharmacist.timePreference },
            { name: "Category Available", value: pharma.pharmacist.categoryAvailable },
            { name: "License Duration", value: pharma.pharmacist.licenseDuration },
            { name: "University Name", value: pharma.pharmacist.universityName },
            { name: "Batch", value: pharma.pharmacist.batch },
          ];

          return (
              <UserCard
                  key={pharma.pharmacist.id}
                  name={`${pharma.firstName} ${pharma.lastName}`}
                  fields={fields}
              />
          );
        })}
      </div>
  )
}