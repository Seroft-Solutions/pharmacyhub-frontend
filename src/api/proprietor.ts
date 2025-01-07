import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface ProprietorDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  proprietor: ProprietorVO;
}
interface ProprietorVO {
  categoryRequired: string;
  licenseDuration: string;
  experienced: string;
  pharmacyName: string;
  city: string;
  location: string;
  contactNumber: string;
  categoryProvince: string;
}

export const useProprietorApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getProprietor = () => get<ProprietorDetails[]>('/api/proprietor/v1/get-all');


  return {
    getProprietor,
  };
};