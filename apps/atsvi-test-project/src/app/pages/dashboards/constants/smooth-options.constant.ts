import {
  exponential_moving_average,
  median_filter,
  moving_average,
} from '../../../../../../../libs/rust-moving-average/pkg';

type FilterType = 'INITIAL' | 'MA' | 'MF' | 'EMA';

type SmoothingFn = (data: number[], param: number) => number[];

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
    label: 'Median Filter',
    borderColor: 'rgba(255, 206, 86, 1)',
    fill: false,
    tension: 0.4,
    fn: (data, window_size) => {
      const typedArray = new Float64Array(data);
      const result = median_filter(typedArray, window_size);
      return Array.from(result);
    },
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
