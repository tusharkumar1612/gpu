// Platform Configuration
// Your wallet is configured to receive all payments

export const platformConfig = {
  // Your receiving wallet address - ALL PAYMENTS GO HERE
  PLATFORM_WALLET: '0x1378a57fa42b647b80475bf280985362a6136aa6' as `0x${string}`,
  
  // Platform name
  name: 'NeuralCloud',
  
  // Simulation mode DISABLED - Real payments only
  enableSimulation: false,
  
  // Mock ETH price for USD conversion
  ETH_PRICE_USD: 2000,
  
  // Supported payment tokens
  supportedTokens: ['ETH', 'MATIC', 'USDC'] as const,
};

// Transaction types
export type TransactionType = 'deployment' | 'topup' | 'refund' | 'subscription';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'simulated';

export interface PlatformTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  amountUSD: number;
  token: string;
  fromAddress: string;
  toAddress: string;
  txHash: string | null;
  serverName?: string;
  serverId?: string;
  timestamp: Date;
  isSimulated: boolean;
  chainId: number;
  chainName: string;
}

export interface DeployedServer {
  id: string;
  name: string;
  status: 'provisioning' | 'running' | 'stopped' | 'terminated';
  config: {
    type: string;
    os: string;
    cpuCores: number;
    ram: number;
    storage: number;
    provider: string;
    region: string;
  };
  payment: {
    amount: number;
    amountUSD: number;
    token: string;
    txHash: string | null;
    isSimulated: boolean;
  };
  createdAt: Date;
  ip?: string;
  sshKey?: string;
}

