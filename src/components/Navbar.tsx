import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User, 
  Palette,
  ChevronDown 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import categories from '@/data/categories.json';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Gallery' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-display font-bold text-foreground transition-colors hover:text-secondary"
          >
            <Palette className="h-7 w-7 text-accent" />
            <span className="hidden sm:inline">ArtCanvas</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative font-medium transition-colors hover:text-secondary",
                  location.pathname === link.href 
                    ? "text-secondary" 
                    : "text-foreground/80"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
                className="flex items-center gap-1 font-medium text-foreground/80 transition-colors hover:text-secondary"
              >
                Categories
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isCategoryOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-card"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-secondary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Sign In - Desktop */}
            <button className="hidden items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-secondary lg:flex">
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-muted lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <div className="space-y-4 py-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search artworks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none"
                    />
                  </div>
                </form>

                {/* Mobile Nav Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2 font-medium transition-colors",
                        location.pathname === link.href
                          ? "bg-secondary/10 text-secondary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Categories */}
                <div className="border-t border-border pt-4">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Categories
                  </p>
                  <div className="mt-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-secondary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Sign In */}
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-secondary">
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
