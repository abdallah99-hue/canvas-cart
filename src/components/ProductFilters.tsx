import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import categories from '@/data/categories.json';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductFiltersProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

export function ProductFilters({
  products,
  onFilter,
  searchQuery,
  setSearchQuery,
}: ProductFiltersProps) {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const priceRanges = useMemo(() => [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: `Under ${formatPrice(500)}`, min: 0, max: 500 },
    { label: `${formatPrice(500)} - ${formatPrice(1000)}`, min: 500, max: 1000 },
    { label: `${formatPrice(1000)} - ${formatPrice(2000)}`, min: 1000, max: 2000 },
    { label: `Over ${formatPrice(2000)}`, min: 2000, max: Infinity },
  ], [formatPrice]);

  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // When currency changes, the selected range object might mismatch the new priceRanges array objects
  // We need to keep track of the selected range index or key instead of the object itself
  // Or simpler: update selectedPriceRange when priceRanges changes if it's not the default
  useEffect(() => {
    // Check if the current selected range label matches any in the new priceRanges
    // Actually, comparing by min/max is safer
    const currentMin = selectedPriceRange.min;
    const currentMax = selectedPriceRange.max;
    const matchingRange = priceRanges.find(r => r.min === currentMin && r.max === currentMax);
    if (matchingRange && matchingRange !== selectedPriceRange) {
      setSelectedPriceRange(matchingRange);
    }
  }, [priceRanges, selectedPriceRange]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.artist.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    );

    // Sorting
    switch (sortBy.value) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.specs.year) - parseInt(a.specs.year));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    onFilter(filtered);
  }, [products, searchQuery, selectedCategory, selectedPriceRange, sortBy, onFilter]);

  const activeFiltersCount = [
    selectedCategory,
    selectedPriceRange.min !== 0 || selectedPriceRange.max !== Infinity,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange(priceRanges[0]);
    setSearchQuery('');
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search artworks, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center gap-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors",
              isFiltersOpen || activeFiltersCount > 0
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border bg-card text-foreground hover:border-secondary"
            )}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy.value}
              onChange={(e) =>
                setSortBy(sortOptions.find((o) => o.value === e.target.value) || sortOptions[0])
              }
              className="appearance-none rounded-lg border border-border bg-card px-4 py-3 pr-10 font-medium text-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Categories */}
                <div>
                  <h3 className="mb-3 font-display font-semibold text-foreground">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        !selectedCategory
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-foreground hover:bg-secondary/20"
                      )}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          selectedCategory === cat.id
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-foreground hover:bg-secondary/20"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="mb-3 font-display font-semibold text-foreground">Price Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(range)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          selectedPriceRange === range
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-foreground hover:bg-secondary/20"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-secondary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
