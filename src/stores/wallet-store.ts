import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NetworkType = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism';

export interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund' | 'credit';
  amount: string;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  timestamp: string;
  description: string;
}

interface WalletState {
  // User's connected wallet
  isConnected: boolean;
  address: string | null;
  network: NetworkType;
  
  // User's external wallet balance (simulated)
  externalBalance: {
    eth: number;
    usdc: number;
    usdt: number;
  };
  
  // Platform/Company wallet balance (credits deposited for services)
  platformBalance: {
    eth: number;
    usdc: number;
    usdt: number;
  };
  
  transactions: Transaction[];
  isConnecting: boolean;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: NetworkType) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  
  // New: Deposit/Credit functions
  depositToPlatform: (amount: number, token: 'eth' | 'usdc' | 'usdt') => Promise<void>;
  simulateAirdrop: () => Promise<void>;
  payFromPlatform: (amount: number, token: 'eth' | 'usdc' | 'usdt', description: string) => boolean;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateTxHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: '100',
    token: 'USDC',
    status: 'confirmed',
    hash: generateTxHash(),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    description: 'Welcome bonus credited',
  },
  {
    id: '2',
    type: 'deposit',
    amount: '0.5',
    token: 'ETH',
    status: 'confirmed',
    hash: generateTxHash(),
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    description: 'Deposit to platform wallet',
  },
  {
    id: '3',
    type: 'payment',
    amount: '50',
    token: 'USDC',
    status: 'confirmed',
    hash: generateTxHash(),
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    description: 'Server deployment - GPU-01',
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      network: 'ethereum',
      
      // External wallet (user's MetaMask etc.)
      externalBalance: {
        eth: 2.5,
        usdc: 1500,
        usdt: 800,
      },
      
      // Platform/Company wallet (deposited for services)
      platformBalance: {
        eth: 10.0,
        usdc: 70000,
        usdt: 20000,
      },
      
      transactions: mockTransactions,
      isConnecting: false,

      connect: async () => {
        set({ isConnecting: true });
        await delay(2000);
        
        // Generate mock wallet address
        const mockAddress = '0x' + Array.from({ length: 40 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        set({
          isConnected: true,
          address: mockAddress,
          isConnecting: false,
        });
      },

      disconnect: () => {
        set({
          isConnected: false,
          address: null,
        });
      },

      switchNetwork: (network: NetworkType) => {
        set({ network });
      },

      addTransaction: (tx) => {
        const newTx: Transaction = {
          ...tx,
          id: Date.now().toString(),
        };
        set({ transactions: [newTx, ...get().transactions] });
      },

      // Deposit from external wallet to platform wallet
      depositToPlatform: async (amount: number, token: 'eth' | 'usdc' | 'usdt') => {
        const state = get();
        
        // Check if user has enough in external wallet
        if (state.externalBalance[token] < amount) {
          throw new Error('Insufficient balance in external wallet');
        }

        // Simulate transaction
        await delay(2000);

        // Deduct from external, add to platform
        set({
          externalBalance: {
            ...state.externalBalance,
            [token]: state.externalBalance[token] - amount,
          },
          platformBalance: {
            ...state.platformBalance,
            [token]: state.platformBalance[token] + amount,
          },
        });

        // Add transaction record
        const tokenSymbol = token.toUpperCase();
        get().addTransaction({
          type: 'deposit',
          amount: amount.toString(),
          token: tokenSymbol,
          status: 'confirmed',
          hash: generateTxHash(),
          timestamp: new Date().toISOString(),
          description: `Deposited ${amount} ${tokenSymbol} to platform wallet`,
        });
      },

      // Simulate receiving free credits (airdrop/bonus)
      simulateAirdrop: async () => {
        await delay(1500);

        const state = get();
        
        // Credit 100 USDC and 0.1 ETH to platform wallet
        set({
          platformBalance: {
            ...state.platformBalance,
            eth: state.platformBalance.eth + 0.1,
            usdc: state.platformBalance.usdc + 100,
          },
        });

        // Add transaction record
        get().addTransaction({
          type: 'credit',
          amount: '100',
          token: 'USDC',
          status: 'confirmed',
          hash: generateTxHash(),
          timestamp: new Date().toISOString(),
          description: 'Promotional credits received',
        });

        get().addTransaction({
          type: 'credit',
          amount: '0.1',
          token: 'ETH',
          status: 'confirmed',
          hash: generateTxHash(),
          timestamp: new Date().toISOString(),
          description: 'Promotional ETH credits received',
        });
      },

      // Pay for services from platform wallet
      payFromPlatform: (amount: number, token: 'eth' | 'usdc' | 'usdt', description: string) => {
        const state = get();
        
        if (state.platformBalance[token] < amount) {
          return false; // Insufficient platform balance
        }

        // Deduct from platform wallet
        set({
          platformBalance: {
            ...state.platformBalance,
            [token]: state.platformBalance[token] - amount,
          },
        });

        // Add transaction record
        get().addTransaction({
          type: 'payment',
          amount: amount.toString(),
          token: token.toUpperCase(),
          status: 'confirmed',
          hash: generateTxHash(),
          timestamp: new Date().toISOString(),
          description,
        });

        return true;
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);

// Helper to format balance for display
export const formatBalance = (balance: number, decimals: number = 4): string => {
  if (balance >= 1000) {
    return balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return balance.toFixed(decimals);
};
