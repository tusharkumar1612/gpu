'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Cpu,
  Gpu,
  Server,
  HardDrive,
  Globe,
  Check,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { useServerStore, ServerConfig, ServerType, OSType, ProviderType } from '@/stores/server-store';
import { useWalletStore, formatBalance } from '@/stores/wallet-store';
import { useUIStore } from '@/stores/ui-store';

// Dynamic import for Web3 payment component
const DeployPayment = dynamic(
  () => import('@/components/web3/deploy-payment').then(mod => ({ default: mod.DeployPayment })),
  { ssr: false }
);

// Dynamic import for Web3 connection check
const Web3DeployButton = dynamic(
  () => import('@/components/web3/deploy-button'),
  { ssr: false, loading: () => (
    <Button size="lg" disabled>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Loading...
    </Button>
  )}
);

const steps = [
  { id: 1, title: 'Server Type', icon: Server },
  { id: 2, title: 'Configuration', icon: HardDrive },
  { id: 3, title: 'Provider', icon: Globe },
  { id: 4, title: 'Review & Deploy', icon: Check },
];

const serverTypes = [
  {
    type: 'cpu' as ServerType,
    icon: Cpu,
    title: 'CPU Server',
    description: 'General purpose compute for web apps, APIs, and databases',
    startingPrice: '$25/mo',
  },
  {
    type: 'gpu' as ServerType,
    icon: Gpu,
    title: 'GPU Server',
    description: 'High-performance compute for ML/AI, rendering, and scientific computing',
    startingPrice: '$150/mo',
  },
];

const osOptions = [
  { value: 'ubuntu', label: 'Ubuntu 22.04 LTS' },
  { value: 'debian', label: 'Debian 12' },
  { value: 'centos', label: 'CentOS Stream 9' },
];

const gpuOptions = [
  { value: 'nvidia-a100', label: 'NVIDIA A100 40GB' },
  { value: 'nvidia-h100', label: 'NVIDIA H100 80GB' },
  { value: 'nvidia-rtx4090', label: 'NVIDIA RTX 4090' },
  { value: 'nvidia-a10', label: 'NVIDIA A10' },
];

const providers = [
  {
    id: 'fluence' as ProviderType,
    name: 'Fluence Network',
    description: 'Decentralized compute network with global distribution',
    regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    badge: 'Popular',
  },
  {
    id: 'akash' as ProviderType,
    name: 'Akash Network',
    description: 'Open-source supercloud for DePIN',
    regions: ['us-west-2', 'eu-central-1', 'ap-northeast-1'],
    badge: null,
  },
  {
    id: 'filecoin' as ProviderType,
    name: 'Filecoin Compute',
    description: 'Compute layer for the Filecoin network',
    regions: ['us-east-1', 'eu-west-1'],
    badge: 'New',
  },
  {
    id: 'custom' as ProviderType,
    name: 'Custom Node',
    description: 'Connect your own hardware to the network',
    regions: ['custom'],
    badge: null,
  },
];

const regionOptions = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
];

export default function CreateServerPage() {
  const router = useRouter();
  const { createServer, isLoading } = useServerStore();
  const { platformBalance, payFromPlatform } = useWalletStore();
  const { addToast } = useUIStore();
  
  // Calculate total platform balance in USD
  const ethPrice = 2000;
  const totalPlatformUSD = platformBalance.eth * ethPrice + platformBalance.usdc + platformBalance.usdt;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBlockchainPayment, setShowBlockchainPayment] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [generatedServerName, setGeneratedServerName] = useState('');
  
  const [config, setConfig] = useState<ServerConfig>({
    type: 'cpu',
    os: 'ubuntu',
    cpuCores: 4,
    ram: 16,
    storage: 100,
    bandwidth: 250,
    provider: 'fluence',
    region: 'us-east-1',
  });

  const calculateCost = () => {
    let cost = 0;
    cost += config.cpuCores * 5;
    cost += config.ram * 2;
    cost += config.storage * 0.1;
    cost += config.bandwidth * 0.05;
    if (config.gpuCount) {
      cost += config.gpuCount * 150;
    }
    return Math.round(cost);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = () => {
    // Generate a server name
    const serverName = `${config.type.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedServerName(serverName);
    setShowBlockchainPayment(true);
  };
  
  const handleBlockchainPaymentSuccess = async (txHash: string) => {
    try {
      const newServer = await createServer(config);
      
      // Record the transaction hash with the server
      console.log('Server deployed with tx:', txHash);
      
      addToast({
        type: 'success',
        title: 'Server Deployed!',
        message: `${newServer.name} is now running. Payment confirmed on blockchain.`,
      });
      
      router.push(`/dashboard/servers/${newServer.id}`);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Server Creation Failed',
        message: 'Payment was successful but server creation failed. Please contact support.',
      });
    }
  };

  const confirmDeployment = async () => {
    const cost = calculateCost();
    
    // Check if user has enough platform balance (using USDC)
    if (platformBalance.usdc < cost) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `You need at least $${cost} USDC in your platform wallet. Current: $${formatBalance(platformBalance.usdc, 2)}`,
      });
      return;
    }
    
    setIsDeploying(true);
    setDeploymentProgress(0);

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const newServer = await createServer(config);
      
      // Pay from platform wallet
      const paymentSuccess = payFromPlatform(cost, 'usdc', `Server deployment - ${newServer.name}`);
      
      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }

      clearInterval(interval);
      setDeploymentProgress(100);
      
      setTimeout(() => {
        setShowPaymentModal(false);
        addToast({
          type: 'success',
          title: 'Server Deployed!',
          message: `${newServer.name} is now running. $${cost} USDC deducted.`,
        });
        router.push(`/dashboard/servers/${newServer.id}`);
      }, 1000);
    } catch {
      clearInterval(interval);
      addToast({
        type: 'error',
        title: 'Deployment Failed',
        message: 'Something went wrong. Please try again.',
      });
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Server</h1>
        <p className="text-foreground-muted">Deploy a new decentralized compute instance</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${currentStep >= step.id
                    ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white'
                    : 'bg-glass-bg border border-glass-border text-foreground-muted'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-foreground' : 'text-foreground-muted'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-neon-blue' : 'bg-glass-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Server Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Select Server Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serverTypes.map((server) => (
                  <Card
                    key={server.type}
                    variant="interactive"
                    padding="lg"
                    className={`cursor-pointer ${
                      config.type === server.type ? 'border-2 border-neon-blue glow-blue' : ''
                    }`}
                    onClick={() => setConfig({ ...config, type: server.type, gpuType: undefined, gpuCount: undefined })}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${config.type === server.type ? 'bg-neon-blue/20' : 'bg-glass-hover'}`}>
                        <server.icon className={`w-8 h-8 ${config.type === server.type ? 'text-neon-blue' : 'text-foreground-muted'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{server.title}</h3>
                        <p className="text-sm text-foreground-muted mt-1">{server.description}</p>
                        <p className="text-sm text-neon-blue mt-2">Starting from {server.startingPrice}</p>
                      </div>
                      {config.type === server.type && (
                        <Check className="w-5 h-5 text-neon-blue" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Configure Your Server</h2>
              
              <Card padding="lg">
                <div className="space-y-6">
                  <Select
                    label="Operating System"
                    options={osOptions}
                    value={config.os}
                    onChange={(e) => setConfig({ ...config, os: e.target.value as OSType })}
                  />

                  <Slider
                    label="CPU Cores"
                    min={1}
                    max={64}
                    step={1}
                    value={config.cpuCores}
                    unit=" cores"
                    onChange={(e) => setConfig({ ...config, cpuCores: Number(e.target.value) })}
                  />

                  <Slider
                    label="RAM"
                    min={4}
                    max={512}
                    step={4}
                    value={config.ram}
                    unit=" GB"
                    onChange={(e) => setConfig({ ...config, ram: Number(e.target.value) })}
                  />

                  <Slider
                    label="Storage (NVMe SSD)"
                    min={50}
                    max={2000}
                    step={50}
                    value={config.storage}
                    unit=" GB"
                    onChange={(e) => setConfig({ ...config, storage: Number(e.target.value) })}
                  />

                  <Slider
                    label="Bandwidth"
                    min={100}
                    max={10000}
                    step={100}
                    value={config.bandwidth}
                    unit=" Mbps"
                    onChange={(e) => setConfig({ ...config, bandwidth: Number(e.target.value) })}
                  />

                  {config.type === 'gpu' && (
                    <>
                      <Select
                        label="GPU Type"
                        options={gpuOptions}
                        value={config.gpuType || 'nvidia-a100'}
                        onChange={(e) => setConfig({ ...config, gpuType: e.target.value })}
                      />

                      <Slider
                        label="GPU Count"
                        min={1}
                        max={8}
                        step={1}
                        value={config.gpuCount || 1}
                        unit=" GPU(s)"
                        onChange={(e) => setConfig({ ...config, gpuCount: Number(e.target.value) })}
                      />
                    </>
                  )}
                </div>
              </Card>

              {/* Cost Estimate */}
              <Card variant="bordered" padding="md">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted">Estimated Monthly Cost</span>
                  <span className="text-2xl font-bold text-neon-blue">${calculateCost()}/mo</span>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Provider */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Select Provider & Region</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <Card
                    key={provider.id}
                    variant="interactive"
                    padding="md"
                    className={`cursor-pointer ${
                      config.provider === provider.id ? 'border-2 border-neon-blue glow-blue' : ''
                    }`}
                    onClick={() => setConfig({ ...config, provider: provider.id, region: provider.regions[0] })}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{provider.name}</h3>
                          {provider.badge && (
                            <Badge variant={provider.badge === 'Popular' ? 'blue' : 'success'}>
                              {provider.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground-muted mt-1">{provider.description}</p>
                        <p className="text-xs text-foreground-muted mt-2">
                          {provider.regions.length} region(s) available
                        </p>
                      </div>
                      {config.provider === provider.id && (
                        <Check className="w-5 h-5 text-neon-blue flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Card padding="lg">
                <Select
                  label="Region"
                  options={regionOptions.filter(r => 
                    providers.find(p => p.id === config.provider)?.regions.includes(r.value) ||
                    config.provider === 'custom'
                  )}
                  value={config.region}
                  onChange={(e) => setConfig({ ...config, region: e.target.value })}
                />
              </Card>
            </div>
          )}

          {/* Step 4: Review & Deploy */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Review & Deploy</h2>
              
              <Card padding="lg">
                <h3 className="font-semibold text-foreground mb-4">Server Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-muted">Server Type</p>
                    <p className="font-medium text-foreground capitalize">{config.type} Server</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Operating System</p>
                    <p className="font-medium text-foreground capitalize">{config.os}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">CPU Cores</p>
                    <p className="font-medium text-foreground">{config.cpuCores} cores</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">RAM</p>
                    <p className="font-medium text-foreground">{config.ram} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Storage</p>
                    <p className="font-medium text-foreground">{config.storage} GB NVMe</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Bandwidth</p>
                    <p className="font-medium text-foreground">{config.bandwidth} Mbps</p>
                  </div>
                  {config.type === 'gpu' && (
                    <>
                      <div>
                        <p className="text-sm text-foreground-muted">GPU Type</p>
                        <p className="font-medium text-foreground">{config.gpuType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground-muted">GPU Count</p>
                        <p className="font-medium text-foreground">{config.gpuCount} GPU(s)</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm text-foreground-muted">Provider</p>
                    <p className="font-medium text-foreground capitalize">{config.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">Region</p>
                    <p className="font-medium text-foreground">{config.region}</p>
                  </div>
                </div>
              </Card>

              <Card variant="glow" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-foreground">Total Cost</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-neon-blue">${calculateCost()}</p>
                    <p className="text-sm text-foreground-muted">per month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-foreground-muted">
                  <span>≈ {(calculateCost() * 0.0005).toFixed(4)} ETH</span>
                  <span>Billed monthly</span>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-glass-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue
          </Button>
        ) : (
          <Web3DeployButton onDeploy={handleDeploy} />
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => !isDeploying && setShowPaymentModal(false)}
        title="Confirm Deployment"
        size="md"
      >
        {!isDeploying ? (
          <div className="space-y-6">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground-muted">Monthly Cost</span>
                <span className="font-semibold text-foreground">${calculateCost()}/mo</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground-muted">Pay with</span>
                <span className="font-mono text-neon-green">{calculateCost()} USDC</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                <span className="text-foreground-muted">Platform Balance</span>
                <span className={`font-mono ${platformBalance.usdc >= calculateCost() ? 'text-success' : 'text-error'}`}>
                  {formatBalance(platformBalance.usdc, 2)} USDC
                </span>
              </div>
            </div>

            {platformBalance.usdc < calculateCost() && (
              <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-sm text-error">
                Insufficient balance. Please deposit more funds to your platform wallet.
              </div>
            )}

            <div className="text-sm text-foreground-muted">
              <p>By confirming, you agree to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Monthly billing from platform wallet</li>
                <li>Smart contract payment terms</li>
                <li>Provider service agreement</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={confirmDeployment}
                leftIcon={<Wallet className="w-4 h-4" />}
                disabled={platformBalance.usdc < calculateCost()}
              >
                Confirm & Pay
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center">
              {deploymentProgress < 100 ? (
                <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
              <p className="mt-4 font-semibold text-foreground">
                {deploymentProgress < 100 ? 'Deploying Server...' : 'Deployment Complete!'}
              </p>
              <p className="text-sm text-foreground-muted mt-1">
                {deploymentProgress < 100 
                  ? 'This may take a few moments' 
                  : 'Redirecting to server details...'}
              </p>
            </div>
            <Progress value={Math.min(deploymentProgress, 100)} />
          </div>
        )}
      </Modal>

      {/* Real Blockchain Payment Modal */}
      <DeployPayment
        isOpen={showBlockchainPayment}
        onClose={() => setShowBlockchainPayment(false)}
        onSuccess={handleBlockchainPaymentSuccess}
        serverName={generatedServerName}
        costUSD={calculateCost()}
        serverConfig={{
          type: config.type,
          os: config.os,
          cpuCores: config.cpuCores,
          ram: config.ram,
          storage: config.storage,
          provider: config.provider,
          region: config.region,
        }}
      />
    </div>
  );
}

