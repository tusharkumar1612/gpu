'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PlatformTransaction, 
  DeployedServer, 
  TransactionStatus,
  platformConfig 
} from '@/config/platform';

interface PlatformState {
  // Transactions
  transactions: PlatformTransaction[];
  addTransaction: (tx: Omit<PlatformTransaction, 'id' | 'timestamp'>) => string;
  updateTransactionStatus: (id: string, status: TransactionStatus, txHash?: string) => void;
  
  // Deployed Servers
  servers: DeployedServer[];
  addServer: (server: Omit<DeployedServer, 'id' | 'createdAt'>) => string;
  updateServerStatus: (id: string, status: DeployedServer['status'], ip?: string) => void;
  
  // Platform Stats
  getTotalRevenue: () => { eth: number; usd: number };
  getTotalServers: () => number;
  getActiveServers: () => number;
  getRecentTransactions: (limit?: number) => PlatformTransaction[];
  
  // Simulation mode
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      transactions: [],
      servers: [],
      isSimulationMode: platformConfig.enableSimulation,

      addTransaction: (tx) => {
        const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTx: PlatformTransaction = {
          ...tx,
          id,
          timestamp: new Date(),
        };
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));
        return id;
      },

      updateTransactionStatus: (id, status, txHash) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id
              ? { ...tx, status, txHash: txHash || tx.txHash }
              : tx
          ),
        }));
      },

      addServer: (serverData) => {
        const id = `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newServer: DeployedServer = {
          ...serverData,
          id,
          createdAt: new Date(),
        };
        set((state) => ({
          servers: [newServer, ...state.servers],
        }));
        return id;
      },

      updateServerStatus: (id, status, ip) => {
        set((state) => ({
          servers: state.servers.map((server) =>
            server.id === id
              ? { 
                  ...server, 
                  status, 
                  ip: ip || server.ip,
                  // Generate mock SSH key when server is running
                  sshKey: status === 'running' ? `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ...${id}` : server.sshKey
                }
              : server
          ),
        }));
      },

      getTotalRevenue: () => {
        const { transactions } = get();
        const confirmedTxs = transactions.filter(
          (tx) => tx.status === 'confirmed' || tx.status === 'simulated'
        );
        return {
          eth: confirmedTxs.reduce((sum, tx) => sum + tx.amount, 0),
          usd: confirmedTxs.reduce((sum, tx) => sum + tx.amountUSD, 0),
        };
      },

      getTotalServers: () => get().servers.length,

      getActiveServers: () =>
        get().servers.filter((s) => s.status === 'running' || s.status === 'provisioning').length,

      getRecentTransactions: (limit = 10) =>
        get().transactions.slice(0, limit),

      toggleSimulationMode: () => {
        set((state) => ({
          isSimulationMode: !state.isSimulationMode,
        }));
      },
    }),
    {
      name: 'neuralcloud-platform',
      partialize: (state) => ({
        transactions: state.transactions,
        servers: state.servers,
        isSimulationMode: state.isSimulationMode,
      }),
    }
  )
);

