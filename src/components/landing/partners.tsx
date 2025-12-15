'use client';

import { motion } from 'framer-motion';

const partners = [
  { name: 'Ethereum', logo: 'ETH' },
  { name: 'Polygon', logo: 'MATIC' },
  { name: 'Arbitrum', logo: 'ARB' },
  { name: 'Optimism', logo: 'OP' },
  { name: 'Filecoin', logo: 'FIL' },
  { name: 'Akash', logo: 'AKT' },
];

export function Partners() {
  return (
    <section className="py-16 relative bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-foreground-muted mb-8"
        >
          Integrated with leading Web3 protocols
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
            >
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center font-mono text-sm font-bold text-neon-blue">
                {partner.logo}
              </div>
              <span className="font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

