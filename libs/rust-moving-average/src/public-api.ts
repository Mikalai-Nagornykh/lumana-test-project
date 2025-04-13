import init, { moving_average } from '../pkg/rust_moving_average.js';

export async function initExampleRust() {
  await init();
}

export { moving_average };
