import { apiClient } from '@/lib/api/apiClient';

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

class PharmacyManagerService {
  private static instance: PharmacyManagerService;

  private constructor() {}

  public static getInstance(): PharmacyManagerService {
    if (!PharmacyManagerService.instance) {
      PharmacyManagerService.instance = new PharmacyManagerService();
    }
    return PharmacyManagerService.instance;
  }

  public async getPharmacyManager(): Promise<PharmacyManagerDetails[]> {
    const response = await apiClient.get('/api/pharmacymanager/v1/get-all');
    return (response as any).data;
  }

  public async AddUserInPharmacyManagerGroup(data: PharmacyManagerVO): Promise<PharmacyManagerVO[]> {
    const response = await apiClient.post(`/api/pharmacymanager/v1/add-info`, data);
    return (response as any).data;
  }

  public async connectWithPharmacyManager(data: PharmacyManagerConnectionsDTO): Promise<any> {
    const response = await apiClient.post('/api/pharmacymanager/v1/connect', data);
    return (response as any).data;
  }

  public async approveStatus(id: number): Promise<any> {
    const response = await apiClient.post(`/api/pharmacymanager/v1/approveStatus/${id}`);
    return (response as any).data;
  }

  public async rejectStatus(id: number): Promise<any> {
    const response = await apiClient.post(`/api/pharmacymanager/v1/rejectStatus/${id}`);
    return (response as any).data;
  }

  public async getPharmacyManagerRequests(): Promise<PharmacyManagerDetails[]> {
    const response = await apiClient.get('/api/pharmacymanager/v1/get-all-pending-requests');
    return (response as any).data;
  }

  public async getAllConnections(): Promise<PharmacyManagerDetails[]> {
    const response = await apiClient.get('/api/pharmacymanager/v1/get-all-connections');
    return (response as any).data;
  }
}

export const pharmacyManagerService = PharmacyManagerService.getInstance();