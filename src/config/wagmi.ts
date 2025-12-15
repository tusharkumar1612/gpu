'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum, optimism, sepolia],
  connectors: [
    injected(), // MetaMask and other injected wallets
    coinbaseWallet({
      appName: 'NeuralCloud',
    }),
    // WalletConnect removed due to Turbopack build issues
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
