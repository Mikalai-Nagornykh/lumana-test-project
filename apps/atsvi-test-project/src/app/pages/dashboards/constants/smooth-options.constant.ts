import {
  exponential_moving_average,
  median_filter,
  moving_average,
} from '../../../../../../../libs/rust-moving-average/pkg';
import { logPerformance } from '../../../utils/log-performance';

type FilterType = 'INITIAL' | 'MA' | 'MF' | 'MF-WORKER' | 'EMA';

type SmoothingFn = (
  data: number[],
  param: number,
) => number[] | Promise<number[]>;

export interface LineChartDatasetExtra {
  type: FilterType;
  label: string;
  borderColor: string;
  fill: boolean;
  tension: number;
  fn: SmoothingFn | null;
}

export const filterOptions: LineChartDatasetExtra[] = [
  {
    type: 'MA',
    label: 'Moving Average',
    borderColor: 'rgba(54, 162, 235, 1)',
    fill: false,
    tension: 0.4,
    fn: (data, window_size) => {
      const typedArray = new Float64Array(data);
      const result = moving_average(typedArray, window_size);
      return Array.from(result);
    },
  },
  {
    type: 'MF',
    label: 'Median Filter (WASM)',
    borderColor: 'blue',
    fill: false,
    tension: 0.4,
    fn: (data: number[], windowSize: number) =>
      logPerformance('MF', () => {
        const typedArray = new Float64Array(data);
        const result = median_filter(typedArray, windowSize);
        return Array.from(result);
      }),
  },
  {
    type: 'MF-WORKER',
    label: 'Median Filter (Worker)',
    borderColor: 'green',
    fill: false,
    tension: 0.4,
    fn: (data: number[], windowSize: number) =>
      logPerformance('MF-WORKER', () => {
        return new Promise<number[]>((resolve) => {
          const worker = new Worker(
            new URL('../../../median-filter.worker', import.meta.url),
            { type: 'module' },
          );

          worker.postMessage({ input: data, windowSize });

          worker.onmessage = ({ data }) => {
            resolve(data);
            worker.terminate();
          };

          worker.onerror = (error) => {
            console.error('Worker error:', error);
            worker.terminate();
            resolve([]);
          };
        });
      }),
  },
  {
    type: 'EMA',
    label: 'Exponential Moving Average',
    borderColor: 'rgba(75, 192, 192, 1)',
    fill: false,
    tension: 0.4,
    fn: (data, alpha) => {
      const typedArray = new Float64Array(data);
      const result = exponential_moving_average(typedArray, alpha);
      return Array.from(result);
    },
  },
];
