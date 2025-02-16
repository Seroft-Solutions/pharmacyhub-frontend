import { apiClient } from '@/lib/api/apiClient';

export interface SalesmanDetails {
  firstName: string;
  lastName: string;
  connected: boolean;
  salesman: SalesmanVO;
}

export interface SalesmanVO {
  id: number;   //demo
  experience: string
  education: string
  contactNumber: string
  area: string
  city: string
  previousPharmacyName: string
  currentJobStatus: string
  timePrefernce: string
  saleryExpectation: string
  userId: string;
}

export interface SalesmenConnectionsDTO {
  salesmanId: number;
  userId?: string;
  connectionStatusEnum?: string;
  notes?: string;
  userGroup?: string;
}

class SalesmanService {
  private static instance: SalesmanService;

  private constructor() {}

  public static getInstance(): SalesmanService {
    if (!SalesmanService.instance) {
      SalesmanService.instance = new SalesmanService();
    }
    return SalesmanService.instance;
  }

  public async getSalesman(): Promise<SalesmanDetails[]> {
    const response = await apiClient.get('/api/salesman/v1/get-all');
    return (response as any).data;
  }

  public async AddUserInSalesmantGroup(data: SalesmanVO): Promise<SalesmanVO[]> {
    const response = await apiClient.post(`/api/salesman/v1/add-info`, data);
    return (response as any).data;
  }

  public async connectWithSalesman(data: SalesmenConnectionsDTO): Promise<any> {
    const response = await apiClient.post('/api/salesman/v1/connect', data);
    return (response as any).data;
  }

  public async approveStatus(id: number): Promise<any> {
    const response = await apiClient.post(`/api/salesman/v1/approveStatus/${id}`);
    return (response as any).data;
  }

  public async rejectStatus(id: number): Promise<any> {
    const response = await apiClient.post(`/api/salesman/v1/rejectStatus/${id}`);
    return (response as any).data;
  }

  public async getSalesmanRequests(): Promise<SalesmanDetails[]> {
    const response = await apiClient.get('/api/salesman/v1/get-all-pending-requests');
    return (response as any).data;
  }

  public async getAllConnections(): Promise<SalesmanDetails[]> {
    const response = await apiClient.get('/api/salesman/v1/get-all-connections');
    return (response as any).data;
  }
}

export const salesmanService = SalesmanService.getInstance();