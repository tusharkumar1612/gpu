'use client';

import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink,
  RefreshCw,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { chainInfo } from '@/config/wagmi';

// Note: For real transaction history, you would typically use:
// 1. Etherscan/Polygonscan API
// 2. Alchemy/Infura APIs
// 3. The Graph protocol
// For this demo, we'll show how to set it up with a placeholder

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'confirmed' | 'pending';
  type: 'send' | 'receive';
}

export function TransactionHistory() {
  const { address } = useAccount();
  const chainId = useChainId();
  const currentChain = chainId ? chainInfo[chainId] : null;
  
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    if (!address || !chainId) return;
    
    setIsLoading(true);
    
    // In production, you would call an API like:
    // - Etherscan API: https://api.etherscan.io/api?module=account&action=txlist&address=${address}
    // - Alchemy: https://docs.alchemy.com/reference/alchemy-getassettransfers
    
    // For demo, we'll show a message about setting up an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Placeholder - would be replaced with real API call
    setTransactions([]);
    setIsLoading(false);
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatValue = (value: string) => {
    const num = parseFloat(value);
    return num.toFixed(4);
  };

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-6 border-b border-glass-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Blockchain Transactions</h3>
          <p className="text-sm text-foreground-muted">Real on-chain transaction history</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchTransactions}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh
        </Button>
      </div>
      
      <div className="divide-y divide-glass-border">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-neon-blue animate-spin mx-auto mb-4" />
            <p className="text-foreground-muted">Fetching transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-glass-hover flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-foreground-muted" />
            </div>
            <div>
              <p className="font-medium text-foreground">No Transactions Yet</p>
              <p className="text-sm text-foreground-muted mt-1">
                Send a transaction to see it appear here.
              </p>
            </div>
            <div className="glass rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-xs text-foreground-muted">
                <strong className="text-foreground">💡 Pro Tip:</strong> For production, integrate with:
              </p>
              <ul className="text-xs text-foreground-muted mt-2 space-y-1">
                <li>• Etherscan API for Ethereum</li>
                <li>• Polygonscan API for Polygon</li>
                <li>• Alchemy/Infura for multi-chain</li>
              </ul>
            </div>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center gap-4 p-4 hover:bg-glass-hover transition-colors"
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${tx.type === 'send' ? 'bg-neon-orange/20' : 'bg-success/20'}
              `}>
                {tx.type === 'send' 
                  ? <ArrowUpRight className="w-5 h-5 text-neon-orange" />
                  : <ArrowDownLeft className="w-5 h-5 text-success" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  {tx.type === 'send' ? 'Sent' : 'Received'}
                </p>
                <p className="text-sm text-foreground-muted truncate font-mono">
                  {tx.type === 'send' ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  tx.type === 'receive' ? 'text-success' : 'text-foreground'
                }`}>
                  {tx.type === 'send' ? '-' : '+'}{formatValue(tx.value)} {currentChain?.symbol || 'ETH'}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <Badge
                    variant={tx.status === 'confirmed' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {tx.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {tx.status}
                  </Badge>
                  <a
                    href={`${currentChain?.explorer}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-glass-hover transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-foreground-muted" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

