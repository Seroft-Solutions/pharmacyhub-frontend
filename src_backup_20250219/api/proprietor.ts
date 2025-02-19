import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';
export interface ProprietorDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  proprietor: ProprietorVO;
}
export interface ProprietorVO {
  id: number;
  licenseRequired: string;
  requiredLicenseDuration: string;
  pharmacyName: string;
  city: string;
  area: string;
  contactNumber: string;
  userId: string;
}
export interface ProprietorsConnectionsDTO {
  proprietorId: number;
  userId?: string;
  connectionStatusEnum?: string;
  notes?: string;
  userGroup?: string;
}
export const useProprietorApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getProprietor = () => get<ProprietorDetails[]>('/api/proprietor/v1/get-all');
  const AddUserInProprietorGroup=(data)=>post<ProprietorVO[]>(`/api/proprietor/v1/add-info`, data);
  const connectWithProprietor = (data: ProprietorsConnectionsDTO) =>
      post('/api/proprietor/v1/connect', data);

  const approveStatus = (id) =>
      post(`/api/proprietor/v1/approveStatus/${id}`);

  const rejectStatus = (id) =>
      post(`/api/proprietor/v1/rejectStatus/${id}`);
  const getProprietorRequests = () => get<ProprietorDetails[]>('/api/proprietor/v1/get-all-pending-requests');

  const getAllConnections = () => get<ProprietorDetails[]>('/api/proprietor/v1/get-all-connections');



  return {
    getProprietor,
    AddUserInProprietorGroup,
    getAllConnections,
    getProprietorRequests,
    approveStatus,
    rejectStatus,
    connectWithProprietor
  };
};