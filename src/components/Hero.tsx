import { motion } from 'framer-motion';
import { Shield, Zap, Brain, Lock } from 'lucide-react';

export default function Hero() {
  const features = [
    { icon: Brain, label: 'Machine Learning', desc: 'SVM Algorithm' },
    { icon: Zap, label: '98.2% Accuracy', desc: 'Trained on 5,572 emails' },
    { icon: Lock, label: 'Privacy First', desc: 'Runs in browser' },
    { icon: Shield, label: 'Real-time', desc: 'Instant Detection' },
  ];

  return (
    <section className="relative pt-32 pb-16 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-float-delay-2" />
      </div>

      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-6">
            <Shield className="w-4 h-4" />
            <span>AI-Powered Email Protection</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Detect Spam Emails
          <br />
          with <span className="text-gradient">Machine Learning</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Paste any email or message content and our trained SVM model will instantly 
          classify it as spam or legitimate with high confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <feature.icon className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">{feature.label}</div>
                <div className="text-xs text-gray-400">{feature.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
