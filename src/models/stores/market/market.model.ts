import { BarData } from 'lightweight-charts';
import { MarketIntervalValue } from '../../../constants/market.constant';
import { mapExchangeInfo } from '../../../helpers/market.helper';

export type ExchangeInfo = ReturnType<typeof mapExchangeInfo>;
export interface MarketStore {
  exchange: {
    loading: boolean;
    info: ExchangeInfo;
  };
  market: {
    symbol: string;
    loading: boolean;
    data: BarData[];
    interval: MarketIntervalValue;
  };
}
