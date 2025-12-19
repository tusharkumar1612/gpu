'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
  useChainId,
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  AlertTriangle,
  Server,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { chainInfo } from '@/config/wagmi';
import { platformConfig } from '@/config/platform';
import { usePlatformStore } from '@/stores/platform-store';

// Your wallet address - receives all payments
const PLATFORM_WALLET = platformConfig.PLATFORM_WALLET;

interface DeployPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  serverName: string;
  costUSD: number;
  serverConfig: {
    type: string;
    os: string;
    cpuCores: number;
    ram: number;
    storage: number;
    provider: string;
    region: string;
  };
}

export function DeployPayment({ 
  isOpen, 
  onClose, 
  onSuccess,
  serverName,
  costUSD,
  serverConfig 
}: DeployPaymentProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const currentChain = chainId ? chainInfo[chainId] : null;

  const [step, setStep] = useState<'confirm' | 'signing' | 'pending' | 'success' | 'error'>('confirm');
  const [deployProgress, setDeployProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Track if we've already recorded this transaction
  const transactionRecorded = useRef(false);
  
  // Platform store for recording transactions
  const { addTransaction, addServer, updateServerStatus } = usePlatformStore();

  // Convert USD to ETH (mock rate: 1 ETH = $2000)
  const ETH_PRICE = platformConfig.ETH_PRICE_USD;
  const costETH = costUSD / ETH_PRICE;
  
  // Copy wallet address
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(PLATFORM_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send transaction hook
  const { 
    data: txHash,
    sendTransaction, 
    isPending: isSending,
    isError: isSendError,
    error: sendError,
    reset: resetSend
  } = useSendTransaction();

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError
  } = useWaitForTransactionReceipt({ 
    hash: txHash,
  });

  // Handle transaction states
  useEffect(() => {
    if (isSending) {
      setStep('signing');
    }
    if (txHash && !isConfirmed) {
      setStep('pending');
      // Start deploy progress animation
      const interval = setInterval(() => {
        setDeployProgress(prev => Math.min(prev + Math.random() * 10, 90));
      }, 500);
      return () => clearInterval(interval);
    }
    if (isConfirmed && txHash && !transactionRecorded.current) {
      transactionRecorded.current = true;
      setStep('success');
      setDeployProgress(100);
      
      // Record transaction in platform store
      addTransaction({
        type: 'deployment',
        status: 'confirmed',
        amount: costETH,
        amountUSD: costUSD,
        token: currentChain?.symbol || 'ETH',
        fromAddress: address || '',
        toAddress: PLATFORM_WALLET,
        txHash: txHash,
        serverName: serverName,
        isSimulated: false,
        chainId: chainId || 1,
        chainName: currentChain?.name || 'Ethereum',
      });
      
      // Add server to platform store
      const serverId = addServer({
        name: serverName,
        status: 'provisioning',
        config: serverConfig,
        payment: {
          amount: costETH,
          amountUSD: costUSD,
          token: currentChain?.symbol || 'ETH',
          txHash: txHash,
          isSimulated: false,
        },
      });
      
      // Simulate server becoming ready after a delay
      setTimeout(() => {
        updateServerStatus(serverId, 'running', `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
      }, 5000);
      
      // Trigger success callback after animation
      setTimeout(() => {
        onSuccess(txHash);
      }, 2000);
    }
    if (isSendError || isConfirmError) {
      setStep('error');
    }
  }, [isSending, txHash, isConfirmed, isSendError, isConfirmError, onSuccess, address, chainId, costETH, costUSD, currentChain, serverConfig, serverName, addTransaction, addServer, updateServerStatus]);

  const handlePayAndDeploy = () => {
    if (!isConnected) return;
    
    sendTransaction({
      to: PLATFORM_WALLET as `0x${string}`,
      value: parseEther(costETH.toFixed(8)),
    });
  };

  const handleClose = () => {
    setStep('confirm');
    setDeployProgress(0);
    transactionRecorded.current = false;
    resetSend();
    onClose();
  };

  const balanceNum = balance ? parseFloat(formatEther(balance.value)) : 0;
  const hasEnoughBalance = balanceNum >= costETH;

  return (
    <Modal
      isOpen={isOpen}
      onClose={step === 'pending' || step === 'signing' ? () => {} : handleClose}
      title={
        step === 'confirm' ? '🚀 Deploy Server' :
        step === 'signing' ? '✍️ Sign Transaction' :
        step === 'pending' ? '⏳ Deploying...' :
        step === 'success' ? '✅ Deployment Complete!' :
        '❌ Deployment Failed'
      }
    >
      {step === 'confirm' && (
        <div className="space-y-4">
          {/* Warning */}
          <div className="glass rounded-xl p-4 border border-warning/30 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Real Blockchain Payment</p>
                <p className="text-sm text-foreground-muted">
                  This will send real {currentChain?.symbol || 'ETH'} from your wallet to deploy the server.
                </p>
              </div>
            </div>
          </div>

          {/* Server Summary */}
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-neon-blue/20">
                <Server className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{serverName}</p>
                <p className="text-sm text-foreground-muted">{serverConfig.type.toUpperCase()} Server</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">OS</span>
                <span className="text-foreground">{serverConfig.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">CPU</span>
                <span className="text-foreground">{serverConfig.cpuCores} cores</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">RAM</span>
                <span className="text-foreground">{serverConfig.ram} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Storage</span>
                <span className="text-foreground">{serverConfig.storage} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Provider</span>
                <span className="text-foreground capitalize">{serverConfig.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Region</span>
                <span className="text-foreground">{serverConfig.region}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="glass rounded-xl p-4 space-y-3">
            <p className="text-sm text-foreground-muted font-medium">Payment Details</p>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Monthly Cost</span>
              <span className="font-semibold text-foreground">${costUSD}/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">First Month Payment</span>
              <div className="text-right">
                <p className="font-bold text-lg text-neon-blue">{costETH.toFixed(6)} {currentChain?.symbol || 'ETH'}</p>
                <p className="text-xs text-foreground-muted">≈ ${costUSD}</p>
              </div>
            </div>
            <div className="border-t border-glass-border pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-foreground-muted text-sm">Your Balance</span>
                <span className={`font-mono ${hasEnoughBalance ? 'text-success' : 'text-error'}`}>
                  {balanceNum.toFixed(4)} {currentChain?.symbol || 'ETH'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-muted text-sm">Payment To</span>
                <button 
                  onClick={copyWalletAddress}
                  className="flex items-center gap-1.5 font-mono text-xs text-neon-blue hover:text-neon-purple transition-colors"
                >
                  {PLATFORM_WALLET.slice(0, 6)}...{PLATFORM_WALLET.slice(-4)}
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex items-center justify-center">
            <Badge variant="purple" size="md">
              <div className="w-2 h-2 rounded-full bg-neon-green mr-2" />
              Paying on {currentChain?.name || 'Ethereum'}
            </Badge>
          </div>

          {!hasEnoughBalance && (
            <div className="glass rounded-xl p-4 border border-error/30 bg-error/5 text-center">
              <p className="text-error font-medium">Insufficient Balance</p>
              <p className="text-sm text-foreground-muted">
                You need {costETH.toFixed(6)} {currentChain?.symbol} but only have {balanceNum.toFixed(4)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayAndDeploy}
              disabled={!hasEnoughBalance || isSending}
              leftIcon={<Wallet className="w-4 h-4" />}
            >
              Pay & Deploy
            </Button>
          </div>
        </div>
      )}

      {step === 'signing' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto">
            <Wallet className="w-10 h-10 text-neon-blue animate-pulse" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Check Your Wallet</p>
            <p className="text-foreground-muted">
              Please confirm the transaction in MetaMask to proceed with deployment.
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted">Transaction Amount</p>
            <p className="text-xl font-bold text-neon-blue">
              {costETH.toFixed(6)} {currentChain?.symbol || 'ETH'}
            </p>
          </div>
        </div>
      )}

      {step === 'pending' && (
        <div className="text-center py-8 space-y-6">
          <div className="w-20 h-20 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Deploying Your Server</p>
            <p className="text-foreground-muted">
              Transaction submitted. Setting up your server on {serverConfig.provider}...
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress value={deployProgress} size="lg" />
            <p className="text-sm text-foreground-muted">{Math.round(deployProgress)}% complete</p>
          </div>

          {txHash && (
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-foreground-muted mb-2">Transaction Hash</p>
              <a
                href={`${currentChain?.explorer}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-neon-blue hover:underline font-mono text-sm"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          <p className="text-xs text-foreground-muted">
            This may take a few minutes. Please don&apos;t close this window.
          </p>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Server Deployed!</p>
            <p className="text-foreground-muted">
              Your {serverName} is now running on {serverConfig.provider}.
            </p>
          </div>
          
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Payment</span>
              <span className="text-success font-medium">Confirmed ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Amount</span>
              <span className="text-foreground">{costETH.toFixed(6)} {currentChain?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Network</span>
              <span className="text-foreground">{currentChain?.name}</span>
            </div>
          </div>

          {txHash && (
            <a
              href={`${currentChain?.explorer}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neon-blue hover:underline text-sm"
            >
              View on {currentChain?.name === 'Ethereum' ? 'Etherscan' : 'Explorer'}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-foreground-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to server details...
          </div>
        </div>
      )}

      {step === 'error' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-error" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Deployment Failed</p>
            <p className="text-foreground-muted">
              {sendError?.message || confirmError?.message || 'Transaction was rejected or failed.'}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => {
              setStep('confirm');
              resetSend();
            }}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

