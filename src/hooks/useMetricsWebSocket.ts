import { useState, useEffect, useRef, useCallback } from 'react';
import { SystemMetrics, ConnectionStatus } from '../types/metrics';

interface UseMetricsWebSocketReturn {
  metrics: SystemMetrics | null;
  status: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
}

const WS_URL = 'ws://localhost:4000/api/ws/metrics';
const RECONNECT_DELAY = 3000; // 3 secondes

export const useMetricsWebSocket = (): UseMetricsWebSocketReturn => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef<boolean>(true);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('disconnected');
  }, [clearReconnectTimeout]);

  const connect = useCallback(() => {
    // Si déjà connecté ou en cours de connexion, ne rien faire
    if (wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    shouldReconnectRef.current = true;
    clearReconnectTimeout();
    setStatus('connecting');

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connecté aux métriques');
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: SystemMetrics = JSON.parse(event.data);
          setMetrics(data);
        } catch (error) {
          console.error('Erreur lors du parsing des métriques:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        setStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket déconnecté');
        setStatus('disconnected');
        wsRef.current = null;

        // Tentative de reconnexion automatique si souhaité
        if (shouldReconnectRef.current) {
          console.log(`Reconnexion dans ${RECONNECT_DELAY / 1000} secondes...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        }
      };
    } catch (error) {
      console.error('Erreur lors de la création du WebSocket:', error);
      setStatus('error');

      // Tenter une reconnexion
      if (shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, RECONNECT_DELAY);
      }
    }
  }, [clearReconnectTimeout]);

  // Connexion automatique au montage
  useEffect(() => {
    connect();

    // Cleanup au démontage
    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, clearReconnectTimeout]);

  return {
    metrics,
    status,
    connect,
    disconnect,
  };
};
