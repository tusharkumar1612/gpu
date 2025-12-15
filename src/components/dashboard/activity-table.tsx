'use client';

import { motion } from 'framer-motion';
import { Server, CreditCard, Rocket, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

type StatusType = 'success' | 'warning' | 'error' | 'info';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: StatusType;
  icon: LucideIcon;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'server_created',
    title: 'Server Created',
    description: 'Production GPU Node deployed successfully',
    timestamp: '2 minutes ago',
    status: 'success',
    icon: Server,
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Completed',
    description: '0.05 ETH charged for GPU-01',
    timestamp: '1 hour ago',
    status: 'success',
    icon: CreditCard,
  },
  {
    id: 3,
    type: 'deployment',
    title: 'Node Deployed',
    description: 'ML Training Node scaled to 4 GPUs',
    timestamp: '3 hours ago',
    status: 'success',
    icon: Rocket,
  },
  {
    id: 4,
    type: 'alert',
    title: 'High CPU Usage',
    description: 'Dev CPU Server reached 95% CPU',
    timestamp: '5 hours ago',
    status: 'warning',
    icon: AlertCircle,
  },
  {
    id: 5,
    type: 'server_created',
    title: 'Server Stopped',
    description: 'Test Server stopped by user',
    timestamp: '1 day ago',
    status: 'info',
    icon: Server,
  },
];

const statusColors: Record<StatusType, 'success' | 'warning' | 'error' | 'info'> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

export function ActivityTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-glass-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-glass-border">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-4 p-4 hover:bg-glass-hover transition-colors"
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${activity.status === 'success' ? 'bg-success/20 text-success' : ''}
              ${activity.status === 'warning' ? 'bg-warning/20 text-warning' : ''}
              ${activity.status === 'error' ? 'bg-error/20 text-error' : ''}
              ${activity.status === 'info' ? 'bg-info/20 text-info' : ''}
            `}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-foreground-muted truncate">{activity.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <Badge variant={statusColors[activity.status]}>
                {activity.status}
              </Badge>
              <p className="text-xs text-foreground-muted mt-1">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-4 border-t border-glass-border">
        <button className="text-sm text-neon-blue hover:underline w-full text-center">
          View all activity
        </button>
      </div>
    </motion.div>
  );
}

