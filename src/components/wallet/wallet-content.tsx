'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
  RefreshCw,
  Check,
  AlertCircle,
  Clock,
  Gift,
  Building2,
  ArrowRightLeft,
  Sparkles,
  Link2,
  Send,
} from 'lucide-react';
import { useAccount, useBalance, useChainId, useConnect } from 'wagmi';
import { formatEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { WalletButton } from '@/components/web3/wallet-button';
import { SendTransaction } from '@/components/web3/send-transaction';
import { TransactionHistory } from '@/components/web3/transaction-history';
import { useWalletStore, formatBalance } from '@/stores/wallet-store';
import { useUIStore } from '@/stores/ui-store';
import { chainInfo } from '@/config/wagmi';

const tokenOptions = [
  { value: 'eth', label: 'ETH' },
  { value: 'usdc', label: 'USDC' },
  { value: 'usdt', label: 'USDT' },
];

export default function WalletContent() {
  // Real Web3 wallet state from wagmi
  const { address, isConnected: isWeb3Connected } = useAccount();
  const chainId = useChainId();
  const { data: ethBalance } = useBalance({ address });
  const { connectors, connect, isPending } = useConnect();
  const currentChain = chainId ? chainInfo[chainId] : null;

  // Platform wallet state (simulated credits for services)
  const {
    platformBalance,
    transactions,
    depositToPlatform,
    simulateAirdrop,
    externalBalance,
  } = useWalletStore();
  const { addToast } = useUIStore();
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showAirdropModal, setShowAirdropModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositToken, setDepositToken] = useState<'eth' | 'usdc' | 'usdt'>('usdc');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      addToast({
        type: 'success',
        title: 'Address Copied',
        message: 'Wallet address copied to clipboard',
      });
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (externalBalance[depositToken] < amount) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `You don't have enough ${depositToken.toUpperCase()} in your wallet`,
      });
      return;
    }

    setIsDepositing(true);
    try {
      await depositToPlatform(amount, depositToken);
      addToast({
        type: 'success',
        title: 'Deposit Successful',
        message: `${amount} ${depositToken.toUpperCase()} deposited to platform wallet`,
      });
      setShowDepositModal(false);
      setDepositAmount('');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Deposit Failed',
        message: 'Transaction failed. Please try again.',
      });
    }
    setIsDepositing(false);
  };

  const handleAirdrop = async () => {
    setIsAirdropping(true);
    try {
      await simulateAirdrop();
      addToast({
        type: 'success',
        title: '🎉 Credits Received!',
        message: 'You received 100 USDC and 0.1 ETH in promotional credits!',
      });
      setShowAirdropModal(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed',
        message: 'Could not claim credits. Please try again.',
      });
    }
    setIsAirdropping(false);
  };

  // Calculate total platform balance in USD (mock prices)
  const ethPrice = 2000;
  const totalPlatformUSD = 
    platformBalance.eth * ethPrice + 
    platformBalance.usdc + 
    platformBalance.usdt;

  // Real ETH balance from connected wallet
  const realEthBalance = ethBalance ? parseFloat(formatEther(ethBalance.value)) : 0;

  if (!isWeb3Connected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-foreground-muted">Connect your Web3 wallet to manage payments</p>
        </div>

        <Card padding="lg" className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-neon-blue" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
          <p className="text-foreground-muted mb-6">
            Link your Web3 wallet to pay for services, view transactions, and manage your balance.
          </p>
          
          {/* Wallet Options */}
          <div className="space-y-3 max-w-xs mx-auto">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full flex items-center gap-3 p-4 rounded-xl glass hover:bg-glass-hover transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-glass-hover flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-neon-blue" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground">{connector.name}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="glass rounded-xl p-4 border border-neon-blue/30">
          <div className="flex items-center gap-3">
            <Link2 className="w-5 h-5 text-neon-blue" />
            <div>
              <p className="font-medium text-foreground">Real Web3 Integration</p>
              <p className="text-sm text-foreground-muted">
                This connects to your actual MetaMask or other Web3 wallet!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-foreground-muted">Manage your Web3 wallet and platform credits</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowSendModal(true)}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send Crypto
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAirdropModal(true)}
            leftIcon={<Gift className="w-4 h-4" />}
            className="border-neon-green text-neon-green hover:bg-neon-green/10"
          >
            Get Free Credits
          </Button>
          <WalletButton />
        </div>
      </div>

      {/* Connected Wallet Card - Real Web3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="glow" padding="lg" className="bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-purple/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-neon-green font-medium">Live Web3 Connection</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-foreground-muted mb-1">Connected Wallet</p>
              <div className="flex items-center gap-3">
                <p className="font-mono text-lg text-foreground">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                </p>
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
            <div className="flex items-center gap-4">
              <Badge variant="purple" size="md">
                {currentChain?.name || 'Unknown Network'}
              </Badge>
              <div className="text-right">
                <p className="text-sm text-foreground-muted">Real Balance</p>
                <p className="font-mono text-lg text-foreground">
                  {realEthBalance.toFixed(4)} {currentChain?.symbol || 'ETH'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Two Wallet Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Wallet (Company Credits) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg" className="border-2 border-neon-blue/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-neon-blue/20">
                <Building2 className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Platform Wallet</h3>
                <p className="text-sm text-foreground-muted">Credits for NeuralCloud services</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground-muted mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-neon-blue">${formatBalance(totalPlatformUSD, 2)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-xs font-bold text-neon-blue">Ξ</span>
                  <span className="text-foreground">ETH</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(platformBalance.eth)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">$</span>
                  <span className="text-foreground">USDC</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(platformBalance.usdc, 2)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple">₮</span>
                  <span className="text-foreground">USDT</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(platformBalance.usdt, 2)}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={() => setShowDepositModal(true)}
              leftIcon={<ArrowDownLeft className="w-4 h-4" />}
            >
              Deposit to Platform
            </Button>
          </Card>
        </motion.div>

        {/* External Wallet (Simulated for demo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-neon-purple/20">
                <Wallet className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Simulated Balance</h3>
                <p className="text-sm text-foreground-muted">For demo deposits to platform</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground-muted mb-1">Demo Balance (USD)</p>
              <p className="text-3xl font-bold text-neon-purple">
                ${formatBalance(externalBalance.eth * ethPrice + externalBalance.usdc + externalBalance.usdt, 2)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-xs font-bold text-neon-blue">Ξ</span>
                  <span className="text-foreground">ETH</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(externalBalance.eth)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-glass-border">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">$</span>
                  <span className="text-foreground">USDC</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(externalBalance.usdc, 2)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple">₮</span>
                  <span className="text-foreground">USDT</span>
                </div>
                <span className="font-mono text-foreground">{formatBalance(externalBalance.usdt, 2)}</span>
              </div>
            </div>

            <p className="text-xs text-foreground-muted mt-4 text-center">
              Use this simulated balance to test platform deposits
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Real Blockchain Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TransactionHistory />
      </motion.div>

      {/* Platform Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-glass-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Platform Transactions</h3>
              <p className="text-sm text-foreground-muted">Internal platform credit movements</p>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>
          </div>
          <div className="divide-y divide-glass-border max-h-[400px] overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-foreground-muted">
                No platform transactions yet
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 hover:bg-glass-hover transition-colors"
                >
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${tx.type === 'deposit' ? 'bg-success/20' : ''}
                    ${tx.type === 'credit' ? 'bg-neon-green/20' : ''}
                    ${tx.type === 'payment' ? 'bg-neon-blue/20' : ''}
                    ${tx.type === 'refund' ? 'bg-neon-purple/20' : ''}
                  `}>
                    {tx.type === 'deposit' && <ArrowDownLeft className="w-5 h-5 text-success" />}
                    {tx.type === 'credit' && <Gift className="w-5 h-5 text-neon-green" />}
                    {tx.type === 'payment' && <ArrowUpRight className="w-5 h-5 text-neon-blue" />}
                    {tx.type === 'refund' && <RefreshCw className="w-5 h-5 text-neon-purple" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <p className="text-sm text-foreground-muted truncate font-mono">{tx.hash.slice(0, 18)}...</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'deposit' || tx.type === 'credit' || tx.type === 'refund' 
                        ? 'text-success' 
                        : 'text-foreground'
                    }`}>
                      {tx.type === 'payment' ? '-' : '+'}{tx.amount} {tx.token}
                    </p>
                    <Badge
                      variant={
                        tx.status === 'confirmed' ? 'success' :
                        tx.status === 'pending' ? 'warning' : 'error'
                      }
                      size="sm"
                    >
                      {tx.status === 'confirmed' && <Check className="w-3 h-3 mr-1" />}
                      {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {tx.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Deposit to Platform Wallet"
      >
        <div className="space-y-4">
          <p className="text-foreground-muted">
            Transfer funds from your simulated balance to your NeuralCloud platform wallet.
          </p>
          
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted mb-2">Available (Simulated)</p>
            <div className="flex gap-4 text-sm">
              <span className="text-foreground">{formatBalance(externalBalance.eth)} ETH</span>
              <span className="text-foreground">{formatBalance(externalBalance.usdc, 2)} USDC</span>
              <span className="text-foreground">{formatBalance(externalBalance.usdt, 2)} USDT</span>
            </div>
          </div>

          <Select
            label="Token"
            options={tokenOptions}
            value={depositToken}
            onChange={(e) => setDepositToken(e.target.value as 'eth' | 'usdc' | 'usdt')}
          />

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            rightIcon={
              <button
                onClick={() => setDepositAmount(externalBalance[depositToken].toString())}
                className="text-xs text-neon-blue hover:underline"
              >
                MAX
              </button>
            }
          />

          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowDepositModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleDeposit}
              isLoading={isDepositing}
              leftIcon={<ArrowRightLeft className="w-4 h-4" />}
            >
              Deposit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Airdrop/Free Credits Modal */}
      <Modal
        isOpen={showAirdropModal}
        onClose={() => setShowAirdropModal(false)}
        title="🎁 Get Free Credits"
      >
        <div className="space-y-4">
          <div className="glass rounded-xl p-6 text-center">
            <Sparkles className="w-12 h-12 text-neon-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Welcome Bonus!</h3>
            <p className="text-foreground-muted mb-4">
              Claim your free promotional credits to try our decentralized compute services.
            </p>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-blue">0.1 ETH</p>
                <p className="text-sm text-foreground-muted">Free Credits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-green">100 USDC</p>
                <p className="text-sm text-foreground-muted">Free Credits</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground-muted text-center">
            Credits will be added directly to your platform wallet.
          </p>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowAirdropModal(false)}
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1"
              onClick={handleAirdrop}
              isLoading={isAirdropping}
              leftIcon={<Gift className="w-4 h-4" />}
            >
              Claim Credits
            </Button>
          </div>
        </div>
      </Modal>

      {/* Real Transaction Send Modal */}
      <SendTransaction 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
      />
    </div>
  );
}

