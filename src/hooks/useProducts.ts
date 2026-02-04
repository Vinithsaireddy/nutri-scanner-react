import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { searchProducts, searchProductsByCategory, getProductByBarcode, getPopularProducts, type Product } from '@/services/api';

export function useProductSearch(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['products', 'search', query],
    queryFn: ({ pageParam = 1 }) => searchProducts(query, pageParam, 24),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.page_count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(category: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['products', 'category', category],
    queryFn: ({ pageParam = 1 }) => searchProductsByCategory(category, pageParam, 24),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.page_count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && category.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductByBarcode(barcode: string) {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: () => getProductByBarcode(barcode),
    enabled: barcode.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePopularProducts() {
  return useInfiniteQuery({
    queryKey: ['products', 'popular'],
    queryFn: ({ pageParam = 1 }) => getPopularProducts(pageParam, 24),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.page_count) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

export type SortOption = 'name-asc' | 'nutriscore-best';

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => {
        const nameA = a.product_name || '';
        const nameB = b.product_name || '';
        return nameA.localeCompare(nameB);
      });
    case 'nutriscore-best':
      return sorted.sort((a, b) => {
        const scoreA = a.nutriscore_grade || a.nutrition_grades || 'z';
        const scoreB = b.nutriscore_grade || b.nutrition_grades || 'z';
        return scoreA.localeCompare(scoreB);
      });
    default:
      return sorted;
  }
}
