import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';
import {PharmacistVO} from "@/api/pharmacist";

export interface ProprietorDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  proprietor: ProprietorVO;
}
export interface ProprietorVO {
  id: string;
  licenseRequired: string;
  requiredLicenseDuration: string;
  pharmacyName: string;
  city: string;
  area: string;
  contactNumber: string;

}

export const useProprietorApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getProprietor = () => get<ProprietorDetails[]>('/api/proprietor/v1/get-all');
  const AddUserInProprietorGroup=(data)=>post<ProprietorVO[]>(`/api/proprietor/v1/add-info`, data);


  return {
    getProprietor,
    AddUserInProprietorGroup,
  };
};