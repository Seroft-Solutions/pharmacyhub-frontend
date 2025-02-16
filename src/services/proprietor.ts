import { apiClient } from '@/lib/api/apiClient';

export interface ProprietorVO {
  [key: string]: string;
}

class ProprietorService {
  private static instance: ProprietorService;

  private constructor() {}

  public static getInstance(): ProprietorService {
    if (!ProprietorService.instance) {
      ProprietorService.instance = new ProprietorService();
    }
    return ProprietorService.instance;
  }

  public async AddUserInProprietorGroup(data: ProprietorVO): Promise<any> {
    try {
      const response = await apiClient.post('/api/proprietor', data);
      return (response as any).data;
    } catch (error) {
      console.error("Error adding user in proprietor group", error);
      throw error;
    }
  }
}

export const proprietorService = ProprietorService.getInstance();
