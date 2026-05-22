import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Database, BarChart3, Layers, CheckCircle, XCircle,
  GitBranch, Cpu, Award
} from 'lucide-react';
import { getModelInfoSync, type ModelInfo } from '@/lib/spamDetector';

export default function About() {
  const [info, setInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    setInfo(getModelInfoSync());
  }, []);

  if (!info) return null;

  const confusionMatrix = info.confusion_matrix;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            About <span className="text-gradient">SpamShield</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A comprehensive email spam detection system built using machine learning 
            algorithms trained on real-world datasets.
          </p>
        </motion.div>

        {/* Model Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Model Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Algorithm', value: info.model_type, icon: Cpu },
              { label: 'Dataset Size', value: info.dataset_size.toLocaleString(), icon: Database },
              { label: 'Spam Samples', value: info.spam_count.toLocaleString(), icon: XCircle },
              { label: 'Ham Samples', value: info.ham_count.toLocaleString(), icon: CheckCircle },
              { label: 'Features', value: '3,000 (TF-IDF)', icon: Layers },
              { label: 'N-gram Range', value: '1-2 (Unigrams + Bigrams)', icon: GitBranch },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                <item.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Main Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Model Performance</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Accuracy', value: `${(info.accuracy * 100).toFixed(2)}%`, color: 'text-blue-400' },
                { label: 'Precision', value: `${(info.precision * 100).toFixed(2)}%`, color: 'text-green-400' },
                { label: 'Recall', value: `${(info.recall * 100).toFixed(2)}%`, color: 'text-purple-400' },
                { label: 'F1 Score', value: `${(info.f1_score * 100).toFixed(2)}%`, color: 'text-orange-400' },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 text-center"
                >
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Confusion Matrix</h2>
            </div>

            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="text-sm text-gray-500" />
                <div className="text-sm font-medium text-gray-300">Predicted Ham</div>
                <div className="text-sm font-medium text-gray-300">Predicted Spam</div>
              </div>
              
              {/* Actual Ham */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-gray-300 flex items-center justify-center">Actual Ham</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
                >
                  <p className="text-xl font-bold text-green-400">{confusionMatrix.tn}</p>
                  <p className="text-xs text-gray-400">True Negative</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center"
                >
                  <p className="text-xl font-bold text-red-400">{confusionMatrix.fp}</p>
                  <p className="text-xs text-gray-400">False Positive</p>
                </motion.div>
              </div>

              {/* Actual Spam */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-sm font-medium text-gray-300 flex items-center justify-center">Actual Spam</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center"
                >
                  <p className="text-xl font-bold text-orange-400">{confusionMatrix.fn}</p>
                  <p className="text-xs text-gray-400">False Negative</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
                >
                  <p className="text-xl font-bold text-green-400">{confusionMatrix.tp}</p>
                  <p className="text-xs text-gray-400">True Positive</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Model Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Algorithm Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-sm text-gray-400 font-medium">Algorithm</th>
                  <th className="text-center p-3 text-sm text-gray-400 font-medium">Accuracy</th>
                  <th className="text-center p-3 text-sm text-gray-400 font-medium">Precision</th>
                  <th className="text-center p-3 text-sm text-gray-400 font-medium">Recall</th>
                  <th className="text-center p-3 text-sm text-gray-400 font-medium">F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(info.all_models).map(([name, metrics]) => (
                  <motion.tr
                    key={name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-white/5 ${
                      name === 'SVM' ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <td className="p-3">
                      <span className={`text-sm font-medium ${name === 'SVM' ? 'text-blue-400' : 'text-white'}`}>
                        {name}
                        {name === 'SVM' && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="p-3 text-center text-sm text-gray-300">
                      {(metrics.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-center text-sm text-gray-300">
                      {(metrics.precision * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-center text-sm text-gray-300">
                      {(metrics.recall * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-center text-sm text-gray-300">
                      {(metrics.f1 * 100).toFixed(2)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Technology Stack</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Python', 'scikit-learn', 'Pandas', 'NumPy',
              'React', 'TypeScript', 'Vite', 'Tailwind CSS',
              'Framer Motion', 'Recharts', 'Lucide Icons'
            ].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
