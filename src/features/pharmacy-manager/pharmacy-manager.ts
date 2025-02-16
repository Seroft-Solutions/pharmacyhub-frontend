import { apiClient } from '@/lib/api/apiClient';
import { AxiosError } from 'axios';

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

export interface PHUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other properties as needed
}

class PharmacyManagerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly apiClient: any) {}

  public async getPharmacyManager(): Promise<PharmacyManagerDetails[]> {
    try {
      const response = await this.apiClient.get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all');
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }

  public async AddUserInPharmacyManagerGroup(data: PharmacyManagerVO): Promise<PHUserDTO> {
    try {
      const response = await this.apiClient.post<PHUserDTO>(`/api/pharmacymanager/v1/add-info`, data);
      return response;
    } catch (error: any) { 
      throw error;
    }
  }

  public async connectWithPharmacyManager(data: PharmacyManagerConnectionsDTO): Promise<void> {
    try {
      await this.apiClient.post('/api/pharmacymanager/v1/connect', data);
    } catch (error: any) { 
      throw error;
    }
  }

  public async approveStatus(id: number): Promise<void> {
    try {
      await this.apiClient.post(`/api/pharmacymanager/v1/approveStatus/${id}`);
    } catch (error: any) { 
      throw error;
    }
  }

  public async rejectStatus(id: number): Promise<void> {
    try {
      await this.apiClient.post(`/api/pharmacymanager/v1/rejectStatus/${id}`);
    } catch (error: any) { 
      throw error;
    }
  }

  public async getPharmacyManagerRequests(): Promise<PharmacyManagerDetails[]> {
    try {
      const response = await this.apiClient.get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all-pending-requests');
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }

  public async getAllConnections(): Promise<PharmacyManagerDetails[]> {
    try {
      const response = await this.apiClient.get<PharmacyManagerDetails[]>('/api/pharmacymanager/v1/get-all-connections');
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }
}

export const pharmacyManagerService = new PharmacyManagerService(apiClient);
