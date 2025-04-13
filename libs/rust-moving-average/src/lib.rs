use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn moving_average(data: &[f64], window_size: usize) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    for i in 0..data.len() {
        let start = if i >= window_size { i + 1 - window_size } else { 0 };
        let window = &data[start..=i];
        let avg = window.iter().sum::<f64>() / window.len() as f64;
        result.push(avg);
    }
    result
}
