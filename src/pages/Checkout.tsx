import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Order, CustomerInfo } from '@/types';
import { z } from 'zod';

// Validation schema
const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20),
  address: z.string().min(5, 'Please enter a valid address').max(200),
  city: z.string().min(2, 'Please enter a valid city').max(100),
  state: z.string().min(2, 'Please enter a valid state').max(100),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code').max(10),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useLocalStorage<Order[]>('art-gallery-orders', []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Add some artworks before checking out.</p>
          <Link
            to="/products"
            className="mt-4 inline-flex items-center gap-2 text-secondary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Gallery
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      customerSchema.parse(formData);

      // Generate unique order ID
      const orderId = `ART-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Create order object
      const newOrder: Order = {
        id: orderId,
        items: items,
        customer: formData,
        total: subtotal,
        shipping: shipping,
        grandTotal: total,
        paymentMethod: 'COD',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save order to localStorage
      setOrders([...orders, newOrder]);

      // Clear cart
      clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Checkout
          </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                  Contact Information
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.name ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.email ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.phone ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                  Shipping Address
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="mb-1 block text-sm font-medium text-foreground">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.address ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="123 Main Street, Apt 4B"
                    />
                    {errors.address && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1 block text-sm font-medium text-foreground">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.city ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="state" className="mb-1 block text-sm font-medium text-foreground">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.state ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-foreground">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 ${
                        errors.zipCode ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                  Payment Method
                </h2>
                <div className="rounded-lg border-2 border-success bg-success/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-success p-2">
                      <CreditCard className="h-5 w-5 text-success-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Cash on Delivery (COD)</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when your artwork arrives at your doorstep
                      </p>
                    </div>
                    <Check className="ml-auto h-6 w-6 text-success" />
                  </div>
                </div>
              </div>

              {/* Submit Button - Mobile */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-4 font-semibold text-accent-foreground transition-all hover:shadow-glow disabled:opacity-50 lg:hidden"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Order Summary</h2>

              {/* Items */}
              <div className="mt-4 space-y-4 border-b border-border pb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    Shipping
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-lg bg-accent py-4 font-semibold text-accent-foreground transition-all hover:shadow-glow disabled:opacity-50 lg:flex"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>

              {/* COD Notice */}
              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center text-sm">
                <p className="font-medium text-foreground">Payment method: Cash On Delivery (COD)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
