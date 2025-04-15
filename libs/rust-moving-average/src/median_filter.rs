use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn median_filter(data: &[f64], window_size: usize) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());

    for i in 0..data.len() {
        let start = if i >= window_size { i + 1 - window_size } else { 0 };
        let mut window: Vec<f64> = data[start..=i].to_vec();
        window.sort_by(|a, b| a.partial_cmp(b).unwrap());

        let median = if window.len() % 2 == 0 {
            let mid = window.len() / 2;
            (window[mid - 1] + window[mid]) / 2.0
        } else {
            window[window.len() / 2]
        };

        result.push(median);
    }

    result
}
