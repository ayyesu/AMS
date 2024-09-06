import { getCourses } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useGetCourses = (offset: any, pageLimit: any, searchQuery: any) => {
  return useQuery({
    queryKey: ['courses', offset, pageLimit, searchQuery],
    queryFn: async () => getCourses(offset, pageLimit, searchQuery),
  });
};
