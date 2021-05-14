import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  BarData,
  createChart,
  CrosshairMode,
  IChartApi,
  MouseEventParams,
  TickMarkType,
  UTCTimestamp,
  ISeriesApi,
} from 'lightweight-charts';
import { format } from 'date-fns';
import { calculateSMA } from '../../utils/chart.utils';
import classes from './trading-view.module.scss';
import {
  MarketIntervalValue,
  MARKET_INTERVAL,
} from '../../constants/market.constant';

interface Props {
  width?: number;
  height?: number;
  data: BarData[];
  interval?: MarketIntervalValue;
}

const INIT_MA_VALUE = 'N/A';

const TradingView: FC<Props> = ({
  width = 600,
  height = 300,
  data = [],
  interval = MARKET_INTERVAL[0].value,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi>();
  const candleSeries = useRef<ISeriesApi<'Candlestick'>>();
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

        localization: {
          timeFormatter: (time: UTCTimestamp) => {
            const date = new Date(time);

            return format(date, 'dd/MM/yyyy hh:mm');
          }, // or whatever JS formatting you want here
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        // grid: {
        //   vertLines: {
        //     color: 'rgba(197, 203, 206, 0.7)',
        //   },
        //   horzLines: {
        //     color: 'rgba(197, 203, 206, 0.7)',
        //   },
        // },
        timeScale: {
          rightOffset: 12,
          barSpacing: 3,
          fixLeftEdge: true,
          timeVisible: true,
          secondsVisible: false,
          borderVisible: false,
          lockVisibleTimeRangeOnResize: true,

          tickMarkFormatter: (
            time: UTCTimestamp,
            tickMarkType: TickMarkType,
          ) => {
            const date = new Date(time);

            if (!['1d', '1w'].includes(interval)) {
              if (date.getHours() < 12) {
                return date.getDate();
              }
              return format(date, 'HH:mm');
            }
            if (interval === '1d') {
              return date.getDate();
            }

            return format(date, 'MM/yyyy');
          },
        },
      });
      candleSeries.current = chart.current.addCandlestickSeries();
    }
  }, [data, height, setLegendText, width, interval]);

  useEffect(() => {
    if (chart.current && candleSeries.current) {
      console.log('Update Data');

      candleSeries.current.setData(data);
      if (data.length > 0 && data[0].high < 10) {
        candleSeries.current.applyOptions({
          priceFormat: {
            precision: 5,
            minMove: 0.00001,
          },
        });
      }

      const smaData = calculateSMA(data, 10);
      const smaLine = chart.current.addLineSeries({
        color: 'rgba(4, 111, 232, 1)',
        lineWidth: 2,
      });
      smaLine.setData(smaData);

      chart.current.subscribeCrosshairMove((param: MouseEventParams) => {
        setLegendText(param.seriesPrices.get(smaLine) as number | undefined);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setLegendText, chart.current, candleSeries.current]);

  return (
    <>
      <div className={classes.tradingView} ref={container}>
        <div className={classes.maText}>
          MA10 <span className={classes.maValue}>{maValue}</span>
        </div>
      </div>
    </>
  );
};

export default TradingView;
