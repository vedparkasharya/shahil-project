import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { getStats } from '@/lib/spamDetector';

export default function StatsSection() {
  const [stats, setStats] = useState({ total: 0, spamCount: 0, hamCount: 0, avgConfidence: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats());
    }, 1000);
    setStats(getStats());
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: 'Total Scanned',
      value: stats.total,
      icon: Mail,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      label: 'Spam Detected',
      value: stats.spamCount,
      icon: ShieldAlert,
      gradient: 'from-red-500/10 to-orange-500/10',
      iconColor: 'text-red-400',
      border: 'border-red-500/20',
    },
    {
      label: 'Legitimate',
      value: stats.hamCount,
      icon: ShieldCheck,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-400',
      border: 'border-green-500/20',
    },
    {
      label: 'Avg Confidence',
      value: stats.avgConfidence > 0 ? `${stats.avgConfidence}%` : '0%',
      icon: Activity,
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Live Statistics</h2>
          <p className="text-gray-400">Real-time detection activity on your device</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl bg-gradient-to-br ${card.gradient} border ${card.border} backdrop-blur-sm p-5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.iconColor} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
