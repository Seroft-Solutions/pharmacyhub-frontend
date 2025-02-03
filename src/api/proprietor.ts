import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface ProprietorDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  proprietor: ProprietorVO;
}
export interface ProprietorVO {
  id: string;   //demo
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


  return {
    getProprietor,
  };
};