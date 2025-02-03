import React, { forwardRef } from 'react';
import { ProprietorVO, useProprietorApi} from "@/api/proprietor";
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

const ProprietorForm= forwardRef<HTMLFormElement>((props, ref) =>  {

  const {control, register, handleSubmit, formState: {errors}} = useForm<ProprietorVO>({
    defaultValues: {}
  });
  // const {user}=useAuth();
  const {} = useProprietorApi()
  const handleFormSubmit = async (data: ProprietorVO) => {
    // console.log("Inside submit");
    // console.log("City is:", data.city);
    // console.log("Batch is:", data.batch);
    // console.log("Data is:", data);
    // // data.userId = user?.id;
    // let result;
    //
    // result = await AddUserInPharmasictGroup(data);
    // if (result.error)
    // {
    //   throw new Error(result.error);
    // } else
    // {
    //   console.log("User added successfully")
    // }

  };

  return (
      <div className="w-full">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
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