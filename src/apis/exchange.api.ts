import { MarketIntervalValue } from '../constants/market.constant';
import {
  CandlestickDataResponse,
  ExchangeInfoResponse,
} from '../models/apis/exchange.model';
import request from '../utils/request.utils';

export function getExchangeInfoApi() {
  return request.get<ExchangeInfoResponse, ExchangeInfoResponse>(
    'exchangeInfo',
  );
}

export function getCandlestickData(
  symbol: string,
  interval: MarketIntervalValue,
) {
  return request.get<CandlestickDataResponse, CandlestickDataResponse>(
    'klines',
    {
      params: {
        symbol,
        interval,
      },
    },
  );
}
