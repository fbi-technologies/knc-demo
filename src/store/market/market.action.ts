import { BarData } from 'lightweight-charts';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { MarketIntervalValue } from '../../constants/market.constant';
import { mapExchangeInfo } from '../../helpers/market.helper';

type FETCH_EXCHANGE_INFO_SUCCESS_PAYLOAD = ReturnType<typeof mapExchangeInfo>;

export const fetchExchangeInfo = createAsyncAction(
  'FETCH_EXCHANGE_INFO_REQUEST',
  'FETCH_EXCHANGE_INFO_SUCCESS',
  'FETCH_EXCHANGE_INFO_FAILED',
)<void, FETCH_EXCHANGE_INFO_SUCCESS_PAYLOAD, void>();

interface FetchCandlestickRequestPayload {
  symbol: string;
  interval: MarketIntervalValue;
}

export const fetchCandlestickData = createAsyncAction(
  'FETCH_CANDLESTICK_DATA_REQUEST',
  'FETCH_CANDLESTICK_DATA_SUCCESS',
  'FETCH_CANDLESTICK_DATA_FAILED',
)<FetchCandlestickRequestPayload, BarData[], void>();

export const addCandlestickData = createAction(
  'ADD_CANDLESTICK_DATA',
)<BarData>();

export const changeInterval =
  createAction('CHANGE_INTERVAL')<MarketIntervalValue>();

export const changeSymbol = createAction('CHANGE_SYMBOL')<string>();
