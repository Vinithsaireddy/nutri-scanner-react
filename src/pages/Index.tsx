import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Package, TrendingUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChips } from '@/components/CategoryChips';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { SortDropdown } from '@/components/SortDropdown';
import { useDebounce } from '@/hooks/useDebounce';
import { useProductSearch, usePopularProducts, useProductsByCategory, sortProducts, type SortOption } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { type Product } from '@/services/api';

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Determine which query to use
  const isSearching = debouncedSearch.length > 0;
  const isCategoryFiltering = selectedCategory !== null;

  // Queries
  const searchQuery_result = useProductSearch(debouncedSearch, isSearching);
  const categoryQuery = useProductsByCategory(selectedCategory || '', isCategoryFiltering && !isSearching);
  const popularQuery = usePopularProducts();

  // Pick active query
  const activeQuery = isSearching 
    ? searchQuery_result 
    : isCategoryFiltering 
      ? categoryQuery 
      : popularQuery;

  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage,
    isError 
  } = activeQuery;

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // Auto-fetch next page when intersecting
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset category when searching
  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setSelectedCategory(null);
    }
  }, [debouncedSearch]);

  // Flatten and sort products
  const products = useMemo(() => {
    if (!data?.pages) return [];
    const allProducts = data.pages.flatMap((page) => page.products);
    return sortProducts(allProducts, sortOption);
  }, [data, sortOption]);

  const totalCount = data?.pages[0]?.count || 0;

  const handleBarcodeSearch = (barcode: string) => {
    navigate(`/product/${barcode}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Food Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search through millions of products, check nutritional values, and make informed food choices.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            onSearch={setSearchQuery}
            onBarcodeSearch={handleBarcodeSearch}
          />
        </div>

        {/* Category Chips */}
        <div className="mb-8">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            isLoading={categoriesLoading}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isSearching ? (
              <h3 className="font-display font-semibold text-lg text-foreground">
                Results for "{debouncedSearch}"
              </h3>
            ) : isCategoryFiltering ? (
              <h3 className="font-display font-semibold text-lg text-foreground capitalize">
                {categories.find(c => c.id === selectedCategory)?.name.split(':').pop()?.trim() || 'Category'}
              </h3>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Popular Products
                </h3>
              </div>
            )}
            {totalCount > 0 && (
              <span className="text-sm text-muted-foreground">
                ({totalCount.toLocaleString()} products)
              </span>
            )}
          </div>

          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground">
              Please try again later or check your connection.
            </p>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try a different search term or browse categories.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product, index: number) => (
                <ProductCard 
                  key={`${product.code}-${index}`} 
                  product={product} 
                  index={index % 24}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex justify-center items-center py-12"
              >
                {isFetchingNextPage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more products...</span>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{' '}
            <a 
              href="https://world.openfoodfacts.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Food Facts
            </a>
            . Open Database License.
          </p>
        </div>
      </footer>
    </div>
  );
}
