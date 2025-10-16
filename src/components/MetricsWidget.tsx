import React, { useState } from 'react';
import { useMetricsWebSocket } from '../hooks/useMetricsWebSocket';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MetricsWidget: React.FC = () => {
  const { metrics, status } = useMetricsWebSocket();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatBytes = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      style={{ minWidth: '280px', maxWidth: '320px' }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-600" />
          <span className="font-semibold text-gray-800 text-sm">Métriques Système</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {metrics && metrics.cpu && metrics.memory && metrics.disk ? (
              <div className="px-4 py-3 border-t border-gray-100 space-y-3">
                {/* CPU */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">CPU</span>
                    <span className="text-xs font-bold text-gray-900">
                      {metrics.cpu.percent_total.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metrics.cpu.percent_total < 50
                          ? 'bg-green-500'
                          : metrics.cpu.percent_total < 80
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metrics.cpu.percent_total, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Mémoire</span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatBytes(metrics.memory.used_mb)} / {formatBytes(metrics.memory.total_mb)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metrics.memory.percent < 50
                          ? 'bg-green-500'
                          : metrics.memory.percent < 80
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metrics.memory.percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Disk */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Disque</span>
                    <span className="text-xs font-bold text-gray-900">
                      {metrics.disk.used_gb.toFixed(1)} GB / {metrics.disk.total_gb.toFixed(1)} GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metrics.disk.percent < 50
                          ? 'bg-green-500'
                          : metrics.disk.percent < 80
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(metrics.disk.percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Process info */}
                {metrics.process && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Process CPU:</span>
                        <span className="font-semibold text-gray-900">
                          {metrics.process.cpu_percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Process RAM:</span>
                        <span className="font-semibold text-gray-900">
                          {formatBytes(metrics.process.memory_mb)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                  Mis à jour: {new Date(metrics.timestamp * 1000).toLocaleTimeString('fr-FR')}
                </div>
              </div>
            ) : status === 'connecting' ? (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-gray-500">Connexion...</div>
              </div>
            ) : status === 'error' ? (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-red-500">Erreur de connexion</div>
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-gray-500">En attente de données...</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MetricsWidget;
