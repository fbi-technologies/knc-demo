import { BarData } from 'lightweight-charts';

export function calculateSMA(data: BarData[], count: number) {
  const avg = function (data: BarData[]) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].close;
    }
    return sum / data.length;
  };
  const result = [];
  for (let i = count - 1, len = data.length; i < len; i++) {
    const val = avg(data.slice(i - count + 1, i));
    result.push({ time: data[i].time, value: val });
  }
  return result;
}
