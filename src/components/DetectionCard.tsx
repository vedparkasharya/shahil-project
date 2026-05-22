import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { detectSpamSync, saveToHistory, getSampleEmailsSync, type DetectionResult } from '@/lib/spamDetector';
import ResultCard from './ResultCard';

export default function DetectionCard() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDetect = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const detectionResult = detectSpamSync(text);
    setResult(detectionResult);
    saveToHistory(detectionResult);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    textareaRef.current?.focus();
  };

  const loadSample = (sample: string) => {
    setText(sample);
    setResult(null);
    setShowSamples(false);
  };

  const sampleEmails = getSampleEmailsSync();

  return (
    <section className="px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Email Content</span>
            </div>
            <div className="flex items-center gap-2">
              {text && (
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowSamples(!showSamples)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 transition-all"
                >
                  Try Samples
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSamples && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                    >
                      <div className="p-3 border-b border-white/10">
                        <span className="text-xs font-medium text-gray-400 uppercase">Spam Samples</span>
                      </div>
                      {sampleEmails.spam.map((sample, i) => (
                        <button
                          key={`spam-${i}`}
                          onClick={() => loadSample(sample)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent hover:border-red-400 truncate"
                        >
                          {sample.substring(0, 50)}...
                        </button>
                      ))}
                      <div className="p-3 border-t border-b border-white/10">
                        <span className="text-xs font-medium text-gray-400 uppercase">Legitimate Samples</span>
                      </div>
                      {sampleEmails.ham.map((sample, i) => (
                        <button
                          key={`ham-${i}`}
                          onClick={() => loadSample(sample)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent hover:border-green-400 truncate"
                        >
                          {sample.substring(0, 50)}...
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (result) setResult(null);
              }}
              placeholder="Paste email content here to analyze for spam..."
              className="w-full h-48 bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
            />
          </div>

          {/* Footer with Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
            <div className="text-xs text-gray-500">
              {text.length > 0 && `${text.length} characters`}
            </div>
            <motion.button
              onClick={handleDetect}
              disabled={!text.trim() || isAnalyzing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                !text.trim() || isAnalyzing
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Detect Spam
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
