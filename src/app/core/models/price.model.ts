export interface Price {
  symbol: string;
  value: number;
  change24h?: number;
  timestamp: Date;
}