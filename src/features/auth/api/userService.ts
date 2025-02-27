import { apiClient } from '@/shared/api/apiClient';

class UserServiceImpl {
  async getUserProfile() {
    const response = await apiClient.get('/users/profile');
    if (response.error) throw response.error;
    return response.data;
  }

  async refreshPermissions() {
    const response = await apiClient.get('/users/refresh-permissions');
    if (response.error) throw response.error;
    return response.data;
  }
}

export const userService = new UserServiceImpl();