'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({ title, value, change, icon: Icon, iconColor = 'text-neon-blue', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error" />
              )}
              <span className={`text-sm ${change.type === 'increase' ? 'text-success' : 'text-error'}`}>
                {change.value}
              </span>
              <span className="text-sm text-foreground-muted">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-glass-hover ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

