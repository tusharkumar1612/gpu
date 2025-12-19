'use client';

import { useState, useEffect } from 'react';
import { 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
  useChainId,
  useEstimateGas
} from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  AlertTriangle,
  Fuel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { chainInfo } from '@/config/wagmi';

interface SendTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendTransaction({ isOpen, onClose }: SendTransactionProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const currentChain = chainId ? chainInfo[chainId] : null;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'confirming' | 'success' | 'error'>('form');

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

  // Estimate gas
  const { data: gasEstimate } = useEstimateGas({
    to: isAddress(recipient) ? recipient as `0x${string}` : undefined,
    value: amount ? parseEther(amount) : undefined,
  });

  // Handle transaction states
  useEffect(() => {
    if (isSending) {
      setStep('confirming');
    }
    if (isConfirmed) {
      setStep('success');
    }
    if (isSendError || isConfirmError) {
      setStep('error');
    }
  }, [isSending, isConfirmed, isSendError, isConfirmError]);

  const handleSend = () => {
    if (!isAddress(recipient)) {
      return;
    }
    
    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    });
  };

  const handleClose = () => {
    setRecipient('');
    setAmount('');
    setStep('form');
    resetSend();
    onClose();
  };

  const isValidRecipient = recipient === '' || isAddress(recipient);
  const amountNum = parseFloat(amount) || 0;
  const balanceNum = balance ? parseFloat(formatEther(balance.value)) : 0;
  const hasEnoughBalance = amountNum <= balanceNum && amountNum > 0;
  const canSend = isAddress(recipient) && hasEnoughBalance && !isSending;

  // Estimated gas cost in ETH
  const estimatedGas = gasEstimate ? parseFloat(formatEther(gasEstimate * BigInt(30000000000))) : 0; // ~30 gwei

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? '💸 Send Crypto' : step === 'confirming' ? '⏳ Transaction Pending' : step === 'success' ? '✅ Transaction Sent!' : '❌ Transaction Failed'}
    >
      {step === 'form' && (
        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="glass rounded-xl p-4 border border-warning/30 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Real Transaction Warning</p>
                <p className="text-sm text-foreground-muted">
                  This will send real {currentChain?.symbol || 'ETH'} from your wallet. Make sure the recipient address is correct!
                </p>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-foreground-muted mb-1">Your Balance</p>
            <p className="text-xl font-bold text-foreground">
              {balanceNum.toFixed(6)} {currentChain?.symbol || 'ETH'}
            </p>
            <Badge variant="purple" size="sm" className="mt-2">
              {currentChain?.name || 'Unknown Network'}
            </Badge>
          </div>

          {/* Recipient Input */}
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={!isValidRecipient ? 'Invalid Ethereum address' : undefined}
          />

          {/* Amount Input */}
          <Input
            label="Amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={amount && !hasEnoughBalance ? 'Insufficient balance' : undefined}
            rightIcon={
              <button
                onClick={() => setAmount((balanceNum - 0.001).toFixed(6))} // Leave some for gas
                className="text-xs text-neon-blue hover:underline"
              >
                MAX
              </button>
            }
          />

          {/* Gas Estimate */}
          {gasEstimate && (
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <Fuel className="w-4 h-4" />
              <span>Estimated gas: ~{estimatedGas.toFixed(6)} {currentChain?.symbol || 'ETH'}</span>
            </div>
          )}

          {/* Summary */}
          {canSend && (
            <div className="glass rounded-xl p-4 space-y-2">
              <p className="text-sm text-foreground-muted">Transaction Summary</p>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Sending</span>
                <span className="font-mono text-foreground">{amount} {currentChain?.symbol || 'ETH'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">To</span>
                <span className="font-mono text-foreground text-sm">{recipient.slice(0, 6)}...{recipient.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Network</span>
                <span className="text-foreground">{currentChain?.name}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSend}
              disabled={!canSend}
              isLoading={isSending}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send Transaction
            </Button>
          </div>
        </div>
      )}

      {step === 'confirming' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {isConfirming ? 'Confirming Transaction...' : 'Waiting for Wallet...'}
            </p>
            <p className="text-foreground-muted">
              {isConfirming 
                ? 'Please wait while the transaction is being confirmed on the blockchain.'
                : 'Please confirm the transaction in your wallet.'}
            </p>
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
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Transaction Confirmed!</p>
            <p className="text-foreground-muted">
              Your {amount} {currentChain?.symbol || 'ETH'} has been sent successfully.
            </p>
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
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      )}

      {step === 'error' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-error" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Transaction Failed</p>
            <p className="text-foreground-muted">
              {sendError?.message || confirmError?.message || 'An error occurred while processing your transaction.'}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={handleClose}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => {
              setStep('form');
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


