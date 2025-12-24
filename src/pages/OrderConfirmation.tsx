import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Home, ArrowRight, Download, Share2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [orders] = useLocalStorage<Order[]>('art-gallery-orders', []);
  const { formatPrice } = useCurrency();
  
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Order Not Found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find this order.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-secondary hover:underline"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { icon: CheckCircle, label: 'Order Placed', status: 'completed' },
    { icon: Package, label: 'Processing', status: 'current' },
    { icon: Truck, label: 'Shipped', status: 'pending' },
    { icon: Home, label: 'Delivered', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          {/* Success Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/20"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Thank you for your purchase. Your artwork is on its way!
            </p>
          </div>

          {/* Order Details Card */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
            {/* Order ID */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-lg font-semibold text-foreground">{order.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <Download className="h-4 w-4" />
                  Invoice
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Order Progress */}
            <div className="mb-8">
              <h3 className="mb-4 font-display font-semibold text-foreground">Order Status</h3>
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.label} className="flex flex-1 flex-col items-center">
                    <div className="relative flex w-full items-center">
                      {index > 0 && (
                        <div
                          className={`absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 ${
                            step.status === 'completed'
                              ? 'bg-success'
                              : step.status === 'current'
                              ? 'bg-gradient-to-r from-success to-muted'
                              : 'bg-muted'
                          }`}
                          style={{ width: 'calc(50% - 16px)', left: 'calc(-50% + 16px)' }}
                        />
                      )}
                      <div
                        className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                          step.status === 'completed'
                            ? 'bg-success text-success-foreground'
                            : step.status === 'current'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute right-0 top-1/2 h-1 -translate-y-1/2 ${
                            step.status === 'completed' ? 'bg-success' : 'bg-muted'
                          }`}
                          style={{ width: 'calc(50% - 16px)', right: 'calc(-50% + 16px)' }}
                        />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-center text-xs font-medium ${
                        step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Banner */}
            <div className="mb-8 rounded-xl bg-accent/10 p-4 text-center">
              <p className="text-lg font-semibold text-accent">
                Payment Method: Cash On Delivery (COD)
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                Please have {formatPrice(order.grandTotal)} ready when your order arrives
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="mb-4 font-display font-semibold text-foreground">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 rounded-lg bg-muted/30 p-3">
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">by {item.product.artist}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
              {/* Shipping Address */}
              <div>
                <h3 className="mb-2 font-display font-semibold text-foreground">Shipping Address</h3>
                <div className="text-muted-foreground">
                  <p className="text-foreground">{order.customer.name}</p>
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </p>
                  <p className="mt-2">{order.customer.phone}</p>
                  <p>{order.customer.email}</p>
                </div>
              </div>

              {/* Order Totals */}
              <div>
                <h3 className="mb-2 font-display font-semibold text-foreground">Order Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        formatPrice(order.shipping)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total (COD)</span>
                      <span>{formatPrice(order.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground transition-all hover:shadow-glow"
            >
              Continue Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-4 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Home className="h-5 w-5" />
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
