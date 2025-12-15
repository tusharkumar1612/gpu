'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-green/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[150px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-neon-orange" />
            <span className="text-sm text-foreground-muted">Limited Time: First 100GB free</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Deploy Your
            <br />
            <span className="gradient-text">Decentralized Infrastructure?</span>
          </h2>

          <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-10">
            Join the future of cloud computing. No credit card required. 
            Pay only for what you use with crypto.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Building Free
              </Button>
            </Link>
            <Link href="#docs">
              <Button variant="secondary" size="lg">
                Read Documentation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

