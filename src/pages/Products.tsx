import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Product, Category } from '@/types';
import { Loader2 } from 'lucide-react';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data');

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        // Map _id to id for products
        const mappedProducts = productsData.map((p: any) => ({
            ...p,
            id: p._id || p.id // Use _id if available, fallback to id
        }));

        setProducts(mappedProducts);
        setCategories(categoriesData);
        // Initial set, but ProductFilters will override via onFilter
        setFilteredProducts(mappedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync search query from URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleFilter = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

  if (loading) {
      return (
          <div className="flex min-h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  if (error) {
      return (
          <div className="flex min-h-screen items-center justify-center text-red-500">
              {error}
          </div>
      )
  }

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
          products={products}
          categories={categories}
          initialCategory={searchParams.get('category') || ''}
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
