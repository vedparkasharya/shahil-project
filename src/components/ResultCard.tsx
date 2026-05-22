import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ShieldAlert, ShieldCheck, TrendingUp } from 'lucide-react';
import type { DetectionResult } from '@/lib/spamDetector';

interface ResultCardProps {
  result: DetectionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isSpam = result.isSpam;
  
  const getColorScheme = (spam: boolean) => {
    if (spam) {
      return {
        bg: 'from-red-500/10 to-orange-500/10',
        border: 'border-red-500/20',
        accent: 'text-red-400',
        bar: 'bg-red-500',
        icon: AlertTriangle,
        label: 'SPAM DETECTED',
        riskColor: 'text-red-400',
      };
    }
    return {
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/20',
      accent: 'text-green-400',
      bar: 'bg-green-500',
      icon: CheckCircle,
      label: 'LEGITIMATE EMAIL',
      riskColor: 'text-green-400',
    };
  };

  const colors = getColorScheme(isSpam);
  const Icon = colors.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm overflow-hidden`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <Icon className={`w-8 h-8 ${colors.accent}`} />
            </motion.div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-lg font-bold ${colors.accent}`}
              >
                {colors.label}
              </motion.div>
              <div className="text-sm text-gray-400">
                Confidence: {result.confidence}%
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${colors.accent}`}>
              {result.confidence}%
            </div>
            <div className="text-xs text-gray-400">confidence score</div>
          </div>
        </div>
      </div>

      {/* Probability Bars */}
      <div className="px-6 py-4 space-y-3">
        {/* Spam Probability */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Spam Probability
            </span>
            <span className="text-red-400 font-medium">{result.spamProbability}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.spamProbability}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Ham Probability */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Legitimate Probability
            </span>
            <span className="text-green-400 font-medium">{result.hamProbability}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.hamProbability}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      {result.indicators.length > 0 && (
        <div className="px-6 py-4 border-t border-white/10">
          <div className="text-sm text-gray-400 mb-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Key Indicators Detected
          </div>
          <div className="flex flex-wrap gap-2">
            {result.indicators.map((indicator, i) => (
              <motion.span
                key={indicator.word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  indicator.weight > 0
                    ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                    : 'bg-green-500/10 text-green-300 border border-green-500/20'
                }`}
              >
                {indicator.word}
                <span className={`ml-1 ${indicator.weight > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {indicator.weight > 0 ? '+' : ''}{indicator.weight.toFixed(2)}
                </span>
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
