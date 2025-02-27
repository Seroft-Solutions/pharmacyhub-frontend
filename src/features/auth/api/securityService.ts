import { apiClient } from '@/shared/api/apiClient';
import { Permission, Role } from '@/types/auth';

class SecurityServiceImpl {
  async checkAccess(roles: Role[], permissions: Permission[]) {
    const response = await apiClient.post('/security/check-access', {
      roles,
      permissions
    });
    if (response.error) throw response.error;
    return response.data?.hasAccess ?? false;
  }
}

export const securityService = new SecurityServiceImpl();