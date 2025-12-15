'use client';

import { useAccount, useBalance, useDisconnect, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { chainInfo } from '@/config/wagmi';

export function useWeb3Wallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  // Get ETH balance
  const { data: ethBalance, isLoading: isLoadingBalance } = useBalance({
    address: address,
  });

  // Get chain info
  const currentChain = chainId ? chainInfo[chainId] : null;

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    // Connection state
    isConnected,
    isConnecting,
    address,
    formattedAddress: address ? formatAddress(address) : null,
    
    // Chain info
    chainId,
    chainName: currentChain?.name || 'Unknown',
    chainSymbol: currentChain?.symbol || 'ETH',
    explorer: currentChain?.explorer || '',
    
    // Balances
    ethBalance: ethBalance ? formatEther(ethBalance.value) : '0',
    ethBalanceFormatted: ethBalance 
      ? parseFloat(formatEther(ethBalance.value)).toFixed(4) 
      : '0.0000',
    isLoadingBalance,
    
    // Actions
    disconnect,
  };
}

