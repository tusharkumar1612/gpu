'use client';

import { Server, Cpu, Gpu, DollarSign, Wallet, Wifi } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ResourceChart, CostChart, ProviderChart } from '@/components/dashboard/charts';
import { ActivityTable } from '@/components/dashboard/activity-table';
import { useServerStore } from '@/stores/server-store';
import { useWalletStore, formatBalance } from '@/stores/wallet-store';

export default function DashboardPage() {
  const { servers } = useServerStore();
  const { platformBalance, isConnected } = useWalletStore();
  
  // Calculate total platform balance in USD
  const ethPrice = 2000;
  const totalPlatformUSD = platformBalance.eth * ethPrice + platformBalance.usdc + platformBalance.usdt;

  const activeServers = servers.filter(s => s.status === 'running').length;
  const totalCpuUsage = servers.reduce((acc, s) => acc + s.metrics.cpuUsage, 0) / servers.length || 0;
  const totalGpuUsage = servers
    .filter(s => s.type === 'gpu')
    .reduce((acc, s) => acc + (s.metrics.gpuUsage || 0), 0) / 
    servers.filter(s => s.type === 'gpu').length || 0;
  const monthlySpend = servers.reduce((acc, s) => acc + s.monthlyCost, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground-muted">Monitor your decentralized infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Servers"
          value={activeServers.toString()}
          change={{ value: '+2', type: 'increase' }}
          icon={Server}
          iconColor="text-neon-blue"
          delay={0}
        />
        <StatCard
          title="CPU Usage"
          value={`${Math.round(totalCpuUsage)}%`}
          icon={Cpu}
          iconColor="text-neon-purple"
          delay={0.1}
        />
        <StatCard
          title="GPU Usage"
          value={`${Math.round(totalGpuUsage)}%`}
          icon={Gpu}
          iconColor="text-neon-green"
          delay={0.2}
        />
        <StatCard
          title="Monthly Spend"
          value={`$${monthlySpend.toLocaleString()}`}
          change={{ value: '+12%', type: 'increase' }}
          icon={DollarSign}
          iconColor="text-neon-orange"
          delay={0.3}
        />
        <StatCard
          title="Platform Credits"
          value={isConnected ? `$${formatBalance(totalPlatformUSD, 2)}` : 'Not Connected'}
          icon={Wallet}
          iconColor="text-neon-pink"
          delay={0.4}
        />
        <StatCard
          title="Network Status"
          value="Online"
          icon={Wifi}
          iconColor="text-success"
          delay={0.5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceChart />
        <CostChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTable />
        </div>
        <ProviderChart />
      </div>
    </div>
  );
}

