import {useApi} from '@/hooks/useApi';
import {useAuth} from '@/hooks/useAuth';

export interface SalesmanDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  salesman: SalesmanVO;
}
export interface SalesmanVO {
  id: number;   //demo
  experience: string
  education:string
  contactNumber: string
  area: string
  city: string
  previousPharmacyName: string
  currentJobStatus: string
  timePrefernce: string
  saleryExpectation:string
}
export interface SalesmenConnectionsDTO {
  salesmanId: number;
  userId?: string;
  connectionStatusEnum?: string;
  notes?: string;
  userGroup?: string;
}
export const useSalesmanApi = () => {
  const { getToken, logout } = useAuth();
  const { get, post, put, del } = useApi(getToken, logout);

  const getSalesman = () => get<SalesmanDetails[]>('/api/salesman/v1/get-all');
  const AddUserInSalesmantGroup=(data)=>post<SalesmanVO[]>(`/api/salesman/v1/add-info`, data);
  const connectWithSalesman = (data: SalesmenConnectionsDTO) =>
      post('/api/salesman/v1/connect', data);

  const approveStatus = (id) =>
      post(`/api/salesman/v1/approveStatus/${id}`);

  const rejectStatus = (id) =>
      post(`/api/salesman/v1/rejectStatus/${id}`);
  const getSalesmanRequests = () => get<SalesmanDetails[]>('/api/salesman/v1/get-all-pending-requests');

  const getAllConnections = () => get<SalesmanDetails[]>('/api/salesman/v1/get-all-connections');

  return {
    getSalesman,
    AddUserInSalesmantGroup,
    connectWithSalesman,
    getSalesmanRequests,
    rejectStatus,
    approveStatus,
    getAllConnections
  };
};