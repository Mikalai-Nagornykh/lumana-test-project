import init, { median_filter } from '../../../../libs/rust-moving-average/pkg'; // путь может отличаться

addEventListener('message', async ({ data }) => {
  const { input, windowSize } = data;

  await init();

  const inputArray = new Float64Array(input);
  const result = median_filter(inputArray, windowSize);
  postMessage(Array.from(result));
});
