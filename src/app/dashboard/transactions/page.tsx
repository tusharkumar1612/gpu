'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  ExternalLink,
  Copy,
  Check,
  Server,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlatformStore } from '@/stores/platform-store';
import { platformConfig } from '@/config/platform';
import { chainInfo } from '@/config/wagmi';

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'failed'>('all');
  
  const { 
    transactions, 
    servers,
    getTotalRevenue,
    getTotalServers,
    getActiveServers,
  } = usePlatformStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(platformConfig.PLATFORM_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const revenue = getTotalRevenue();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'simulated':
        return <Badge variant="purple" size="sm"><RefreshCw className="w-3 h-3 mr-1" />Simulated</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-64 bg-glass rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
          <p className="text-foreground-muted">Real-time blockchain payments and server deployments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Platform Wallet Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-neon-blue/30 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-neon-blue/20">
              <Wallet className="w-8 h-8 text-neon-blue" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Platform Receiving Wallet</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg text-foreground">
                  {platformConfig.PLATFORM_WALLET.slice(0, 10)}...{platformConfig.PLATFORM_WALLET.slice(-8)}
                </p>
                <button 
                  onClick={copyWalletAddress}
                  className="p-1.5 rounded-lg hover:bg-glass transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-foreground-muted" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-foreground-muted">Total Revenue</p>
              <p className="text-2xl font-bold text-neon-green">{revenue.eth.toFixed(4)} ETH</p>
              <p className="text-sm text-foreground-muted">≈ ${revenue.usd.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Total Transactions</p>
                  <p className="text-3xl font-bold text-foreground">{transactions.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-neon-blue/20">
                  <ArrowUpRight className="w-6 h-6 text-neon-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Total Servers</p>
                  <p className="text-3xl font-bold text-foreground">{getTotalServers()}</p>
                </div>
                <div className="p-3 rounded-xl bg-neon-purple/20">
                  <Server className="w-6 h-6 text-neon-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Active Servers</p>
                  <p className="text-3xl font-bold text-neon-green">{getActiveServers()}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/20">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Avg. Transaction</p>
                  <p className="text-3xl font-bold text-foreground">
                    {transactions.length > 0 
                      ? (revenue.eth / transactions.length).toFixed(4)
                      : '0.0000'
                    } ETH
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-warning/20">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-neon-green" />
                Incoming Payments
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-foreground-muted" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="bg-glass border border-glass-border rounded-lg px-3 py-1.5 text-sm text-foreground"
                >
                  <option value="all">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-muted">No transactions yet</p>
                <p className="text-sm text-foreground-muted mt-1">
                  Deploy a server to see your first transaction
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Server</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">From</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Network</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx, index) => {
                      const chain = chainInfo[tx.chainId];
                      return (
                        <motion.tr
                          key={tx.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-glass-border/50 hover:bg-glass/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-neon-green/20">
                                <ArrowDownLeft className="w-4 h-4 text-neon-green" />
                              </div>
                              <span className="text-foreground capitalize">{tx.type}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-foreground font-medium">{tx.serverName || '-'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-mono text-foreground">{tx.amount.toFixed(6)} {tx.token}</p>
                              <p className="text-xs text-foreground-muted">${tx.amountUSD}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-mono text-sm text-foreground-muted">
                              {tx.fromAddress.slice(0, 6)}...{tx.fromAddress.slice(-4)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="default" size="sm">{tx.chainName}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(tx.status)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-foreground-muted">
                              {formatDate(tx.timestamp)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {tx.txHash ? (
                              <a
                                href={`${chain?.explorer}/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-neon-blue hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-foreground-muted">-</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Deployed Servers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-neon-purple" />
              Deployed Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <div className="text-center py-12">
                <Server className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-muted">No servers deployed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-4 border border-glass-border hover:border-neon-blue/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{server.name}</p>
                        <p className="text-sm text-foreground-muted">{server.config.type.toUpperCase()}</p>
                      </div>
                      <Badge 
                        variant={server.status === 'running' ? 'success' : server.status === 'provisioning' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">CPU</span>
                        <span className="text-foreground">{server.config.cpuCores} cores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">RAM</span>
                        <span className="text-foreground">{server.config.ram} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground-muted">Provider</span>
                        <span className="text-foreground capitalize">{server.config.provider}</span>
                      </div>
                      {server.ip && (
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">IP</span>
                          <span className="font-mono text-neon-blue">{server.ip}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-glass-border">
                        <span className="text-foreground-muted">Payment</span>
                        <span className="text-neon-green font-mono">{server.payment.amount.toFixed(4)} {server.payment.token}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

