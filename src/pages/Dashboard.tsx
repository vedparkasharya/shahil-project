import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { getHistory, getStats, type DetectionResult } from '@/lib/spamDetector';

export default function Dashboard() {
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [stats, setStats] = useState({ total: 0, spamCount: 0, hamCount: 0, avgConfidence: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(getHistory());
      setStats(getStats());
    }, 1000);
    setHistory(getHistory());
    setStats(getStats());
    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const pieData = [
    { name: 'Spam', value: stats.spamCount, color: '#ef4444' },
    { name: 'Legitimate', value: stats.hamCount, color: '#22c55e' },
  ];

  const confidenceRanges = [
    { range: '90-100%', spam: 0, ham: 0 },
    { range: '70-89%', spam: 0, ham: 0 },
    { range: '50-69%', spam: 0, ham: 0 },
  ];

  history.forEach(h => {
    const idx = h.confidence >= 90 ? 0 : h.confidence >= 70 ? 1 : 2;
    if (h.isSpam) confidenceRanges[idx].spam++;
    else confidenceRanges[idx].ham++;
  });

  const timelineData = history.slice(0, 20).reverse().map((h, i) => ({
    index: i + 1,
    confidence: h.confidence,
    type: h.isSpam ? 'Spam' : 'Ham',
  }));

  const topSpamWords = history
    .filter(h => h.isSpam)
    .flatMap(h => h.indicators.filter(ind => ind.weight > 0))
    .reduce((acc, ind) => {
      acc[ind.word] = (acc[ind.word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSpamWordsData = Object.entries(topSpamWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Detailed analysis of spam detection activity</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Analyses', value: stats.total, icon: Activity, color: 'text-blue-400' },
            { label: 'Spam Detected', value: stats.spamCount, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Legitimate', value: stats.hamCount, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Avg Confidence', value: stats.avgConfidence > 0 ? `${stats.avgConfidence}%` : '0%', icon: TrendingUp, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-white/5 border border-white/10 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-white/5 border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Detection Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Confidence Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-white/5 border border-white/10 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Confidence Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={confidenceRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="spam" fill="#ef4444" name="Spam" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ham" fill="#22c55e" name="Legitimate" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Timeline */}
          {timelineData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl bg-white/5 border border-white/10 p-6 lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Detection Confidence Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="index" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Confidence']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Top Spam Words */}
          {topSpamWordsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl bg-white/5 border border-white/10 p-6 lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Most Frequent Spam Indicators</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topSpamWordsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="word" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Detection History Table */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden mb-8"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Detection Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Result</th>
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Content</th>
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Confidence</th>
                    <th className="text-left p-4 text-sm text-gray-400 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 20).map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.isSpam 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {item.isSpam ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {item.isSpam ? 'Spam' : 'Ham'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-300 max-w-md truncate">
                        {item.text.substring(0, 60)}...
                      </td>
                      <td className="p-4 text-sm font-medium text-white">
                        {item.confidence}%
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
