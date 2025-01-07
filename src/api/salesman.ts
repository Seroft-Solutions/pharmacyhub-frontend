import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface SalesmanDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  salesman: SalesmanVO;
}
interface SalesmanVO {
  contactNumber: string
  area: string
  city: string
  experience: string
  previousPharmacyName: string
  currentJobStatus: string
  shiftTime: string
}

export const useSalesmanApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getSalesman = () => get<SalesmanDetails[]>('/api/salesman/v1/get-all');


  return {
    getSalesman,
  };
};