export interface CPUMetrics {
  percent_total: number;
  percent_per_core: number[];
  count: number;
  frequency_mhz: number;
}

export interface MemoryMetrics {
  percent: number;
  total_mb: number;
  available_mb: number;
  used_mb: number;
}

export interface DiskMetrics {
  percent: number;
  total_gb: number;
  used_gb: number;
  free_gb: number;
}

export interface NetworkMetrics {
  bytes_sent_mb: number;
  bytes_recv_mb: number;
}

export interface ProcessMetrics {
  memory_mb: number;
  cpu_percent: number;
}

export interface SystemMetrics {
  timestamp: number;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
  process: ProcessMetrics;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting';
