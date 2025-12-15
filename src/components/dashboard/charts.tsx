'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Resource usage data
const resourceData = [
  { time: '00:00', cpu: 45, gpu: 60, ram: 55 },
  { time: '04:00', cpu: 52, gpu: 65, ram: 58 },
  { time: '08:00', cpu: 78, gpu: 82, ram: 72 },
  { time: '12:00', cpu: 85, gpu: 90, ram: 78 },
  { time: '16:00', cpu: 72, gpu: 78, ram: 68 },
  { time: '20:00', cpu: 58, gpu: 62, ram: 55 },
  { time: '24:00', cpu: 42, gpu: 52, ram: 48 },
];

// Cost over time data
const costData = [
  { month: 'Jul', cost: 420 },
  { month: 'Aug', cost: 580 },
  { month: 'Sep', cost: 650 },
  { month: 'Oct', cost: 720 },
  { month: 'Nov', cost: 890 },
  { month: 'Dec', cost: 1050 },
];

// Provider distribution data
const providerData = [
  { name: 'Fluence', value: 45, color: '#00d4ff' },
  { name: 'Akash', value: 30, color: '#a855f7' },
  { name: 'Filecoin', value: 15, color: '#22c55e' },
  { name: 'Custom', value: 10, color: '#f97316' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3">
        <p className="text-foreground font-medium mb-2">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.dataKey.toUpperCase()}: {item.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CostTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg p-3">
        <p className="text-foreground font-medium">{label}</p>
        <p className="text-neon-blue text-lg font-bold">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function ResourceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Resource Usage</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={resourceData}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#00d4ff"
              fill="url(#cpuGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="gpu"
              stroke="#a855f7"
              fill="url(#gpuGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="ram"
              stroke="#22c55e"
              fill="url(#ramGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neon-blue" />
          <span className="text-sm text-foreground-muted">CPU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neon-purple" />
          <span className="text-sm text-foreground-muted">GPU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neon-green" />
          <span className="text-sm text-foreground-muted">RAM</span>
        </div>
      </div>
    </motion.div>
  );
}

export function CostChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Cost Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CostTooltip />} />
            <Bar 
              dataKey="cost" 
              fill="url(#barGradient)" 
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function ProviderChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Provider Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={providerData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {providerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {providerData.map((provider) => (
          <div key={provider.name} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: provider.color }} 
            />
            <span className="text-sm text-foreground-muted">
              {provider.name} ({provider.value}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

