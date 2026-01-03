import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Award, Quote } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Product, Category } from '@/types';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    content: 'The quality of artwork from ArtCanvas is exceptional. My clients are always amazed by the pieces I source from here.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Art Collector',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    content: 'Finally, a curated gallery that offers authentic, beautiful paintings at fair prices. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Homeowner',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    content: 'The "Sunset Over Mountains" piece completely transformed my living room. Outstanding quality and service.',
    rating: 5,
  },
];

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $500',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Cash on Delivery',
  },
  {
    icon: Award,
    title: 'Authentic Art',
    description: 'Certified originals',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [typedCategories, setTypedCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (prodRes.ok) {
          const prods = await prodRes.json();
          const mappedProds = prods.map((p: any) => ({ ...p, id: p._id || p.id }));
          setFeaturedProducts(mappedProds.filter((p: Product) => p.featured).slice(0, 4));
        }
        if (catRes.ok) {
          const cats = await catRes.json();
          setTypedCategories(cats);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 lg:py-24">
        {/* Decorative Elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
                Curated Collection 2024
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Discover Art That{' '}
                <span className="text-secondary">Inspires</span> Your Soul
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Explore our exclusive collection of handcrafted paintings from talented artists worldwide. 
                Transform your space with authentic, museum-quality art.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-cta inline-flex items-center gap-2"
                >
                  Explore Gallery
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground/20 px-6 py-3 font-semibold text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  Our Story
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <p className="font-display text-3xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Artworks</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Artists</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-foreground">10k+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="overflow-hidden rounded-2xl shadow-card"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
                      alt="Landscape painting"
                      className="h-48 w-full object-cover lg:h-64"
                    />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="overflow-hidden rounded-2xl shadow-card"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80"
                      alt="Abstract art"
                      className="h-32 w-full object-cover lg:h-44"
                    />
                  </motion.div>
                </div>
                <div className="mt-8 space-y-4">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="overflow-hidden rounded-2xl shadow-card"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80"
                      alt="Seascape painting"
                      className="h-32 w-full object-cover lg:h-44"
                    />
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className="overflow-hidden rounded-2xl shadow-card"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&q=80"
                      alt="Portrait art"
                      className="h-48 w-full object-cover lg:h-64"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-xl bg-card p-4 shadow-card lg:-left-8"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success/20 p-2">
                    <Award className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Certified</p>
                    <p className="text-xs text-muted-foreground">Original Artworks</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-b border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center gap-4 text-center md:text-left"
              >
                <div className="rounded-full bg-secondary/10 p-3">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore our diverse collection of artistic styles
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {typedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <h3 className="font-display text-lg font-semibold text-background">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Featured Artworks
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked masterpieces from our collection
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-semibold text-secondary transition-colors hover:text-secondary/80"
            >
              View All
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&q=80')] bg-cover bg-center" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
              Limited Time Offer
            </span>
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              Get 20% Off Your First Order
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join our newsletter and receive an exclusive discount on your first purchase. 
              Don't miss out on owning your dream artwork.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground transition-all hover:shadow-glow"
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trusted by art lovers and collectors worldwide
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <Quote className="mb-4 h-8 w-8 text-accent/50" />
                <p className="text-foreground/90">{testimonial.content}</p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
