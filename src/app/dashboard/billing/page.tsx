'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Server,
  FileText,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServerStore } from '@/stores/server-store';

const billingHistory = [
  {
    id: 'INV-001',
    date: '2024-01-01',
    amount: 1050,
    status: 'paid',
    items: [
      { name: 'Production GPU Node', cost: 450 },
      { name: 'Dev CPU Server', cost: 120 },
      { name: 'ML Training Node', cost: 890 / 2 },
      { name: 'API Backend', cost: 65 },
    ],
  },
  {
    id: 'INV-002',
    date: '2023-12-01',
    amount: 890,
    status: 'paid',
    items: [
      { name: 'Production GPU Node', cost: 450 },
      { name: 'Dev CPU Server', cost: 120 },
      { name: 'ML Training Node', cost: 320 },
    ],
  },
  {
    id: 'INV-003',
    date: '2023-11-01',
    amount: 720,
    status: 'paid',
    items: [
      { name: 'Production GPU Node', cost: 450 },
      { name: 'Dev CPU Server', cost: 120 },
      { name: 'Staging Server', cost: 150 },
    ],
  },
];

const monthlySpending = [
  { month: 'Jul', amount: 420 },
  { month: 'Aug', amount: 580 },
  { month: 'Sep', amount: 650 },
  { month: 'Oct', amount: 720 },
  { month: 'Nov', amount: 890 },
  { month: 'Dec', amount: 1050 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3">
        <p className="text-foreground font-medium">{label}</p>
        <p className="text-neon-blue text-lg font-bold">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function BillingPage() {
  const { servers } = useServerStore();
  const [selectedInvoice, setSelectedInvoice] = useState<typeof billingHistory[0] | null>(null);

  const totalMonthlySpend = servers.reduce((acc, s) => acc + s.monthlyCost, 0);
  const activeServers = servers.filter(s => s.status === 'running').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-foreground-muted">Manage your billing and invoices</p>
        </div>
        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-neon-blue/20">
                <DollarSign className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Current Month</p>
                <p className="text-2xl font-bold text-foreground">${totalMonthlySpend}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-neon-purple/20">
                <TrendingUp className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">vs Last Month</p>
                <p className="text-2xl font-bold text-success">+18%</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-neon-green/20">
                <Server className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Active Resources</p>
                <p className="text-2xl font-bold text-foreground">{activeServers}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-neon-orange/20">
                <Calendar className="w-6 h-6 text-neon-orange" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Next Bill Date</p>
                <p className="text-2xl font-bold text-foreground">Feb 1</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Current Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-glass-border">
            <h3 className="text-lg font-semibold text-foreground">Current Resources</h3>
          </div>
          <div className="divide-y divide-glass-border">
            {servers.map((server) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-4 hover:bg-glass-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${server.type === 'gpu' ? 'bg-neon-purple/20' : 'bg-neon-blue/20'}`}>
                    <Server className={`w-5 h-5 ${server.type === 'gpu' ? 'text-neon-purple' : 'text-neon-blue'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{server.name}</p>
                    <p className="text-sm text-foreground-muted">
                      {server.cpuCores} CPU • {server.ram}GB RAM • {server.provider}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${server.monthlyCost}/mo</p>
                  <Badge variant={server.status === 'running' ? 'success' : 'warning'}>
                    {server.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-glass-border flex items-center justify-between">
            <span className="font-semibold text-foreground">Total Monthly</span>
            <span className="text-xl font-bold text-neon-blue">${totalMonthlySpend}/mo</span>
          </div>
        </Card>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-glass-border">
            <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
          </div>
          <div className="divide-y divide-glass-border">
            {billingHistory.map((invoice) => (
              <button
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className="w-full flex items-center justify-between p-4 hover:bg-glass-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-glass-hover">
                    <FileText className="w-5 h-5 text-foreground-muted" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{invoice.id}</p>
                    <p className="text-sm text-foreground-muted">
                      {new Date(invoice.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${invoice.amount}</p>
                    <Badge variant="success">{invoice.status}</Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground-muted" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selectedInvoice.id}</h2>
                <p className="text-foreground-muted">
                  {new Date(selectedInvoice.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <Badge variant="success" size="md">{selectedInvoice.status}</Badge>
            </div>

            <div className="space-y-3 mb-6">
              {selectedInvoice.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-glass-border">
                  <span className="text-foreground">{item.name}</span>
                  <span className="font-mono text-foreground">${item.cost}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-4 border-t border-glass-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-neon-blue">${selectedInvoice.amount}</span>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="secondary" className="flex-1" leftIcon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
              <Button className="flex-1" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

