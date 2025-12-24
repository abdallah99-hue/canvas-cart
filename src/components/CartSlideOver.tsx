import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSlideOver({ isOpen, onClose }: CartSlideOverProps) {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
          />

          {/* Slide Over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                  <h2 className="font-display text-xl font-semibold">Your Cart</h2>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
                    <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground/70">
                      Add some beautiful artworks to get started
                    </p>
                    <Link
                      to="/products"
                      onClick={onClose}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:shadow-glow"
                    >
                      Browse Gallery
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 rounded-lg border border-border bg-muted/30 p-3"
                      >
                        {/* Image */}
                        <Link 
                          to={`/product/${item.product.id}`} 
                          onClick={onClose}
                          className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              to={`/product/${item.product.id}`}
                              onClick={onClose}
                              className="font-display font-semibold text-foreground transition-colors hover:text-secondary"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">by {item.product.artist}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="rounded-md border border-border p-1 text-foreground transition-colors hover:bg-muted"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="rounded-md border border-border p-1 text-foreground transition-colors hover:bg-muted"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-semibold text-foreground">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="self-start rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Order Summary */}
              {items.length > 0 && (
                <div className="border-t border-border bg-muted/30 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over {formatPrice(500)}
                      </p>
                    )}
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-accent-foreground transition-all hover:shadow-glow"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
