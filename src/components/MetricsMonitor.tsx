import React from 'react';
import { useMetricsWebSocket } from '../hooks/useMetricsWebSocket';
import { SystemMetrics } from '../types/metrics';

interface ProgressBarProps {
  percent: number;
  label: string;
  value: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, label, value }) => {
  const getColorClass = (percent: number): string => {
    if (percent < 50) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (percent < 80) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${getColorClass(percent)}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {icon && <span className="text-2xl mr-2">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
};

interface MetricsDisplayProps {
  metrics: SystemMetrics;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  // Validate that all required metric properties exist
  if (!metrics.cpu || !metrics.memory || !metrics.disk || !metrics.network || !metrics.process) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-gray-600 text-lg">
          Données de métriques incomplètes reçues du serveur...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* CPU Metrics */}
      <MetricCard title="CPU" icon="🖥️">
        <ProgressBar
          percent={metrics.cpu.percent_total}
          label="Utilisation totale"
          value={`${metrics.cpu.percent_total.toFixed(1)}%`}
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Cœurs:</span> {metrics.cpu.count}</p>
          <p><span className="font-medium">Fréquence:</span> {metrics.cpu.frequency_mhz.toFixed(0)} MHz</p>
          <div className="mt-2">
            <p className="font-medium mb-1">Par cœur:</p>
            <div className="flex flex-wrap gap-1">
              {metrics.cpu.percent_per_core.map((percent, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                  title={`Cœur ${index + 1}`}
                >
                  {percent.toFixed(0)}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </MetricCard>

      {/* Memory Metrics */}
      <MetricCard title="Mémoire" icon="💾">
        <ProgressBar
          percent={metrics.memory.percent}
          label="Utilisation"
          value={`${metrics.memory.percent.toFixed(1)}%`}
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Utilisée:</span> {metrics.memory.used_mb.toFixed(1)} MB</p>
          <p><span className="font-medium">Disponible:</span> {metrics.memory.available_mb.toFixed(1)} MB</p>
          <p><span className="font-medium">Totale:</span> {metrics.memory.total_mb.toFixed(1)} MB</p>
        </div>
      </MetricCard>

      {/* Disk Metrics */}
      <MetricCard title="Disque" icon="💿">
        <ProgressBar
          percent={metrics.disk.percent}
          label="Utilisation"
          value={`${metrics.disk.percent.toFixed(1)}%`}
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Utilisé:</span> {metrics.disk.used_gb.toFixed(1)} GB</p>
          <p><span className="font-medium">Libre:</span> {metrics.disk.free_gb.toFixed(1)} GB</p>
          <p><span className="font-medium">Total:</span> {metrics.disk.total_gb.toFixed(1)} GB</p>
        </div>
      </MetricCard>

      {/* Network Metrics */}
      <MetricCard title="Réseau" icon="🌐">
        <div className="text-sm text-gray-600 space-y-3">
          <div>
            <p className="font-medium text-gray-700 mb-1">Données envoyées</p>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.network.bytes_sent_mb.toFixed(1)} MB
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Données reçues</p>
            <p className="text-2xl font-bold text-green-600">
              {metrics.network.bytes_recv_mb.toFixed(1)} MB
            </p>
          </div>
        </div>
      </MetricCard>

      {/* Process Metrics */}
      <MetricCard title="Processus API" icon="⚙️">
        <div className="text-sm text-gray-600 space-y-3">
          <div>
            <p className="font-medium text-gray-700 mb-1">Mémoire</p>
            <p className="text-2xl font-bold text-purple-600">
              {metrics.process.memory_mb.toFixed(1)} MB
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">CPU</p>
            <p className="text-2xl font-bold text-orange-600">
              {metrics.process.cpu_percent.toFixed(1)}%
            </p>
          </div>
        </div>
      </MetricCard>

      {/* Timestamp */}
      <MetricCard title="Dernière mise à jour" icon="⏱️">
        <div className="text-sm text-gray-600">
          <p className="text-lg font-mono">
            {new Date(metrics.timestamp * 1000).toLocaleTimeString('fr-FR')}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {new Date(metrics.timestamp * 1000).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </MetricCard>
    </div>
  );
};

interface StatusIndicatorProps {
  status: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, onConnect, onDisconnect }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-500',
          text: 'Connecté',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500 animate-pulse',
          text: 'Connexion...',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
        };
      case 'disconnected':
        return {
          color: 'bg-gray-500',
          text: 'Déconnecté',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Erreur',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Inconnu',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`${config.bgColor} rounded-lg p-4 flex items-center justify-between`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${config.color} mr-3`} />
        <span className={`font-semibold ${config.textColor}`}>{config.text}</span>
      </div>
      <div className="flex gap-2">
        {status === 'connected' && (
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Déconnecter
          </button>
        )}
        {(status === 'disconnected' || status === 'error') && (
          <button
            onClick={onConnect}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            {status === 'error' ? 'Réessayer' : 'Connecter'}
          </button>
        )}
      </div>
    </div>
  );
};

const MetricsMonitor: React.FC = () => {
  const { metrics, status, connect, disconnect } = useMetricsWebSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Monitoring en temps réel
          </h1>
          <p className="text-gray-600">
            Surveillance des métriques système de l'API
          </p>
        </div>

        <div className="mb-6">
          <StatusIndicator
            status={status}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>

        {status === 'error' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">
                  Erreur de connexion
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  Impossible de se connecter au serveur WebSocket.
                  Assurez-vous que le backend est démarré sur le port 4000.
                </p>
              </div>
            </div>
          </div>
        )}

        {metrics ? (
          <MetricsDisplay metrics={metrics} />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600 text-lg">
              {status === 'connecting'
                ? 'Connexion au serveur...'
                : 'En attente de métriques...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsMonitor;
