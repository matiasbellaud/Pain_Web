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
      className="fixed top-4 right-4 z-50 bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 overflow-hidden"
      style={{ minWidth: '280px', maxWidth: '320px' }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">Métriques Système</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
              <div className="px-4 py-3 border-t border-border/30 space-y-3">
                {/* CPU */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">CPU</span>
                    <span className="text-xs font-bold text-foreground">
                      {metrics.cpu.percent_total.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metrics.cpu.percent_total < 50
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : metrics.cpu.percent_total < 80
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                          : 'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${Math.min(metrics.cpu.percent_total, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Mémoire</span>
                    <span className="text-xs font-bold text-foreground">
                      {formatBytes(metrics.memory.used_mb)} / {formatBytes(metrics.memory.total_mb)}
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metrics.memory.percent < 50
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : metrics.memory.percent < 80
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                          : 'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${Math.min(metrics.memory.percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Disk */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Disque</span>
                    <span className="text-xs font-bold text-foreground">
                      {metrics.disk.used_gb.toFixed(1)} GB / {metrics.disk.total_gb.toFixed(1)} GB
                    </span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metrics.disk.percent < 50
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : metrics.disk.percent < 80
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                          : 'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ width: `${Math.min(metrics.disk.percent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Process info */}
                {metrics.process && (
                  <div className="pt-2 border-t border-border/30">
                    <div className="text-xs text-muted-foreground space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span>Process CPU:</span>
                        <span className="font-semibold text-foreground">
                          {metrics.process.cpu_percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Process RAM:</span>
                        <span className="font-semibold text-foreground">
                          {formatBytes(metrics.process.memory_mb)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground/60 text-center pt-2 border-t border-border/30">
                  Mis à jour: {new Date(metrics.timestamp * 1000).toLocaleTimeString('fr-FR')}
                </div>
              </div>
            ) : status === 'connecting' ? (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-muted-foreground">Connexion...</div>
              </div>
            ) : status === 'error' ? (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-destructive">Erreur de connexion</div>
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <div className="text-sm text-muted-foreground">En attente de données...</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MetricsWidget;
