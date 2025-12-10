import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData as Product[]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Handle URL search params for category
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setFilteredProducts(
        (productsData as Product[]).filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        )
      );
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Art Gallery
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our curated collection of exceptional artworks
          </p>
        </motion.div>

        {/* Filters */}
        <ProductFilters
          products={productsData as Product[]}
          onFilter={handleFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'artwork' : 'artworks'}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-lg font-medium text-muted-foreground">
              No artworks found matching your criteria.
            </p>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
