export const MARKET_INTERVAL = [
  { value: '1m', label: '1 min' },
  { value: '3m', label: '3 min' },
  { value: '5m', label: '5 min' },
  { value: '15m', label: '15 min' },
  { value: '30m', label: '30 min' },
  { value: '1h', label: '60 min' },
  { value: '2h', label: '2 hour' },
  { value: '4h', label: '4 hour' },
  { value: '6h', label: '6 hour' },
  { value: '1d', label: 'Day' },
  { value: '1w', label: 'Week' },
] as const;

export type MarketIntervalValue = typeof MARKET_INTERVAL[number]['value'];

export const DEFAULT_MARKET = 'BTCUSDT';
