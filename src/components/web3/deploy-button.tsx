'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Wallet, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface DeployButtonProps {
  onDeploy: () => void;
  disabled?: boolean;
}

export default function Web3DeployButton({ onDeploy, disabled }: DeployButtonProps) {
  const { isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasMetaMask(!!window.ethereum);
    }
  }, []);

  // Filter connectors to show available ones
  const availableConnectors = connectors.filter(connector => {
    // Always show WalletConnect and Coinbase
    if (connector.name === 'WalletConnect' || connector.name === 'Coinbase Wallet') {
      return true;
    }
    // Only show injected if MetaMask is installed
    if (connector.name === 'Injected' || connector.name === 'MetaMask') {
      return hasMetaMask;
    }
    return true;
  });

  const handleConnect = async (connector: typeof connectors[0]) => {
    try {
      await connect({ connector }, {
        onSuccess: () => {
          setShowConnectModal(false);
        },
        onError: (err) => {
          console.error('Connection error:', err);
        }
      });
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Button
          size="lg"
          onClick={() => setShowConnectModal(true)}
          isLoading={isPending}
          leftIcon={<Wallet className="w-4 h-4" />}
        >
          Connect Wallet to Deploy
        </Button>

        <Modal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          title="Connect Wallet"
        >
          <div className="space-y-4">
            <p className="text-foreground-muted">
              Connect your Web3 wallet to deploy servers and pay with crypto.
            </p>

            {!hasMetaMask && (
              <div className="glass rounded-xl p-4 border border-warning/30 bg-warning/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">No Wallet Detected</p>
                    <p className="text-sm text-foreground-muted mt-1">
                      Install MetaMask to connect with your browser.
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-neon-blue hover:underline mt-2"
                    >
                      Install MetaMask
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {hasMetaMask && (
                <button
                  onClick={() => {
                    const injected = connectors.find(c => c.name === 'Injected' || c.name === 'MetaMask');
                    if (injected) handleConnect(injected);
                  }}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:bg-glass-hover transition-colors disabled:opacity-50 border-2 border-neon-blue/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f6851b]/20 flex items-center justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                      alt="MetaMask" 
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground">MetaMask</p>
                    <p className="text-sm text-neon-green">Recommended</p>
                  </div>
                  {isPending && (
                    <Loader2 className="w-5 h-5 text-neon-blue animate-spin" />
                  )}
                </button>
              )}

              {availableConnectors
                .filter(c => c.name !== 'Injected' && c.name !== 'MetaMask')
                .map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:bg-glass-hover transition-colors disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-glass-hover flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">{connector.name}</p>
                      <p className="text-sm text-foreground-muted">
                        {connector.name === 'WalletConnect' ? 'Scan QR with mobile wallet' :
                         connector.name === 'Coinbase Wallet' ? 'Coinbase Wallet extension' : 'Connect'}
                      </p>
                    </div>
                    {isPending && (
                      <Loader2 className="w-5 h-5 text-neon-blue animate-spin" />
                    )}
                  </button>
                ))}
            </div>

            {error && (
              <div className="glass rounded-xl p-4 border border-error/30 bg-error/5">
                <p className="text-sm text-error font-medium">Connection Failed</p>
                <p className="text-sm text-foreground-muted mt-1">
                  {error.message.includes('Provider not found') 
                    ? 'Wallet extension not detected. Please install MetaMask or use WalletConnect.'
                    : error.message}
                </p>
              </div>
            )}

            <div className="border-t border-glass-border pt-4">
              <p className="text-xs text-foreground-muted text-center mb-3">
                Don&apos;t have a wallet?
              </p>
              <div className="flex gap-2">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-4 rounded-lg glass hover:bg-glass-hover transition-colors text-sm text-foreground"
                >
                  Get MetaMask
                </a>
                <a
                  href="https://www.coinbase.com/wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-4 rounded-lg glass hover:bg-glass-hover transition-colors text-sm text-foreground"
                >
                  Get Coinbase
                </a>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Button
      size="lg"
      onClick={onDeploy}
      disabled={disabled}
      leftIcon={<Wallet className="w-4 h-4" />}
    >
      Deploy Server (Pay with ETH)
    </Button>
  );
}
