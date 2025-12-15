'use client';

import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet-store';

export function useWeb3Wallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  
  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Sync with our wallet store
  const walletStore = useWalletStore();

  useEffect(() => {
    if (isConnected && address) {
      // Update wallet store with real connection
      useWalletStore.setState({
        isConnected: true,
        address: address,
        isConnecting: false,
      });

      // Update external balance with real ETH balance
      if (ethBalance) {
        const ethValue = parseFloat(formatEther(ethBalance.value));
        useWalletStore.setState((state) => ({
          externalBalance: {
            ...state.externalBalance,
            eth: ethValue,
          },
        }));
      }
    } else if (!isConnected) {
      useWalletStore.setState({
        isConnected: false,
        address: null,
      });
    }
  }, [isConnected, address, ethBalance]);

  // Map chain ID to network name
  const getNetworkName = (chainId: number): 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' => {
    switch (chainId) {
      case 137:
      case 80001:
        return 'polygon';
      case 42161:
        return 'arbitrum';
      case 10:
        return 'optimism';
      default:
        return 'ethereum';
    }
  };

  useEffect(() => {
    if (chainId) {
      useWalletStore.setState({
        network: getNetworkName(chainId),
      });
    }
  }, [chainId]);

  return {
    // Real wallet state
    address,
    isConnected,
    isConnecting,
    chainId,
    ethBalance: ethBalance ? formatEther(ethBalance.value) : '0',
    
    // Actions
    connect: openConnectModal,
    disconnect,
    
    // Store state (includes platform balance)
    ...walletStore,
  };
}

