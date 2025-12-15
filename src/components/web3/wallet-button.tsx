'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { chainInfo } from '@/config/wagmi';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, chains } = useSwitchChain();
  const { data: balance } = useBalance({ address });
  
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const currentChain = chainId ? chainInfo[chainId] : null;

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConnectModal(true)}
          isLoading={isPending}
          leftIcon={<Wallet className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Connect Wallet</span>
          <span className="sm:hidden">Connect</span>
        </Button>

        <Modal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          title="Connect Wallet"
        >
          <div className="space-y-3">
            <p className="text-foreground-muted text-sm mb-4">
              Choose a wallet to connect to NeuralCloud
            </p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setShowConnectModal(false);
                }}
                disabled={isPending}
                className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:bg-glass-hover transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-glass-hover flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-neon-blue" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground">{connector.name}</p>
                  <p className="text-sm text-foreground-muted">
                    {connector.name === 'Injected' ? 'Browser Wallet' : 'Connect'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Chain Selector */}
        <button
          onClick={() => setShowAccountModal(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass hover:bg-glass-hover transition-colors"
        >
          <Badge variant="purple" size="sm">{currentChain?.name || 'Unknown'}</Badge>
        </button>

        {/* Account Button */}
        <button
          onClick={() => setShowAccountModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass hover:bg-glass-hover transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-neon-green" />
          <span className="font-mono text-sm text-foreground">
            {address && formatAddress(address)}
          </span>
          <ChevronDown className="w-4 h-4 text-foreground-muted" />
        </button>
      </div>

      {/* Account Modal */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title="Wallet"
      >
        <div className="space-y-4">
          {/* Address */}
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted mb-2">Connected Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-foreground flex-1 truncate">{address}</p>
              <button
                onClick={copyAddress}
                className="p-2 rounded-lg hover:bg-glass-hover transition-colors"
              >
                <Copy className="w-4 h-4 text-foreground-muted" />
              </button>
              <a
                href={`${currentChain?.explorer}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-glass-hover transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-foreground-muted" />
              </a>
            </div>
          </div>

          {/* Balance */}
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted mb-1">Balance</p>
            <p className="text-2xl font-bold text-foreground">
              {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} {currentChain?.symbol || 'ETH'}
            </p>
          </div>

          {/* Switch Network */}
          <div>
            <p className="text-sm text-foreground-muted mb-2">Switch Network</p>
            <div className="grid grid-cols-2 gap-2">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => switchChain({ chainId: chain.id })}
                  className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                    chainId === chain.id
                      ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                      : 'glass hover:bg-glass-hover text-foreground'
                  }`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>

          {/* Disconnect */}
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              disconnect();
              setShowAccountModal(false);
            }}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Disconnect
          </Button>
        </div>
      </Modal>
    </>
  );
}

