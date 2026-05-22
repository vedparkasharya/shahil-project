import Hero from '@/components/Hero';
import DetectionCard from '@/components/DetectionCard';
import StatsSection from '@/components/StatsSection';
import RecentHistory from '@/components/RecentHistory';
import { motion } from 'framer-motion';
import { Brain, Lock, Zap, BarChart3 } from 'lucide-react';

export default function Home() {
  const howItWorks = [
    {
      icon: Brain,
      title: 'ML Algorithm',
      description: 'Uses Support Vector Machine (SVM) trained on 5,572 labeled SMS messages to classify text.',
    },
    {
      icon: Zap,
      title: 'TF-IDF Vectorization',
      description: 'Converts text into numerical features using Term Frequency-Inverse Document Frequency weighting.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analysis',
      description: 'Computes spam probability instantly using the trained linear model coefficients in your browser.',
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'All processing happens locally in your browser. No data is sent to any external server.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Hero />
      <DetectionCard />
      <StatsSection />
      <RecentHistory />

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our spam detection pipeline uses classical machine learning to analyze text patterns
              and identify spam indicators in real-time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-all group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            SpamShield - Email Spam Detection System using Machine Learning
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Built with React, TypeScript, and scikit-learn SVM classifier
          </p>
        </div>
      </footer>
    </div>
  );
}
