import { createReducer } from 'typesafe-actions';
import { DEFAULT_MARKET } from '../../constants/market.constant';
import { MarketStore } from '../../models/stores/market/market.model';
import { fetchCandlestickData, fetchExchangeInfo } from './market.action';

const INIT_STATE: MarketStore = {
  exchange: {
    loading: false,
    info: [],
  },
  market: {
    loading: false,
    data: [],
    symbol: DEFAULT_MARKET,
    interval: '1h',
  },
};

const reducer = createReducer<MarketStore>(INIT_STATE)
  .handleAction(fetchExchangeInfo.request, (state) => ({
    ...state,
    exchange: {
      ...state.exchange,
      loading: true,
    },
  }))
  .handleAction(fetchExchangeInfo.success, (state, action) => ({
    ...state,
    exchange: {
      loading: false,
      info: action.payload,
    },
  }))
  .handleAction(fetchCandlestickData.request, (state, action) => ({
    ...state,
    market: {
      loading: true,
      symbol: action.payload.symbol,
      interval: action.payload.interval,
      data: [],
    },
  }))
  .handleAction(fetchCandlestickData.success, (state, action) => ({
    ...state,
    market: {
      ...state.market,
      loading: false,
      data: action.payload,
    },
  }));

export default reducer;
