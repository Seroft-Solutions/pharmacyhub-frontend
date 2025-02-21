import { logger } from '@/shared/lib/logger';

interface LicensingApiResponse<T> {
  data?: T;
  error?: string;
}

interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ConnectionRequest {
  userId: number;
  targetId: number;
  notes?: string;
}

export class LicensingService {
  private baseUrl = '/api/licensing';
  private entityType: string;

  constructor(entityType: 'pharmacist' | 'pharmacy-manager' | 'proprietor' | 'salesman') {
    this.entityType = entityType;
  }

  private getEndpoint(path: string): string {
    return `${this.baseUrl}/${this.entityType}${path}`;
  }

  async listUsers<T extends BaseUser>(): Promise<LicensingApiResponse<T[]>> {
    const startTime = Date.now();
    try {
      logger.info(`Fetching ${this.entityType} list`, {
        endpoint: this.getEndpoint(''),
        entityType: this.entityType
      });

      const response = await fetch(this.getEndpoint(''));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch ${this.entityType} list`);
      }

      logger.info(`Successfully fetched ${this.entityType} list`, {
        count: data.length.toString(),
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { data };
    } catch (error) {
      logger.error(`Failed to fetch ${this.entityType} list`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUser<T extends BaseUser>(id: number): Promise<LicensingApiResponse<T>> {
    const startTime = Date.now();
    try {
      logger.info(`Fetching ${this.entityType} details`, {
        id: id.toString(),
        endpoint: this.getEndpoint(`/${id}`),
        entityType: this.entityType
      });

      const response = await fetch(this.getEndpoint(`/${id}`));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch ${this.entityType} details`);
      }

      logger.info(`Successfully fetched ${this.entityType} details`, {
        id: id.toString(),
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { data };
    } catch (error) {
      logger.error(`Failed to fetch ${this.entityType} details`, {
        id: id.toString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createConnection(request: ConnectionRequest): Promise<LicensingApiResponse<{ id: number }>> {
    const startTime = Date.now();
    try {
      logger.info(`Creating ${this.entityType} connection`, {
        userId: request.userId.toString(),
        targetId: request.targetId.toString(),
        endpoint: this.getEndpoint('/connections'),
        entityType: this.entityType
      });

      const response = await fetch(this.getEndpoint('/connections'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to create ${this.entityType} connection`);
      }

      logger.info(`Successfully created ${this.entityType} connection`, {
        connectionId: data.id.toString(),
        userId: request.userId.toString(),
        targetId: request.targetId.toString(),
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { data };
    } catch (error) {
      logger.error(`Failed to create ${this.entityType} connection`, {
        userId: request.userId.toString(),
        targetId: request.targetId.toString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        entityType: this.entityType,
        responseTime: `${Date.now() - startTime}ms`
      });

      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export instances for each entity type
export const pharmacistService = new LicensingService('pharmacist');
export const pharmacyManagerService = new LicensingService('pharmacy-manager');
export const proprietorService = new LicensingService('proprietor');
export const salesmanService = new LicensingService('salesman');