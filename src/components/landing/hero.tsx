'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingNodes = [
  { x: '10%', y: '20%', delay: 0 },
  { x: '85%', y: '15%', delay: 0.5 },
  { x: '75%', y: '70%', delay: 1 },
  { x: '15%', y: '75%', delay: 1.5 },
  { x: '50%', y: '85%', delay: 2 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />

      {/* Floating Nodes */}
      {floatingNodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 4,
            delay: node.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ left: node.x, top: node.y }}
          className="absolute w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_20px_rgba(0,212,255,0.5)]"
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-foreground-muted">Network Status: Operational</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">Decentralized Compute</span>
            <br />
            <span className="gradient-text text-glow-blue">for the Open Internet</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-foreground-muted max-w-3xl mx-auto mb-10">
            Deploy high-performance CPU and GPU servers on decentralized infrastructure. 
            Scale infinitely, pay with crypto, own your compute.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                Launch App
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: 'Active Nodes', value: '12,847', icon: Globe },
              { label: 'Compute Hours', value: '2.4M+', icon: Cpu },
              { label: 'Uptime', value: '99.97%', icon: Zap },
              { label: 'Providers', value: '156', icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-neon-blue" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Architecture Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {/* Node visualization */}
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="aspect-square rounded-xl bg-gradient-to-br from-glass-bg to-transparent border border-glass-border flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5" />
                  <Cpu className={`w-6 h-6 ${i % 3 === 0 ? 'text-neon-blue' : i % 3 === 1 ? 'text-neon-purple' : 'text-neon-green'}`} />
                  {/* Connection lines */}
                  {i < 6 && (
                    <div className="absolute bottom-0 left-1/2 w-px h-4 bg-gradient-to-b from-glass-border to-transparent" />
                  )}
                  {i % 3 !== 2 && (
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-gradient-to-r from-glass-border to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-foreground-muted mt-6">
              Distributed Network Architecture
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

