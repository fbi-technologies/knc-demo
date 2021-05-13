import { BarData, UTCTimestamp } from 'lightweight-charts';
import {
  CandlestickDataResponse,
  ExchangeInfoResponse,
} from '../models/apis/exchange.model';

export function mapExchangeInfo(data: ExchangeInfoResponse) {
  return data.symbols.map((i) => ({
    symbol: i.symbol,
  }));
}

export function mapCandlestickData(data: CandlestickDataResponse): BarData[] {
  return data.map((i) => ({
    time: i[0] as UTCTimestamp,
    open: Number(i[1]),
    high: Number(i[2]),
    low: Number(i[3]),
    close: Number(i[4]),
  }));
}
