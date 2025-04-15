import init, {
  moving_average,
  median_filter,
  exponential_moving_average,
} from '../pkg/rust_moving_average.js';

export async function initRustFunctions() {
  await init();
}

export { moving_average };
export { median_filter };
export { exponential_moving_average };
