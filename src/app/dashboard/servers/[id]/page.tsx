'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Server,
  Cpu,
  HardDrive,
  Globe,
  Play,
  Square,
  RotateCw,
  Trash2,
  ArrowLeft,
  Activity,
  Settings,
  FileText,
  ChevronRight,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useServerStore, Server as ServerType, ServerStatus } from '@/stores/server-store';
import { useUIStore } from '@/stores/ui-store';

// Mock metrics data generator
const generateMetricsData = (baseValue: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * 30)),
  }));
};

// Mock logs
const mockLogs = [
  { timestamp: '2024-01-15 14:32:15', level: 'INFO', message: 'Server started successfully' },
  { timestamp: '2024-01-15 14:32:14', level: 'INFO', message: 'Initializing network interfaces...' },
  { timestamp: '2024-01-15 14:32:12', level: 'INFO', message: 'Mounting storage volumes...' },
  { timestamp: '2024-01-15 14:32:10', level: 'DEBUG', message: 'Loading system configuration' },
  { timestamp: '2024-01-15 14:32:08', level: 'INFO', message: 'System boot initiated' },
  { timestamp: '2024-01-15 14:30:00', level: 'WARN', message: 'High memory usage detected (85%)' },
  { timestamp: '2024-01-15 14:25:32', level: 'INFO', message: 'Scheduled backup completed' },
  { timestamp: '2024-01-15 14:20:15', level: 'ERROR', message: 'Connection timeout to external API' },
  { timestamp: '2024-01-15 14:15:00', level: 'INFO', message: 'Health check passed' },
];

const statusColors: Record<ServerStatus, 'success' | 'warning' | 'error' | 'info'> = {
  running: 'success',
  stopped: 'warning',
  deploying: 'info',
  error: 'error',
};

export default function ServerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getServerById, updateServerStatus, deleteServer, isLoading } = useServerStore();
  const { addToast } = useUIStore();
  
  const [server, setServer] = useState<ServerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scaleModalOpen, setScaleModalOpen] = useState(false);
  
  const [cpuData] = useState(() => generateMetricsData(65));
  const [ramData] = useState(() => generateMetricsData(72));
  const [gpuData] = useState(() => generateMetricsData(80));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundServer = getServerById(params.id as string);
      setServer(foundServer || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [params.id, getServerById]);

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!server) return;

    if (action === 'restart') {
      updateServerStatus(server.id, 'deploying');
      setServer({ ...server, status: 'deploying' });
      setTimeout(() => {
        updateServerStatus(server.id, 'running');
        setServer(prev => prev ? { ...prev, status: 'running' } : null);
        addToast({
          type: 'success',
          title: 'Server Restarted',
          message: `${server.name} has been restarted.`,
        });
      }, 2000);
    } else {
      const newStatus = action === 'start' ? 'running' : 'stopped';
      updateServerStatus(server.id, newStatus);
      setServer({ ...server, status: newStatus });
      addToast({
        type: 'success',
        title: `Server ${action === 'start' ? 'Started' : 'Stopped'}`,
        message: `${server.name} has been ${action === 'start' ? 'started' : 'stopped'}.`,
      });
    }
  };

  const handleDelete = async () => {
    if (server) {
      await deleteServer(server.id);
      addToast({
        type: 'success',
        title: 'Server Deleted',
        message: `${server.name} has been deleted.`,
      });
      router.push('/dashboard/servers');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied',
      message: 'Copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton height={40} width={300} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
        <Skeleton height={400} />
      </div>
    );
  }

  if (!server) {
    return (
      <Card padding="lg" className="text-center">
        <Server className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Server Not Found</h3>
        <p className="text-foreground-muted mb-4">
          The server you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push('/dashboard/servers')}>
          Back to Servers
        </Button>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-neon-blue">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-sm text-foreground-muted">CPU Usage</p>
          <p className="text-2xl font-bold text-foreground">{server.metrics.cpuUsage}%</p>
          <Progress value={server.metrics.cpuUsage} className="mt-2" />
        </Card>
        <Card padding="md">
          <p className="text-sm text-foreground-muted">RAM Usage</p>
          <p className="text-2xl font-bold text-foreground">{server.metrics.ramUsage}%</p>
          <Progress value={server.metrics.ramUsage} className="mt-2" />
        </Card>
        {server.type === 'gpu' && (
          <Card padding="md">
            <p className="text-sm text-foreground-muted">GPU Usage</p>
            <p className="text-2xl font-bold text-foreground">{server.metrics.gpuUsage}%</p>
            <Progress value={server.metrics.gpuUsage || 0} className="mt-2" />
          </Card>
        )}
        <Card padding="md">
          <p className="text-sm text-foreground-muted">Network</p>
          <p className="text-lg font-bold text-foreground">
            ↑ {server.metrics.networkOut} MB/s
          </p>
          <p className="text-lg font-bold text-foreground">
            ↓ {server.metrics.networkIn} MB/s
          </p>
        </Card>
      </div>

      {/* Server Details */}
      <Card padding="lg">
        <h3 className="font-semibold text-foreground mb-4">Server Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Server ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-foreground">{server.id}</span>
                <button onClick={() => copyToClipboard(server.id)}>
                  <Copy className="w-4 h-4 text-foreground-muted hover:text-foreground" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">IP Address</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-foreground">{server.ipAddress}</span>
                <button onClick={() => copyToClipboard(server.ipAddress)}>
                  <Copy className="w-4 h-4 text-foreground-muted hover:text-foreground" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Operating System</span>
              <span className="text-foreground capitalize">{server.os}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Created</span>
              <span className="text-foreground">{new Date(server.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Provider</span>
              <span className="text-foreground capitalize">{server.provider}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Region</span>
              <span className="text-foreground">{server.region}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Monthly Cost</span>
              <span className="text-neon-blue font-semibold">${server.monthlyCost}/mo</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-foreground-muted">Bandwidth</span>
              <span className="text-foreground">{server.bandwidth} Mbps</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const MetricsTab = () => (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="font-semibold text-foreground mb-4">CPU Usage (24h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cpuData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#00d4ff" fill="url(#cpuGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="font-semibold text-foreground mb-4">RAM Usage (24h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ramData}>
              <defs>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="url(#ramGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {server.type === 'gpu' && (
        <Card padding="lg">
          <h3 className="font-semibold text-foreground mb-4">GPU Usage (24h)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpuData}>
                <defs>
                  <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#a855f7" fill="url(#gpuGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );

  const LogsTab = () => (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">System Logs</h3>
        <Button variant="secondary" size="sm">
          Download Logs
        </Button>
      </div>
      <div className="font-mono text-sm max-h-[500px] overflow-y-auto">
        {mockLogs.map((log, i) => (
          <div
            key={i}
            className="flex items-start gap-4 px-4 py-2 border-b border-glass-border hover:bg-glass-hover"
          >
            <span className="text-foreground-muted flex-shrink-0">{log.timestamp}</span>
            <Badge
              variant={
                log.level === 'ERROR' ? 'error' :
                log.level === 'WARN' ? 'warning' :
                log.level === 'DEBUG' ? 'purple' : 'info'
              }
              size="sm"
              className="flex-shrink-0"
            >
              {log.level}
            </Badge>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="font-semibold text-foreground mb-4">Server Actions</h3>
        <div className="space-y-4">
          <button
            onClick={() => setScaleModalOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-glass-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-neon-blue" />
              <div className="text-left">
                <p className="font-medium text-foreground">Scale Resources</p>
                <p className="text-sm text-foreground-muted">Increase or decrease CPU, RAM, and storage</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground-muted" />
          </button>
          
          <button
            onClick={() => handleAction('restart')}
            className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-glass-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <RotateCw className="w-5 h-5 text-warning" />
              <div className="text-left">
                <p className="font-medium text-foreground">Redeploy Server</p>
                <p className="text-sm text-foreground-muted">Restart with fresh configuration</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>
      </Card>

      <Card padding="lg" className="border-error/30">
        <h3 className="font-semibold text-error mb-4">Danger Zone</h3>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-error/10 hover:bg-error/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-error" />
            <div className="text-left">
              <p className="font-medium text-error">Terminate Server</p>
              <p className="text-sm text-foreground-muted">Permanently delete this server</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-error" />
        </button>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Server className="w-4 h-4" />, content: <OverviewTab /> },
    { id: 'metrics', label: 'Metrics', icon: <Activity className="w-4 h-4" />, content: <MetricsTab /> },
    { id: 'logs', label: 'Logs', icon: <FileText className="w-4 h-4" />, content: <LogsTab /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, content: <SettingsTab /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/servers')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{server.name}</h1>
              <Badge variant={statusColors[server.status]}>{server.status}</Badge>
            </div>
            <p className="text-foreground-muted">{server.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {server.status === 'running' ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction('stop')}
              leftIcon={<Square className="w-4 h-4" />}
            >
              Stop
            </Button>
          ) : server.status === 'stopped' ? (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleAction('start')}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Start
            </Button>
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction('restart')}
            disabled={server.status === 'deploying'}
            leftIcon={<RotateCw className="w-4 h-4" />}
          >
            Restart
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Terminate Server"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            Are you sure you want to terminate <strong className="text-foreground">{server.name}</strong>? 
            This action cannot be undone and all data will be lost.
          </p>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDelete}
              isLoading={isLoading}
            >
              Terminate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scale Modal */}
      <Modal
        isOpen={scaleModalOpen}
        onClose={() => setScaleModalOpen(false)}
        title="Scale Resources"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            Resource scaling is a premium feature. In the full version, you'll be able to 
            dynamically adjust CPU, RAM, and storage without downtime.
          </p>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted mb-2">Current Configuration</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-neon-blue">{server.cpuCores}</p>
                <p className="text-sm text-foreground-muted">CPU Cores</p>
              </div>
              <div>
                <p className="text-xl font-bold text-neon-purple">{server.ram}GB</p>
                <p className="text-sm text-foreground-muted">RAM</p>
              </div>
              <div>
                <p className="text-xl font-bold text-neon-green">{server.storage}GB</p>
                <p className="text-sm text-foreground-muted">Storage</p>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => setScaleModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

