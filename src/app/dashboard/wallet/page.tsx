'use client';

import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

// Dynamically import the wallet content to avoid SSR issues with wagmi
const WalletContent = dynamic(
  () => import('@/components/wallet/wallet-content'),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <p className="text-foreground-muted">Loading wallet...</p>
        </div>
        <Card padding="lg" className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Wallet className="w-10 h-10 text-neon-blue" />
          </div>
          <div className="h-6 bg-glass-bg rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-glass-bg rounded w-64 mx-auto animate-pulse" />
        </Card>
      </div>
    )
  }
);

export default function WalletPage() {
  return <WalletContent />;
}
