type Type = 'DOM' | 'JavaScript' | 'Shared' | string;

interface MemoryMeasurement {
  bytes: number;
  breakdown: MemoryBreakdownEntry[];
}

interface MemoryBreakdownEntry {
  bytes: number;
  types: Type[];
  userAgentSpecificTypes: string[];
}

interface Performance {
  measureUserAgentSpecificMemory?(): Promise<MemoryMeasurement>;
}
