import { apiClient } from '@/lib/api/apiClient';

export interface ProprietorVO {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PHUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other properties as needed
}

export class ProprietorService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly apiClient: any) {}

  public async addUser(data: ProprietorVO): Promise<PHUserDTO> {
    try {
      const response = await this.apiClient.post('/api/proprietor', data);
      return response;
    } catch (error) {
      console.error("Error adding user in proprietor group", error);
      throw error;
    }
  }
}

export const proprietorService = new ProprietorService(apiClient);