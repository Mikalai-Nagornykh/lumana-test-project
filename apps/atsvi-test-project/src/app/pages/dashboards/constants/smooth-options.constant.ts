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
    // @ts-ignore
    fn: moving_average as SmoothingFn,
  },
  {
    type: 'MF',
    label: 'Median Filter',
    color: 'rgba(255, 206, 86, 1)',
    // @ts-ignore
    fn: median_filter as SmoothingFn,
  },
  {
    type: 'EMA',
    label: 'Exponential Moving Average',
    color: 'rgba(75, 192, 192, 1)',
    // @ts-ignore
    fn: exponential_moving_average as SmoothingFn,
  },
];
