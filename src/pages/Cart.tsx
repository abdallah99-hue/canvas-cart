import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Plus, Minus, X, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="mx-auto mb-6 h-24 w-24 text-muted-foreground/30" />
          <h1 className="font-display text-3xl font-bold text-foreground">Your Cart is Empty</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Looks like you haven't added any artworks yet.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground transition-all hover:shadow-glow"
          >
            Explore Gallery
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 md:gap-6 md:p-6"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg md:h-36 md:w-32"
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
                        className="font-display text-lg font-semibold text-foreground transition-colors hover:text-secondary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">by {item.product.artist}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.product.specs.size}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-2 text-foreground transition-colors hover:bg-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-2 text-foreground transition-colors hover:bg-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.product.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="self-start rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 rounded-xl border border-border bg-card p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground">Order Summary</h2>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add {formatCurrency(500 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-4 font-semibold text-accent-foreground transition-all hover:shadow-glow"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/products"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 font-medium text-foreground transition-colors hover:bg-muted"
              >
                Continue Shopping
              </Link>

              {/* Payment Info */}
              <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Payment Method: Cash on Delivery</p>
                <p className="mt-1">Pay when your artwork arrives</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
