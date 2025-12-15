'use client';

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Gpu, 
  Wallet, 
  Cloud, 
  Shield, 
  Zap, 
  Globe, 
  Lock 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Cpu,
    title: 'Decentralized Compute',
    description: 'Access a global network of compute resources without single points of failure.',
    color: 'text-neon-blue',
    gradient: 'from-neon-blue/20 to-transparent',
  },
  {
    icon: Gpu,
    title: 'GPU & CPU Nodes',
    description: 'Deploy high-performance GPU clusters for ML/AI or CPU instances for general workloads.',
    color: 'text-neon-purple',
    gradient: 'from-neon-purple/20 to-transparent',
  },
  {
    icon: Wallet,
    title: 'Web3 Payments',
    description: 'Pay with ETH, USDC, or other tokens. Smart contract powered billing with full transparency.',
    color: 'text-neon-green',
    gradient: 'from-neon-green/20 to-transparent',
  },
  {
    icon: Cloud,
    title: 'Multi-Cloud Providers',
    description: 'Choose from Fluence, Akash, Filecoin Compute, or connect your own nodes.',
    color: 'text-neon-orange',
    gradient: 'from-neon-orange/20 to-transparent',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, secure enclaves, and cryptographic verification of compute.',
    color: 'text-neon-pink',
    gradient: 'from-neon-pink/20 to-transparent',
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Spin up servers in seconds. Auto-scaling based on demand with no manual intervention.',
    color: 'text-neon-blue',
    gradient: 'from-neon-blue/20 to-transparent',
  },
  {
    icon: Globe,
    title: 'Global Edge Network',
    description: 'Deploy workloads closer to users with edge locations across 50+ regions worldwide.',
    color: 'text-neon-purple',
    gradient: 'from-neon-purple/20 to-transparent',
  },
  {
    icon: Lock,
    title: 'Zero Trust Architecture',
    description: 'Every request is verified. Your data never touches centralized servers.',
    color: 'text-neon-green',
    gradient: 'from-neon-green/20 to-transparent',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Why Choose NeuralCloud?</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Built for the next generation of decentralized applications and infrastructure
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card
                variant="interactive"
                className="h-full group"
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

