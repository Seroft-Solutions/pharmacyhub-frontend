import axios from 'axios';

export interface ProprietorVO {
  // Define the ProprietorVO interface based on your requirements
  pharmacyName: string;
  city: string;
  area: string;
  contactNumber: string;
  licenseRequired: boolean;
  requiredLicenseDuration: string;
}

export const useProprietorApi = () => {
  const AddUserInProprietorGroup = async (data: ProprietorVO): Promise<{ success: true } | { error: string }> => {
    try {
      const response = await axios.post<{ success: true }>('/api/proprietor', data);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unknown error occurred' };
    }
  };

  return {
    AddUserInProprietorGroup
  };
};
