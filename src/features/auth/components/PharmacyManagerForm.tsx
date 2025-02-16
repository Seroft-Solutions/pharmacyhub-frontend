import React, {forwardRef} from 'react';
import {PharmacyManagerVO, usePharmacyManagerApi} from "@/api/pharmacy-manager";
import {useForm} from "react-hook-form";
import InputField from "@/components/ui/InputField";

import {SelectField} from "@/components/ui/SelectField";
import {area, city, education, jobStatus, timePreference} from "@/components/RegistrationForm/SelectFieldOptons";
import {RadioButtonField} from "@/components/ui/RadioButtonField";

const PharmacyManagerForm = forwardRef<HTMLFormElement>((props, ref) => {

  const {control, register, handleSubmit, formState: {errors}} = useForm<PharmacyManagerVO>({
    defaultValues: {}
  });
  const {AddUserInPharmacyManagerGroup} = usePharmacyManagerApi()
  const handleFormSubmit = async (data: PharmacyManagerVO) => {
    console.log("Inside submit");
    console.log("Data is:", data);
    try {

      const result = await AddUserInPharmacyManagerGroup(data);
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

        <SelectField
          name="experience"
          label="Experience"
          control={control}
          options={Array.from({length: 25}, (_, i) => ({
            value: (i + 1 + " year").toString(),
            label: (i + 1 + " year").toString(),
          }))}
          placeholder="Experience"
          required={true}
        />
        <SelectField
          name="experienceAsManager"
          label="Experience As Manager"
          control={control}
          options={Array.from({length: 15}, (_, i) => ({
            value: (i + 1 + " year").toString(),
            label: (i + 1 + " year").toString(),
          }))}
          placeholder="Experience As Manager"
          required={true}
        />
        <SelectField
          name="education"
          label="Education"
          control={control}
          options={education}
          placeholder="Education"
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
          name="saleryExpectation"
          label="Salery Expectation"
          register={register}
          placeholder="Salery Expectation"
          required
          type="number"
          error={errors.saleryExpectation}
          maxLength={5}
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
PharmacyManagerForm.displayName = 'PharmacyManagerForm';
export default PharmacyManagerForm;