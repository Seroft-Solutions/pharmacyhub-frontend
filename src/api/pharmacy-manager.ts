import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface PharmacyManagerDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  pharmacyManager: PharmacyManagerVO;
}
export interface PharmacyManagerVO {
  id:string;
  experienceAsManager: string;
  education:string;
  contactNumber: string;
  area: string;
  city: string;
  experience: string;
  previousPharmacyName: string;
   currentJobStatus: string;
  // shiftTime: string;   //demo
  timePrefernce: string
  saleryExpectation:string
}

export const usePharmacyManagerApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getPharmacyManager = () => get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all');


  return {
    getPharmacyManager,
  };
};