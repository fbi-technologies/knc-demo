import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import TradingView from './components/TradingView/TradingView';
import { DEFAULT_MARKET } from './constants/market.constant';
import {
  fetchCandlestickData,
  fetchExchangeInfo,
} from './store/market/market.action';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExchangeInfo.request());
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      fetchCandlestickData.request({
        symbol: DEFAULT_MARKET,
        interval: '1h',
      }),
    );
  }, [dispatch]);
  const market = useSelector((store) => store.market.market, shallowEqual);

  return (
    <div className="App">
      {market.loading ? (
        <div>Loading....</div>
      ) : (
        <TradingView width={600} height={300} data={market.data} />
      )}
    </div>
  );
}

export default App;
