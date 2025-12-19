import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ServerStatus = 'running' | 'stopped' | 'deploying' | 'error';
export type ServerType = 'cpu' | 'gpu';
export type OSType = 'ubuntu' | 'debian' | 'centos';
export type ProviderType = 'fluence' | 'akash' | 'filecoin' | 'custom';

export interface Server {
  id: string;
  name: string;
  type: ServerType;
  status: ServerStatus;
  os: OSType;
  cpuCores: number;
  ram: number;
  storage: number;
  gpuType?: string;
  gpuCount?: number;
  bandwidth: number;
  provider: ProviderType;
  region: string;
  ipAddress: string;
  createdAt: string;
  monthlyCost: number;
  metrics: {
    cpuUsage: number;
    ramUsage: number;
    gpuUsage?: number;
    networkIn: number;
    networkOut: number;
  };
}

export interface ServerConfig {
  type: ServerType;
  os: OSType;
  cpuCores: number;
  ram: number;
  storage: number;
  gpuType?: string;
  gpuCount?: number;
  bandwidth: number;
  provider: ProviderType;
  region: string;
}

interface ServerState {
  servers: Server[];
  isLoading: boolean;
  selectedServer: Server | null;
  createServer: (config: ServerConfig) => Promise<Server>;
  updateServerStatus: (id: string, status: ServerStatus) => void;
  deleteServer: (id: string) => Promise<void>;
  selectServer: (server: Server | null) => void;
  getServerById: (id: string) => Server | undefined;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'Production GPU Node',
    type: 'gpu',
    status: 'running',
    os: 'ubuntu',
    cpuCores: 16,
    ram: 64,
    storage: 500,
    gpuType: 'NVIDIA A100',
    gpuCount: 2,
    bandwidth: 1000,
    provider: 'fluence',
    region: 'us-east-1',
    ipAddress: '192.168.1.101',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    monthlyCost: 450,
    metrics: {
      cpuUsage: 67,
      ramUsage: 78,
      gpuUsage: 85,
      networkIn: 125,
      networkOut: 89,
    },
  },
  {
    id: 'srv-002',
    name: 'Dev CPU Server',
    type: 'cpu',
    status: 'running',
    os: 'debian',
    cpuCores: 8,
    ram: 32,
    storage: 250,
    bandwidth: 500,
    provider: 'akash',
    region: 'eu-west-1',
    ipAddress: '192.168.1.102',
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    monthlyCost: 120,
    metrics: {
      cpuUsage: 45,
      ramUsage: 52,
      networkIn: 45,
      networkOut: 32,
    },
  },
  {
    id: 'srv-003',
    name: 'ML Training Node',
    type: 'gpu',
    status: 'stopped',
    os: 'ubuntu',
    cpuCores: 32,
    ram: 128,
    storage: 1000,
    gpuType: 'NVIDIA H100',
    gpuCount: 4,
    bandwidth: 2000,
    provider: 'filecoin',
    region: 'ap-southeast-1',
    ipAddress: '192.168.1.103',
    createdAt: new Date(Date.now() - 2419200000).toISOString(),
    monthlyCost: 890,
    metrics: {
      cpuUsage: 0,
      ramUsage: 0,
      gpuUsage: 0,
      networkIn: 0,
      networkOut: 0,
    },
  },
  {
    id: 'srv-004',
    name: 'API Backend',
    type: 'cpu',
    status: 'running',
    os: 'centos',
    cpuCores: 4,
    ram: 16,
    storage: 100,
    bandwidth: 250,
    provider: 'fluence',
    region: 'us-west-2',
    ipAddress: '192.168.1.104',
    createdAt: new Date(Date.now() - 3024000000).toISOString(),
    monthlyCost: 65,
    metrics: {
      cpuUsage: 28,
      ramUsage: 41,
      networkIn: 78,
      networkOut: 156,
    },
  },
];

const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1'];

export const useServerStore = create<ServerState>()(
  persist(
    (set, get) => ({
      servers: mockServers,
      isLoading: false,
      selectedServer: null,

      createServer: async (config: ServerConfig) => {
        set({ isLoading: true });
        await delay(3000); // Simulate deployment time

        const newServer: Server = {
          id: 'srv-' + Date.now().toString().slice(-6),
          name: `${config.type.toUpperCase()} Server ${get().servers.length + 1}`,
          type: config.type,
          status: 'running',
          os: config.os,
          cpuCores: config.cpuCores,
          ram: config.ram,
          storage: config.storage,
          gpuType: config.gpuType,
          gpuCount: config.gpuCount,
          bandwidth: config.bandwidth,
          provider: config.provider,
          region: config.region,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          createdAt: new Date().toISOString(),
          monthlyCost: calculateMonthlyCost(config),
          metrics: {
            cpuUsage: Math.floor(Math.random() * 30),
            ramUsage: Math.floor(Math.random() * 40),
            gpuUsage: config.type === 'gpu' ? Math.floor(Math.random() * 50) : undefined,
            networkIn: Math.floor(Math.random() * 100),
            networkOut: Math.floor(Math.random() * 100),
          },
        };

        set(state => ({
          servers: [...state.servers, newServer],
          isLoading: false,
        }));

        return newServer;
      },

      updateServerStatus: (id: string, status: ServerStatus) => {
        set(state => ({
          servers: state.servers.map(server =>
            server.id === id ? { ...server, status } : server
          ),
        }));
      },

      deleteServer: async (id: string) => {
        set({ isLoading: true });
        await delay(1500);
        set(state => ({
          servers: state.servers.filter(server => server.id !== id),
          isLoading: false,
        }));
      },

      selectServer: (server: Server | null) => {
        set({ selectedServer: server });
      },

      getServerById: (id: string) => {
        return get().servers.find(server => server.id === id);
      },
    }),
    {
      name: 'server-storage',
    }
  )
);

function calculateMonthlyCost(config: ServerConfig): number {
  let cost = 0;
  cost += config.cpuCores * 5;
  cost += config.ram * 2;
  cost += config.storage * 0.1;
  cost += config.bandwidth * 0.05;
  if (config.gpuCount) {
    cost += config.gpuCount * 150;
  }
  return Math.round(cost);
}

export { regions };


