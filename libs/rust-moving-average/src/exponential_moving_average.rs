use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn exponential_moving_average(data: &[f64], alpha: f64) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());

    if data.is_empty() {
        return result;
    }

    let mut ema = data[0];
    result.push(ema);

    for &value in &data[1..] {
        ema = alpha * value + (1.0 - alpha) * ema;
        result.push(ema);
    }

    result
}
