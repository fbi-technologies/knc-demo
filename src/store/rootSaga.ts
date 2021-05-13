import { fork } from 'typed-redux-saga';
import marketSaga from './market/market.saga';

export default function* rootSaga() {
  try {
    yield fork(marketSaga);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}
