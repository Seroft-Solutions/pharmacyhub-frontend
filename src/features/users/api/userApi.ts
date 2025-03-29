/**
 * User API Service
 * 
 * This service integrates the generated OpenAPI User services with TanStack Query.
 * It provides hooks for querying and mutating user data.
 */

import { 
  createOpenApiQueryHook, 
  useOpenApiMutation 
} from '@/core/api/hooks';
import { userKeys } from '@/core/api/utils/openApiQueryKeys';
import { 
  UserService,
  UserDTO,
  CreateUserRequest,
  UpdateUserRequest,
  PagedUserResponse
} from '@/core/api/generated';

// Create typed query hooks for user services
export const useUsers = createOpenApiQueryHook<
  [{ page?: number; size?: number }],
  PagedUserResponse
>(({ page, size } = {}) => userKeys.list({ page, size }));

export const useUser = createOpenApiQueryHook<
  [number], 
  UserDTO
>((id) => userKeys.detail(id));

// Query hooks with implementation
export function useGetUsers(page = 0, size = 20, options = {}) {
  return useUsers(
    () => UserService.getUsers({ page, size }),
    [{ page, size }],
    options
  );
}

export function useGetUserById(id: number, options = {}) {
  return useUser(
    () => UserService.getUserById({ id }),
    [id],
    options
  );
}

// Mutation hooks
export function useCreateUser(options = {}) {
  return useOpenApiMutation<CreateUserRequest, UserDTO>(
    (data) => UserService.createUser({ requestBody: data }),
    options
  );
}

export function useUpdateUser(options = {}) {
  return useOpenApiMutation<
    { id: number; data: UpdateUserRequest }, 
    UserDTO
  >(
    ({ id, data }) => UserService.updateUser({ id, requestBody: data }),
    options
  );
}

export function useDeleteUser(options = {}) {
  return useOpenApiMutation<number, void>(
    (id) => UserService.deleteUser({ id }),
    options
  );
}
