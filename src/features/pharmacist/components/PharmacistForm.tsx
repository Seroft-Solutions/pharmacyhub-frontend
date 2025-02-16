import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
// import {createPharmacist} from '@/services/pharmacist';

interface PharmacistFormData {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  qualification: string;
  experience: number;
  gender: string;
}

interface PharmacistFormProps {
  initialData?: PharmacistFormData;
  createPharmacist: (data: PharmacistFormData) => Promise<any>;
}

const PharmacistForm = ({initialData, createPharmacist}: PharmacistFormProps) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {register, handleSubmit, formState: {errors}} = useForm<PharmacistFormData>({
    defaultValues: initialData || {}
  });

  const onSubmit = async (data: PharmacistFormData) => {
    try {
      const newPharmacist = await createPharmacist(data);
      if (newPharmacist) {
        setSuccess(true);
        setError(null);
      }
    } catch (error) {
      setSuccess(false);
      setError((error as { message: string }).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {success && <p>Pharmacist created successfully!</p>}
      {error && <p>Error: {error}</p>}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name", {required: "Name is required"})} />
        {errors.name && <span>{String(errors.name.message)}</span>}
      </div>

      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input id="licenseNumber" {...register("licenseNumber", {required: "License Number is required"})} />
        {errors.licenseNumber && <span>{String(errors.licenseNumber.message)}</span>}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address", {required: "Address is required"})} />
        {errors.address && <span>{String(errors.address.message)}</span>}
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" {...register("phone", {required: "Phone Number is required"})} />
        {errors.phone && <span>{String(errors.phone.message)}</span>}
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...register("email", {required: "Email is required", pattern: /^\S+@\S+$/i})} />
        {errors.email && <span>{String(errors.email.message)}</span>}
      </div>

      <div>
        <Label htmlFor="qualification">Qualification</Label>
        <Input id="qualification" {...register("qualification", {required: "Qualification is required"})} />
        {errors.qualification && <span>{String(errors.qualification.message)}</span>}
      </div>

      <div>
        <Label htmlFor="experience">Experience (in years)</Label>
        <Input id="experience" type='number' {...register("experience", {required: "Experience is required"})} />
        {errors.experience && <span>{String(errors.experience.message)}</span>}
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select {...register("gender", {required: "Gender is required"})}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <span>{String(errors.gender.message)}</span>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PharmacistForm;
