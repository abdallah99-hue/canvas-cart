import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Loader2
} from 'lucide-react';
import { Product, Review } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { cn } from '@/lib/utils';

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Michael Thompson',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely stunning piece! The colors are even more vibrant in person. Very satisfied with my purchase.',
    verified: true,
  },
  {
    id: '2',
    author: 'Sarah Williams',
    rating: 4,
    date: '2024-01-10',
    comment: 'Beautiful artwork that fits perfectly in my living room. The framing quality is excellent.',
    verified: true,
  },
  {
    id: '3',
    author: 'David Chen',
    rating: 5,
    date: '2024-01-05',
    comment: 'The craftsmanship is outstanding. This piece has become the centerpiece of my art collection.',
    verified: false,
  },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const { formatPrice } = useCurrency();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch product detail
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
            if (res.status === 404) {
                setProduct(null);
                setLoading(false);
                return;
            }
            throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        const mappedProduct = { ...data, id: data._id || data.id };
        setProduct(mappedProduct);
        setSelectedImageIndex(0); // Reset image index on product change

        // Fetch related products (fetch all for now)
        const allRes = await fetch('/api/products');
        if (allRes.ok) {
            const allData = await allRes.json();
            const mappedAll = allData.map((p: any) => ({ ...p, id: p._id || p.id }));
            const related = mappedAll
                .filter((p: Product) => p.category === mappedProduct.category && p.id !== mappedProduct.id)
                .slice(0, 4);
            setRelatedProducts(related);
        }

      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Product Not Found</h1>
          <p className="mt-2 text-muted-foreground">The artwork you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-2 text-secondary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const inCart = getItemQuantity(product.id) > 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 600);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-hero pt-8 pb-16 lg:pt-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/products" className="hover:text-foreground">
            Gallery
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/products?category=${product.category}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-[4/3] w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={product.images[selectedImageIndex]}
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-secondary"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-secondary"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-secondary ring-2 ring-secondary/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="mb-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <div className="mb-4 flex items-center gap-4">
                <p className="text-xl text-secondary">{product.artist}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="mb-8 rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : (
                  <span className="font-medium text-destructive">Out of Stock</span>
                )}
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Medium</span>
                  <span className="font-medium text-foreground">{product.specs.medium}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium text-foreground">{product.specs.size}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Frame</span>
                  <span className="font-medium text-foreground">{product.specs.frame}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-medium text-foreground">{product.specs.year}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-muted-foreground hover:text-foreground"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all",
                    isAdding
                      ? "bg-secondary/90 text-secondary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  )}
                >
                  {isAdding ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {isAdding ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-secondary/10 p-3 text-secondary">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On all orders over $500</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-secondary/10 p-3 text-secondary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure transactions</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-secondary/10 p-3 text-secondary">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-foreground">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-border pt-16">
          <h2 className="mb-8 font-display text-2xl font-bold text-foreground">Customer Reviews</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {mockReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="mb-4 text-muted-foreground">"{review.comment}"</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{review.author}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Check className="h-3 w-3" />
                      Verified Buyer
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-border pt-16">
            <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
