import { BarData } from 'lightweight-charts';
import { eventChannel } from '@redux-saga/core';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'typed-redux-saga';
import {
  getCandlestickData,
  getExchangeInfoApi,
} from '../../apis/exchange.api';
import {
  mapCandlestickData,
  mapExchangeInfo,
} from '../../helpers/market.helper';
import { StoreState } from '../../models/stores/store.model';
import * as exchangeActions from './market.action';

enum SOCKET_EVENT {
  ADD_DATA = 'ADD_DATA',
}

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

    yield call(
      openSocket,
      `${action.payload.symbol.toLowerCase()}@kline_${action.payload.interval}`,
    );
  } catch (e) {
    yield put(exchangeActions.fetchCandlestickData.failure());
  }
}

function* handleChangeInterval(
  action: ReturnType<typeof exchangeActions.changeInterval>,
) {
  const symbol = yield* select(
    (store: StoreState) => store.market.market.symbol,
  );
  yield;
  yield put(
    exchangeActions.fetchCandlestickData.request({
      symbol,
      interval: action.payload,
    }),
  );
}

function* handleChangeSymbol(
  action: ReturnType<typeof exchangeActions.changeSymbol>,
) {
  const interval = yield* select(
    (store: StoreState) => store.market.market.interval,
  );
  yield put(
    exchangeActions.fetchCandlestickData.request({
      symbol: action.payload,
      interval,
    }),
  );
}

function* handleAddCandlestickData(action: {
  type: SOCKET_EVENT;
  data: BarData;
}) {
  if (action.type === SOCKET_EVENT.ADD_DATA) {
    yield put(exchangeActions.addCandlestickData(action.data));
  }
}

function* openSocket(symbol: string) {
  const socket = createSocket(symbol);

  const channel = yield* call(createSocketChanel, socket);
  yield* takeEvery(channel, handleAddCandlestickData);
  yield all([
    takeLatest(exchangeActions.changeInterval, closeSocket, socket),
    takeLatest(exchangeActions.changeSymbol, closeSocket, socket),
  ]);
}

function createSocket(symbol: string) {
  const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}`);
  socket.onopen = () => {
    console.log('Open Websocket');
  };
  socket.onclose = () => {
    console.log('Close Websocket');
  };

  return socket;
}

function closeSocket(socket: WebSocket) {
  socket.close();
}

function createSocketChanel(socket: WebSocket) {
  return eventChannel((emit) => {
    if (socket) {
      // eslint-disable-next-line no-param-reassign
      socket.onmessage = (env) => {
        const data = JSON.parse(env.data);
        if (data.k.x) {
          const barData: BarData = {
            time: data.k.T,
            open: data.k.o,
            high: data.k.h,
            low: data.k.l,
            close: data.k.c,
          };
          emit({ type: SOCKET_EVENT.ADD_DATA, data: barData });
        }
      };
    }
    return function* disconnect() {
      socket.close();
      yield call(closeSocket, socket);

      console.log('disconnected');
    };
  });
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
    takeLatest(exchangeActions.changeInterval, handleChangeInterval),
    takeLatest(exchangeActions.changeSymbol, handleChangeSymbol),
  ]);
}
