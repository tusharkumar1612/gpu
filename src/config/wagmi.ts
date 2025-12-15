'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID - Get yours at https://cloud.walletconnect.com
// Using a demo ID that may have limited functionality
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, sepolia],
  connectors: [
    injected(), // MetaMask and other injected wallets
    coinbaseWallet({
      appName: 'NeuralCloud',
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: 'NeuralCloud',
        description: 'Decentralized Compute Infrastructure',
        url: 'https://neuralcloud.io',
        icons: ['https://neuralcloud.io/icon.png'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});

// Chain info for display
export const chainInfo: Record<number, { name: string; symbol: string; explorer: string }> = {
  1: { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' },
  137: { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' },
  42161: { name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io' },
  10: { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io' },
  11155111: { name: 'Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' },
};
