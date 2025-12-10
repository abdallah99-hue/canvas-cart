import { useState } from 'react';
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
} from 'lucide-react';
import productsData from '@/data/products.json';
import { Product, Review } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
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
  
  const product = (productsData as Product[]).find((p) => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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

  const relatedProducts = (productsData as Product[])
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
    <div className="min-h-screen bg-gradient-hero py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="transition-colors hover:text-secondary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="transition-colors hover:text-secondary">
                Gallery
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card shadow-card">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-card"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-card"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.originalPrice && (
                  <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
                    Sale
                  </span>
                )}
                {product.featured && (
                  <span className="rounded-full bg-success px-3 py-1 text-sm font-semibold text-success-foreground">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-secondary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & SKU */}
            <div className="flex items-center justify-between">
              <Link
                to={`/products?category=${product.category.toLowerCase()}`}
                className="text-sm font-medium uppercase tracking-wider text-secondary hover:underline"
              >
                {product.category}
              </Link>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              {product.name}
            </h1>

            {/* Artist */}
            <p className="text-lg text-muted-foreground">by {product.artist}</p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-sm font-semibold text-accent">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground/80">{product.description}</p>

            {/* Specifications */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-display font-semibold text-foreground">Specifications</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Medium</dt>
                  <dd className="font-medium text-foreground">{product.specs.medium}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium text-foreground">{product.specs.size}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Frame</dt>
                  <dd className="font-medium text-foreground">{product.specs.frame}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Year</dt>
                  <dd className="font-medium text-foreground">{product.specs.year}</dd>
                </div>
              </dl>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all",
                  inCart
                    ? "bg-success text-success-foreground"
                    : "bg-accent text-accent-foreground hover:shadow-glow"
                )}
              >
                <motion.div
                  animate={isAdding ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {inCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                </motion.div>
                <span>{inCart ? 'Added to Cart' : 'Add to Cart'}</span>
              </motion.button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "rounded-lg border p-3 transition-all",
                  isWishlisted
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-foreground hover:border-accent hover:text-accent"
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-col items-center text-center">
                <Truck className="mb-2 h-6 w-6 text-secondary" />
                <span className="text-xs font-medium text-foreground">Free Shipping</span>
                <span className="text-xs text-muted-foreground">Orders $500+</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="mb-2 h-6 w-6 text-secondary" />
                <span className="text-xs font-medium text-foreground">Authentic</span>
                <span className="text-xs text-muted-foreground">Certificate Included</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="mb-2 h-6 w-6 text-secondary" />
                <span className="text-xs font-medium text-foreground">Easy Returns</span>
                <span className="text-xs text-muted-foreground">30 Day Policy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-bold text-foreground">Customer Reviews</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <p className="mb-4 text-foreground/80">{review.comment}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{review.author}</span>
                  <span className="text-muted-foreground">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 font-display text-2xl font-bold text-foreground">You May Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
