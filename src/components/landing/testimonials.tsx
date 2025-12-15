'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "NeuralCloud has transformed how we deploy AI models. The decentralized GPUs are incredibly cost-effective compared to traditional cloud providers.",
    author: "Sarah Chen",
    role: "CTO, DeepMind Labs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 5,
  },
  {
    quote: "Finally, infrastructure that aligns with Web3 values. Paying with crypto and having full transparency on where my compute runs is game-changing.",
    author: "Marcus Rodriguez",
    role: "Founder, ChainML",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    rating: 5,
  },
  {
    quote: "The multi-cloud provider approach gives us resilience we couldn't achieve before. No more single points of failure in our ML pipeline.",
    author: "Emily Watson",
    role: "Lead Engineer, DataFlow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Trusted by Innovators</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Join thousands of teams building on decentralized infrastructure
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-neon-blue/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-neon-orange text-neon-orange" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground-muted mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full bg-glass-bg"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-foreground-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

