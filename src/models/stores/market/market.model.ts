import { BarData } from 'lightweight-charts';
import { MarketIntervalValue } from '../../../constants/market.constant';
import { mapExchangeInfo } from '../../../helpers/market.helper';

export interface MarketStore {
  exchange: {
    loading: boolean;
    info: ReturnType<typeof mapExchangeInfo>;
  };
  market: {
    symbol: string;
    loading: boolean;
    data: BarData[];
    interval: MarketIntervalValue;
  };
}
