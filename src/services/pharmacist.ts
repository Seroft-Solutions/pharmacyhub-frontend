import { apiClient } from '@/lib/api/apiClient';
import { AxiosError } from 'axios';
import serviceLocator from '@/lib/service-locator';

export interface PharmacistData {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  qualification: string;
  experience: number;
  gender: string;
}

export interface PHUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other properties as needed
}

const API_BASE_URL = '/api/pharmacists'; // Assuming a base URL for pharmacist endpoints

class PharmacistService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly apiClient: any) {}

  // Create a new pharmacist profile
  public async createPharmacist(data: PharmacistData): Promise<PHUserDTO> {
    try {
      const response = await this.apiClient.post<PHUserDTO>(API_BASE_URL, data);
      return response;
    } catch (error: any) { 
      throw error;
    }
  }

  // Get all pharmacist profiles
  public async getAllPharmacists(): Promise<PharmacistData[]> {
    try {
       const response = await this.apiClient.get<PharmacistData[]>(API_BASE_URL);
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }

  // Get a single pharmacist profile by ID
  public async getPharmacistById(id: string): Promise<PharmacistData> {
    try {
       const response = await this.apiClient.get<PharmacistData>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }

  // Update a pharmacist profile
  public async updatePharmacist(id: string, data: PharmacistData): Promise<PharmacistData> {
    try {
       const response = await this.apiClient.put<PharmacistData>(`${API_BASE_URL}/${id}`, data);
      return response.data;
    } catch (error: any) { 
      throw error;
    }
  }

  // Delete a pharmacist profile
  public async deletePharmacist(id: string): Promise<void> {
    try {
       await this.apiClient.delete(`${API_BASE_URL}/${id}`);
    } catch (error: any) { 
      throw error;
    }
  }
}

const pharmacistService = new PharmacistService(apiClient);
serviceLocator.register('pharmacistService', pharmacistService);

export { pharmacistService };
export const createPharmacist = pharmacistService.createPharmacist.bind(pharmacistService);
