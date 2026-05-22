import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Trash2, History } from 'lucide-react';
import { getHistory, clearHistory, type DetectionResult } from '@/lib/spamDetector';

export default function RecentHistory() {
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(getHistory());
    }, 1000);
    setHistory(getHistory());
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (history.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-blue-400" />
              Recent Detections
            </h2>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </motion.button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {history.slice(0, 10).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  item.isSpam
                    ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30'
                    : 'bg-green-500/5 border-green-500/10 hover:border-green-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.isSpam ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">
                      {item.text.substring(0, 80)}{item.text.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm font-medium ${
                      item.isSpam ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {item.confidence}%
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/5"
                    >
                      <p className="text-sm text-gray-400 mb-2">{item.text}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Spam: {item.spamProbability}%</span>
                        <span>Ham: {item.hamProbability}%</span>
                        {item.indicators.length > 0 && (
                          <span>Indicators: {item.indicators.map(i => i.word).join(', ')}</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
