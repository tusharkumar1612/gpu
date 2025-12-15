'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useServerStore, Server as ServerType, ServerStatus } from '@/stores/server-store';
import { useUIStore } from '@/stores/ui-store';

const statusColors: Record<ServerStatus, 'success' | 'warning' | 'error' | 'info'> = {
  running: 'success',
  stopped: 'warning',
  deploying: 'info',
  error: 'error',
};

const statusIcons: Record<ServerStatus, React.ReactNode> = {
  running: <span className="w-2 h-2 rounded-full bg-success animate-pulse" />,
  stopped: <span className="w-2 h-2 rounded-full bg-warning" />,
  deploying: <span className="w-2 h-2 rounded-full bg-info animate-pulse" />,
  error: <span className="w-2 h-2 rounded-full bg-error" />,
};

export default function ServersPage() {
  const { servers, updateServerStatus, deleteServer, isLoading } = useServerStore();
  const { addToast } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ServerStatus | 'all'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<ServerType | null>(null);

  const filteredServers = servers.filter((server) => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || server.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAction = async (server: ServerType, action: 'start' | 'stop' | 'restart') => {
    const actionMap = {
      start: 'running' as ServerStatus,
      stop: 'stopped' as ServerStatus,
      restart: 'running' as ServerStatus,
    };

    if (action === 'restart') {
      updateServerStatus(server.id, 'deploying');
      setTimeout(() => {
        updateServerStatus(server.id, 'running');
        addToast({
          type: 'success',
          title: 'Server Restarted',
          message: `${server.name} has been restarted.`,
        });
      }, 2000);
    } else {
      updateServerStatus(server.id, actionMap[action]);
      addToast({
        type: 'success',
        title: `Server ${action === 'start' ? 'Started' : 'Stopped'}`,
        message: `${server.name} has been ${action === 'start' ? 'started' : 'stopped'}.`,
      });
    }
  };

  const handleDelete = async () => {
    if (serverToDelete) {
      await deleteServer(serverToDelete.id);
      addToast({
        type: 'success',
        title: 'Server Deleted',
        message: `${serverToDelete.name} has been deleted.`,
      });
      setDeleteModalOpen(false);
      setServerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Servers</h1>
          <p className="text-foreground-muted">Manage your deployed compute instances</p>
        </div>
        <Link href="/dashboard/create-server">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create Server
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'running', 'stopped', 'deploying', 'error'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Server Grid */}
      {filteredServers.length === 0 ? (
        <Card padding="lg" className="text-center">
          <Server className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No servers found</h3>
          <p className="text-foreground-muted mb-4">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first server'}
          </p>
          <Link href="/dashboard/create-server">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Server
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServers.map((server, index) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="interactive" padding="none" className="overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-glass-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${server.type === 'gpu' ? 'bg-neon-purple/20' : 'bg-neon-blue/20'}`}>
                        {server.type === 'gpu' ? (
                          <Server className="w-5 h-5 text-neon-purple" />
                        ) : (
                          <Cpu className="w-5 h-5 text-neon-blue" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/servers/${server.id}`}
                          className="font-semibold text-foreground hover:text-neon-blue transition-colors"
                        >
                          {server.name}
                        </Link>
                        <p className="text-sm text-foreground-muted">{server.id}</p>
                      </div>
                    </div>
                    <Badge variant={statusColors[server.status]} className="flex items-center gap-1.5">
                      {statusIcons[server.status]}
                      {server.status}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-foreground-muted">
                      <Cpu className="w-4 h-4" />
                      <span>{server.cpuCores} CPU</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted">
                      <HardDrive className="w-4 h-4" />
                      <span>{server.ram} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted">
                      <Server className="w-4 h-4" />
                      <span>{server.storage} GB</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-muted">
                      <Globe className="w-4 h-4" />
                      <span>{server.region}</span>
                    </div>
                  </div>

                  {server.type === 'gpu' && (
                    <div className="text-sm text-foreground-muted">
                      {server.gpuCount}x {server.gpuType}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                    <span className="text-sm text-foreground-muted capitalize">{server.provider}</span>
                    <span className="font-semibold text-neon-blue">${server.monthlyCost}/mo</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  {server.status === 'running' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAction(server, 'stop')}
                      leftIcon={<Square className="w-4 h-4" />}
                    >
                      Stop
                    </Button>
                  ) : server.status === 'stopped' ? (
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAction(server, 'start')}
                      leftIcon={<Play className="w-4 h-4" />}
                    >
                      Start
                    </Button>
                  ) : null}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAction(server, 'restart')}
                    disabled={server.status === 'deploying'}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setServerToDelete(server);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Server"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            Are you sure you want to delete <strong className="text-foreground">{serverToDelete?.name}</strong>? 
            This action cannot be undone.
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
              Delete Server
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

