import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => {
      // Get top categories sorted by product count
      return data.tags
        .filter((cat) => cat.products > 1000)
        .sort((a, b) => b.products - a.products)
        .slice(0, 20)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          products: cat.products,
        }));
    },
  });
}
