import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  BarData,
  createChart,
  CrosshairMode,
  IChartApi,
  MouseEventParams,
} from 'lightweight-charts';
import { calculateSMA } from '../../utils/chart.utils';
import classes from './trading-view.module.scss';

interface Props {
  width?: number;
  height?: number;
  data: BarData[];
}

const INIT_MA_VALUE = 'N/A';
const TradingView: FC<Props> = ({ width = 600, height = 300, data = [] }) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi>();
  const [maValue, setMaValue] = useState(INIT_MA_VALUE);

  const setLegendText = useCallback((priceValue?: number) => {
    let val = INIT_MA_VALUE;
    if (priceValue !== undefined) {
      val = (Math.round(priceValue * 100) / 100).toFixed(2);
    }
    setMaValue(val);
  }, []);

  useLayoutEffect(() => {
    if (container.current && !chart.current) {
      chart.current = createChart(container.current, {
        width,
        height,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      });

      const candleSeries = chart.current.addCandlestickSeries();

      candleSeries.setData(data);

      const smaData = calculateSMA(data, 10);
      const smaLine = chart.current.addLineSeries({
        color: 'rgba(4, 111, 232, 1)',
        lineWidth: 2,
      });
      smaLine.setData(smaData);

      chart.current.subscribeCrosshairMove((param: MouseEventParams) => {
        setLegendText(param.seriesPrices.get(smaLine) as any);
      });
    }
  }, [data, height, setLegendText, width]);

  return (
    <>
      <div
        className={classes.tradingView}
        ref={container}
        style={{ width, height }}
      >
        <div className={classes.maText}>
          MA10 <span className={classes.maValue}>{maValue}</span>
        </div>
      </div>
    </>
  );
};

export default TradingView;
