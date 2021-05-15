import React, { FC, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ValueType } from 'react-select/src/types';
import Select, { Option } from '../ui/Select/Select';
import {
  MARKET_INTERVAL,
  MarketIntervalValue,
} from '../../constants/market.constant';
import { changeInterval, changeSymbol } from '../../store/market/market.action';
import classes from './tool-bar.module.scss';

const ToolBar: FC = () => {
  const market = useSelector((store) => store.market, shallowEqual);

  const dispatch = useDispatch();
  const onChangeInterval = (value: ValueType<Option, false>) => {
    if (value) {
      dispatch(changeInterval(value.value as MarketIntervalValue));
    }
  };
  const onChangeSymbol = (value: ValueType<Option, false>) => {
    if (value) {
      dispatch(changeSymbol(value.value));
    }
  };
  const infos = useMemo<Option[]>(
    () =>
      market.exchange.info.map((i) => ({
        label: i.symbol,
        value: i.symbol,
      })),
    [market.exchange.info],
  );
  const selectedSymbol = useMemo(() => {
    const symbol = market.exchange.info.find(
      (i) => i.symbol === market.market.symbol,
    );
    return (
      symbol && {
        label: symbol.symbol,
        value: symbol.symbol,
      }
    );
  }, [market.exchange.info, market.market.symbol]);

  const selectTimeInterval = useMemo(
    () => MARKET_INTERVAL.find((i) => i.value === market.market.interval),
    [market.market.interval],
  );

  return (
    <div className={classes.toolbar}>
      <Select
        label={'Time Interval'}
        options={MARKET_INTERVAL}
        onChange={onChangeInterval}
        value={selectTimeInterval}
      />

      <Select
        label={'Symbol'}
        onChange={onChangeSymbol}
        options={infos}
        value={selectedSymbol}
      />
    </div>
  );
};

export default ToolBar;
