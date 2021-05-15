import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ToolBar from './components/ToolBar/ToolBar';
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
        interval: '1m',
      }),
    );
  }, [dispatch]);
  const market = useSelector((store) => store.market, shallowEqual);

  return (
    <div className="App">
      <div className="container">
        {market.exchange.loading || <ToolBar />}
        {market.market.loading || market.exchange.loading ? (
          <div>Loading....</div>
        ) : (
          <div className="tradingViewWrapper">
            <TradingView
              width={700}
              height={500}
              data={market.market.data}
              interval={market.market.interval}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
