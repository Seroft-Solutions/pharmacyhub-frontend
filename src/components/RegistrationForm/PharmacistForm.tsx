import React, { forwardRef } from 'react';
import { PharmacistVO, usePharmacistApi } from "@/api/pharmacist";
import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import {
  area,
  categoryAvailable,
  city,
  jobStatus,
  licenseDuration,
  timePreference
} from "@/components/RegistrationForm/SelectFieldOptons";
import { RadioButtonField } from "@/components/ui/RadioButtonField";
import {useAuth} from "@/hooks/useAuth";

const PharmacistForm = forwardRef<HTMLFormElement>((props, ref) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<PharmacistVO>({
    defaultValues: {}
  });
  const {user}=useAuth();
  const { AddUserInPharmacistGroup } = usePharmacistApi();


  const handleFormSubmit = async (data: PharmacistVO) => {
    console.log("Inside submit");
    console.log("Data is:", data);
    console.log("UserId",user?.id)

    try {

      const result = await AddUserInPharmacistGroup(data,user?.id);
      if (result.error) {
        throw new Error(result.error);
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
              name="categoryAvailable"
              label="Category Available"
              control={control}
              options={categoryAvailable}
              required={true}
          />
          <RadioButtonField
              name="licenseDuration"
              label="Availability License Duration"
              control={control}
              options={licenseDuration}
              required={true}
          />
          <SelectField
              name="experience"
              label="Experience"
              control={control}
              options={Array.from({length: 10}, (_, i) => ({
                value: (i + 1 + " year").toString(),
                label: (i + 1 + " year").toString(),
              }))}
              placeholder="Experience"
              required={true}
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
          <InputField
              name="universityName"
              label="University Name"
              register={register}
              placeholder="University Name"
              error={errors.universityName}
          />
          <InputField
              name="batch"
              label="Batch"
              register={register}
              placeholder="Batch"
              error={errors.timePreference}
          />
          <RadioButtonField
              name="timePreference"
              label="Time Preference"
              control={control}
              options={timePreference}
              required={true}
          />
          <InputField
              name="previousPharmacyName"
              label="Previous Pharmacy Name"
              register={register}
              placeholder="Previous Pharmacy Name"
              error={errors.previousPharmacyName}
          />

          <RadioButtonField
              name="currentJobStatus"
              label="Current Job Status"
              control={control}
              options={jobStatus}
              required={true}
          />
        </form>
      </div>
  );
});
PharmacistForm.displayName = 'PharmacistForm';

export default PharmacistForm;
