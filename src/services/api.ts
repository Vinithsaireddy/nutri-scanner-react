const BASE_URL = 'https://world.openfoodfacts.org';
const USER_AGENT = 'NutriScan - Web - Version 1.0 - contact@nutriscan.app';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
}

async function fetchWithUserAgent(endpoint: string, options: FetchOptions = {}) {
  const { params, ...fetchOptions } = options;
  
  let url = `${BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'User-Agent': USER_AGENT,
      ...fetchOptions.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  nutriscore_grade?: string;
  nutrition_grades?: string;
  categories_tags?: string[];
  labels_tags?: string[];
  ingredients_text?: string;
  nutriments?: {
    energy_kcal_100g?: number;
    energy_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    sugars_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
    'energy-kcal_100g'?: number;
  };
  quantity?: string;
  serving_size?: string;
  countries_tags?: string[];
  allergens_tags?: string[];
}

export interface SearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  url: string;
  products: number;
}

export interface CategoriesResponse {
  count: number;
  tags: Category[];
}

export async function searchProducts(
  query: string,
  page: number = 1,
  pageSize: number = 24
): Promise<SearchResponse> {
  return fetchWithUserAgent('/cgi/search.pl', {
    params: {
      search_terms: query,
      json: 'true',
      page,
      page_size: pageSize,
    },
  });
}

export async function searchProductsByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 24
): Promise<SearchResponse> {
  return fetchWithUserAgent('/cgi/search.pl', {
    params: {
      tagtype_0: 'categories',
      tag_contains_0: 'contains',
      tag_0: category,
      json: 'true',
      page,
      page_size: pageSize,
    },
  });
}

export async function getProductByBarcode(barcode: string): Promise<{ product: Product; status: number }> {
  return fetchWithUserAgent(`/api/v2/product/${barcode}.json`);
}

export async function getCategories(): Promise<CategoriesResponse> {
  return fetchWithUserAgent('/categories.json');
}

export async function getPopularProducts(page: number = 1, pageSize: number = 24): Promise<SearchResponse> {
  return fetchWithUserAgent('/cgi/search.pl', {
    params: {
      action: 'process',
      sort_by: 'popularity_key',
      json: 'true',
      page,
      page_size: pageSize,
    },
  });
}
