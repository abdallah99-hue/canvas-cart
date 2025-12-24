import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inCart = getItemQuantity(product.id) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="glass-card-hover overflow-hidden rounded-xl">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.originalPrice && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Sale
                </span>
              )}
              {product.featured && (
                <span className="rounded-full bg-success px-3 py-1 text-xs font-semibold text-success-foreground">
                  Featured
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-card hover:scale-110"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-colors",
                  isWishlisted ? "fill-accent text-accent" : "text-foreground"
                )} 
              />
            </button>

            {/* Quick Add Button */}
            <motion.button
              onClick={handleAddToCart}
              className={cn(
                "absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all",
                "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                inCart 
                  ? "bg-success text-success-foreground" 
                  : "bg-accent text-accent-foreground hover:shadow-glow"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isAdding ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.div>
              <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category & Artist */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-secondary">
              {product.name}
            </h3>

            {/* Artist */}
            <p className="mt-1 text-sm text-muted-foreground">by {product.artist}</p>

            {/* Price */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
