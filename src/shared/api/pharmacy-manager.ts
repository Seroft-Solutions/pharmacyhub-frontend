import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface PharmacyManagerDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  pharmacyManager: PharmacyManagerVO;
}

export interface PharmacyManagerVO {
  id: number;
  experienceAsManager: string;
  education: string;
  contactNumber: string;
  area: string;
  city: string;
  experience: string;
  previousPharmacyName: string;
  currentJobStatus: string;
  timePrefernce: string
  saleryExpectation: string
  userId: string;
}

export interface PharmacyManagerConnectionsDTO {
  pharmacyManagerId: number;
  userId?: string;
  connectionStatusEnum?: string;
  notes?: string;
  userGroup?: string;
}

export const usePharmacyManagerApi = () => {
  const {getToken, logout} = useAuth();
  const {get, post, put, del} = useApi(getToken, logout);

  const getPharmacyManager = () => get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all');
  const AddUserInPharmacyManagerGroup = (data) => post<PharmacyManagerVO[]>(`/api/pharmacymanager/v1/add-info`, data);

  const connectWithPharmacyManager = (data: PharmacyManagerConnectionsDTO) =>
    post('/api/pharmacymanager/v1/connect', data);

  const approveStatus = (id) =>
    post(`/api/pharmacymanager/v1/approveStatus/${id}`);

  const rejectStatus = (id) =>
    post(`/api/pharmacymanager/v1/rejectStatus/${id}`);
  const getPharmacyManagerRequests = () => get<PharmacyManagerDetails[]>(
    '/api/pharmacymanager/v1/get-all-pending-requests');

  const getAllConnections = () => get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all-connections');
  return {
    getPharmacyManager,
    AddUserInPharmacyManagerGroup,
    getAllConnections,
    getPharmacyManagerRequests,
    approveStatus,
    rejectStatus,
    connectWithPharmacyManager
  };
};