import {
  exponential_moving_average,
  median_filter,
  moving_average,
} from '../../../../../../../libs/rust-moving-average/pkg';

type FilterType = 'MA' | 'MF' | 'EMA';

type SmoothingFn = (data: number[], param: number) => number[];

export interface SmoothingMethod {
  type: FilterType;
  label: string;
  color: string;
  fn: SmoothingFn;
}

export const filterOptions: SmoothingMethod[] = [
  {
    type: 'MA',
    label: 'Moving Average',
    color: 'rgba(54, 162, 235, 1)',
    fn: (data, window_size) => {
      const typedArray = new Float64Array(data);
      const result = moving_average(typedArray, window_size);
      return Array.from(result);
    },
  },
  {
    type: 'MF',
    label: 'Median Filter',
    color: 'rgba(255, 206, 86, 1)',
    fn: (data, window_size) => {
      const typedArray = new Float64Array(data);
      const result = median_filter(typedArray, window_size);
      return Array.from(result);
    },
  },
  {
    type: 'EMA',
    label: 'Exponential Moving Average',
    color: 'rgba(75, 192, 192, 1)',
    fn: (data, alpha) => {
      const typedArray = new Float64Array(data);
      const result = exponential_moving_average(typedArray, alpha);
      return Array.from(result);
    },
  },
];
