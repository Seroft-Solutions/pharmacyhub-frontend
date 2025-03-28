import { useApiMutation, useApiQuery } from '../../../app-api-handler';
import { FeatureDTO } from '../../types';
import { useQueryClient } from '@tanstack/react-query';

const FEATURE_KEYS = {
  all: ['features'] as const,
  lists: () => [...FEATURE_KEYS.all, 'list'] as const,
  list: (filters: any) => [...FEATURE_KEYS.lists(), { filters }] as const,
  accessible: () => [...FEATURE_KEYS.all, 'accessible'] as const,
  checkAccess: (featureCode: string) => [...FEATURE_KEYS.all, 'check', featureCode] as const,
  checkBulkAccess: (featureCodes: string[]) => [...FEATURE_KEYS.all, 'check-bulk', featureCodes] as const,
  detail: (id: number) => [...FEATURE_KEYS.all, 'detail', id] as const,
};

export const useFeatureApi = () => {
  const queryClient = useQueryClient();

  // Get all accessible features for the current user
  const useAccessibleFeatures = () => {
    return useApiQuery<FeatureDTO[]>({
      queryKey: FEATURE_KEYS.accessible(),
      url: '/api/v1/features/accessible',
      options: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    });
  };

  // Check if the current user has access to a specific feature
  const useCheckFeatureAccess = (featureCode: string) => {
    return useApiQuery<boolean>({
      queryKey: FEATURE_KEYS.checkAccess(featureCode),
      url: `/api/v1/features/check-access/${featureCode}`,
      options: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    });
  };

  // Check if the current user has access to multiple features at once
  const useCheckBulkFeatureAccess = (featureCodes: string[]) => {
    return useApiMutation<Record<string, boolean>, string[]>({
      mutationFn: (featureCodes) => ({
        url: '/api/v1/features/check-bulk-access',
        method: 'POST',
        data: featureCodes,
      }),
    });
  };

  // Get all features (admin only)
  const useAllFeatures = () => {
    return useApiQuery<FeatureDTO[]>({
      queryKey: FEATURE_KEYS.lists(),
      url: '/api/v1/features',
      options: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    });
  };

  // Create a new feature (admin only)
  const useCreateFeature = () => {
    return useApiMutation<FeatureDTO, FeatureDTO>({
      mutationFn: (feature) => ({
        url: '/api/v1/features',
        method: 'POST',
        data: feature,
      }),
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
        },
      },
    });
  };

  // Update an existing feature (admin only)
  const useUpdateFeature = () => {
    return useApiMutation<FeatureDTO, { id: number; feature: FeatureDTO }>({
      mutationFn: ({ id, feature }) => ({
        url: `/api/v1/features/${id}`,
        method: 'PUT',
        data: feature,
      }),
      options: {
        onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.detail(variables.id) });
          queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
        },
      },
    });
  };

  // Delete a feature (admin only)
  const useDeleteFeature = () => {
    return useApiMutation<void, number>({
      mutationFn: (id) => ({
        url: `/api/v1/features/${id}`,
        method: 'DELETE',
      }),
      options: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.lists() });
        },
      },
    });
  };

  return {
    useAccessibleFeatures,
    useCheckFeatureAccess,
    useCheckBulkFeatureAccess,
    useAllFeatures,
    useCreateFeature,
    useUpdateFeature,
    useDeleteFeature,
  };
};
