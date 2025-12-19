'use client';

import { motion } from 'framer-motion';
import { Wallet, Settings, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Link your MetaMask, WalletConnect, or any Web3 wallet to get started.',
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/20',
  },
  {
    icon: Settings,
    title: 'Configure Server',
    description: 'Choose CPU/GPU specs, operating system, storage, and bandwidth.',
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/20',
  },
  {
    icon: Rocket,
    title: 'Deploy & Pay',
    description: 'Select a provider, review costs, and deploy with a single transaction.',
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/20',
  },
  {
    icon: BarChart3,
    title: 'Monitor & Scale',
    description: 'Track performance, manage resources, and scale up or down as needed.',
    color: 'text-neon-orange',
    bgColor: 'bg-neon-orange/20',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Get from zero to deployed in under 5 minutes
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green transform -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-0 w-8 h-8 rounded-full bg-background-secondary border-2 border-neon-blue flex items-center justify-center text-sm font-bold text-neon-blue z-10">
                  {i + 1}
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-6 pt-8 h-full">
                  <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


