import { Link } from 'react-router-dom';
import { 
  Palette, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Send
} from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  shop: [
    { label: 'All Artworks', href: '/products' },
    { label: 'Landscapes', href: '/products?category=landscape' },
    { label: 'Abstract', href: '/products?category=abstract' },
    { label: 'Portraits', href: '/products?category=portrait' },
    { label: 'New Arrivals', href: '/products' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Artists', href: '/about' },
    { label: 'Contact', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  support: [
    { label: 'FAQ', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Track Order', href: '#' },
    { label: 'Size Guide', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold">
              <Palette className="h-7 w-7 text-accent" />
              <span>MyArtSpace</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
              Discover extraordinary art pieces from talented artists around the world. 
              Transform your space with authentic, handcrafted paintings.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a 
                href="mailto:hello@artcanvas.com" 
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                hello@artcanvas.com
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                123 Art Street, Creative City
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-lg font-semibold">Shop</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-lg font-semibold">Company</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg font-semibold">Newsletter</h4>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Subscribe to get updates on new artworks and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-sm font-medium">Follow Us</p>
              <div className="mt-3 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="rounded-full border border-primary-foreground/20 p-2 text-primary-foreground/70 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-primary-foreground/50 md:flex-row md:text-left">
            <p>© 2024 MyArtSpace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-accent">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-accent">Terms of Service</a>
              <a href="#" className="transition-colors hover:text-accent">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
