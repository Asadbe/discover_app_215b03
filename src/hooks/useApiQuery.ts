import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export function useApiQuery<T>(
  key: string[],
  path: string
): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const res = await apiClient.get<T>(path);
      return res.data;
    },
  });
}

export function extractList<T>(data: unknown): T[] {
  if (!data) return [];
  const d = data as Record<string, unknown>;
  const inner = d['data'] as Record<string, unknown> | undefined;
  if (!inner) return [];
  const response = inner['response'];
  if (Array.isArray(response)) return response as T[];
  return [];
}
