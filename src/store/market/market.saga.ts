import { all, call, put, takeLatest } from 'typed-redux-saga';
import {
  getCandlestickData,
  getExchangeInfoApi,
} from '../../apis/exchange.api';
import {
  mapCandlestickData,
  mapExchangeInfo,
} from '../../helpers/market.helper';
import * as exchangeActions from './market.action';

function* handleFetchExchangeInfoSaga() {
  try {
    const res = yield* call(getExchangeInfoApi);
    yield* put(exchangeActions.fetchExchangeInfo.success(mapExchangeInfo(res)));
  } catch (e) {
    yield put(exchangeActions.fetchExchangeInfo.failure());
  }
}

function* handleFetchCandlestickData(
  action: ReturnType<typeof exchangeActions.fetchCandlestickData.request>,
) {
  try {
    const res = yield* call(
      getCandlestickData,
      action.payload.symbol,
      action.payload.interval,
    );

    yield* put(
      exchangeActions.fetchCandlestickData.success(mapCandlestickData(res)),
    );
  } catch (e) {
    yield put(exchangeActions.fetchCandlestickData.failure());
  }
}

export default function* marketSaga() {
  yield all([
    takeLatest(
      exchangeActions.fetchExchangeInfo.request,
      handleFetchExchangeInfoSaga,
    ),
    takeLatest(
      exchangeActions.fetchCandlestickData.request,
      handleFetchCandlestickData,
    ),
  ]);
}
