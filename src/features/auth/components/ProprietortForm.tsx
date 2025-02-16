// Corrected file content with updated type definitions and syntax
import React, {forwardRef} from 'react';
import {ProprietorVO, useProprietorApi} from "../../../services/proprietor";
import {useForm} from "react-hook-form";
import {InputField} from "../../../components/ui/InputField";
import {SelectField} from "../../../components/shared/SelectField";
import {CarouselImage} from "../../../components/shared/Carousel_Image";
import {RadioButtonField} from "../../../components/shared/RadioButtonField";

interface ProprietorVO {
  [key: string]: string;
}

const ProprietorForm = forwardRef<HTMLFormElement>((props, ref) => {
    const {control, register, handleSubmit, formState: {errors}} = useForm({
      defaultValues: {
        pharmacyName: '',
        city: '',
        area: '',
        contactNumber: '',
        licenseRequired: '',
        requiredLicenseDuration: '',
      } as ProprietorVO
    });
    const {AddUserInProprietorGroup} = useProprietorApi()
    const handleFormSubmit = async (data: ProprietorVO) => {
      console.log("Inside submit");
      console.log("Data is:", data);

      try {
        const result = await AddUserInProprietorGroup(data);
        if ('error' in result && result.error) {
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
            name="licenseRequired"
            label="License Required"
            control={control}
            options={[]} // Update options here
            required={true}
          />
          <RadioButtonField
            name="requiredLicenseDuration"
            label="Required License Duration"
            control={control}
            options={[]} // Update options here
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
            options={[]} // Update options here
            placeholder="City"
            required={true}
          />
          <SelectField
            name="area"
            label="Area"
            control={control}
            options={[]} // Update options here
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