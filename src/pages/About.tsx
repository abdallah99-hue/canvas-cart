import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Award, Globe, Palette, Sparkles } from 'lucide-react';

const teamMembers = [
  {
    name: 'Isabella Martinez',
    role: 'Founder & Curator',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Art historian with 15+ years of experience in gallery curation.',
  },
  {
    name: 'Alexander Chen',
    role: 'Head of Artist Relations',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Connecting talented artists with passionate collectors worldwide.',
  },
  {
    name: 'Emma Thompson',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Shaping the visual identity and customer experience of ArtCanvas.',
  },
  {
    name: 'Michael Roberts',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Ensuring every artwork arrives safely and beautifully to your door.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion for Art',
    description: 'We believe art has the power to transform spaces and inspire emotions.',
  },
  {
    icon: Award,
    title: 'Quality & Authenticity',
    description: 'Every piece is handpicked and verified for exceptional craftsmanship.',
  },
  {
    icon: Users,
    title: 'Artist Support',
    description: 'We empower artists by providing a platform to share their vision globally.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting art lovers with talented artists from around the world.',
  },
];

const stats = [
  { value: '500+', label: 'Artworks' },
  { value: '50+', label: 'Artists' },
  { value: '10k+', label: 'Happy Clients' },
  { value: '25+', label: 'Countries' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&q=80')] bg-cover bg-center" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              Our Story
            </span>
            <h1 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
              Bringing Art to Life
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
              ArtCanvas was born from a simple belief: that exceptional art should be accessible to everyone. 
              We curate and deliver museum-quality paintings from talented artists around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl font-bold text-secondary lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-secondary">
                <Palette className="h-5 w-5" />
                <span className="font-medium">Our Mission</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Democratizing Art for Everyone
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                We believe that beautiful art shouldn't be reserved for galleries and museums. 
                Our mission is to make exceptional, original paintings accessible to art lovers 
                everywhere, while supporting talented artists in sharing their vision with the world.
              </p>
              <p className="mt-4 text-muted-foreground">
                Every piece in our collection is carefully curated for quality, authenticity, and 
                artistic merit. We work directly with artists to ensure fair compensation and 
                provide collectors with genuine, gallery-quality works.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:shadow-glow"
              >
                Explore Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80"
                  alt="Art gallery"
                  className="h-48 w-full rounded-2xl object-cover shadow-card lg:h-64"
                />
                <img
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80"
                  alt="Abstract art"
                  className="mt-8 h-48 w-full rounded-2xl object-cover shadow-card lg:h-64"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-card lg:-bottom-8 lg:-left-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-success/20 p-2">
                    <Award className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">100% Authentic</p>
                    <p className="text-sm text-muted-foreground">Verified Artworks</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
                  <value.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-muted-foreground">
              Passionate people bringing art to your home
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm font-medium text-secondary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Your Art Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Browse our curated collection and find the perfect piece to transform your space.
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
      </section>
    </div>
  );
}
