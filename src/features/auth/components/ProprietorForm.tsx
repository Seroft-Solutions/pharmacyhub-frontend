import React, { forwardRef } from 'react';
import { ProprietorVO, useProprietorApi} from "@/services/proprietor";
import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";
import {SelectField} from "@/components/ui/SelectField";
import {
  area,
  city,
  licenseDuration, licenseRequired,
} from "@/components/RegistrationForm/SelectFieldOptons";
import {RadioButtonField} from "@/components/ui/RadioButtonField";
import PharmacistForm from "@/components/RegistrationForm/PharmacistForm";

interface ProprietorFormProps {
  // Add any props if needed
}

const ProprietorForm= forwardRef<HTMLFormElement, ProprietorFormProps>((props, ref) =>  {

  const {control, register, handleSubmit, formState: {errors}} = useForm<ProprietorVO>({
    defaultValues: {}
  });
  const {AddUserInProprietorGroup} = useProprietorApi()
  const handleFormSubmit = async (data: ProprietorVO) => {
    console.log("Inside submit");
    console.log("Data is:", data);


    try {

      const result = await AddUserInProprietorGroup(data);
      if ('error' in result) {
        throw new Error(result.error as string);
      }
      console.log("User added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
      <div className="w-full">
        <form ref={ref} onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
          <RadioButtonField
              name="licenseRequired"
              label="License Required"
              control={control}
              options={licenseRequired}
              required={true}
          />

          <RadioButtonField
              name="requiredLicenseDuration"
              label="Required License Duration"
              control={control}
              options={licenseDuration}
              required={true}
          />
          <InputField
              name="pharmacyName"
              label="Pharmacy Name"
              register={register}
              placeholder="Pharmacy Name"
              required
              error={errors.pharmacyName}
          />

          <SelectField
              name="city"
              label="City"
              control={control}
              options={city}
              placeholder="City"
              required={true}
          />
          <SelectField
              name="area"
              label="Area"
              control={control}
              options={area}
              placeholder="Area"
              required={true}
          />
          <InputField
              name="contactNumber"
              label="Contact Number"
              register={register}
              placeholder="Contact Number"
              required
              type="number"
              error={errors.contactNumber}
              maxLength={11}
              exactLength={true}
          />

        </form>
      </div>
  );
}
);
ProprietorForm.displayName = 'ProprietorForm';

export default ProprietorForm;
