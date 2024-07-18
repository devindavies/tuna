use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process(audio_samples: Vec<f32>, cutoff: f32, resonance: f32) -> Vec<f32> {
    // Contains the data for the spectrum to be visualized. It contains ordered pairs of
    // `(frequency, frequency_value)`. During each iteration, the frequency value gets
    // combined with `max(old_value * smoothing_factor, new_value)`.

    let mut in1: f32 = 0.0;
    let mut in2: f32 = 0.0;
    let mut in3: f32 = 0.0;
    let mut in4: f32 = 0.0;
    let mut out1: f32 = 0.0;
    let mut out2: f32 = 0.0;
    let mut out3: f32 = 0.0;
    let mut out4: f32 = 0.0;

    let f = &cutoff * 1.16;
    let input_factor = 0.35013 * (f * f) * (f * f);
    let fb = resonance * (1.0 - 0.15 * f * f);

    let output = audio_samples
        .iter()
        .map(|sample| {
            let new_sample = (*sample - out4 * fb) * input_factor;
            out1 = new_sample + 0.3 * in1 + out1 * (1.0 - f);
            in1 = new_sample;
            out2 = out1 + 0.3 * in2 + out2 * (1.0 - f);
            in2 = out1;
            out3 = out2 + 0.3 * in3 + out3 * (1.0 - f);
            in3 = out2;
            out4 = out3 + 0.3 * in4 + out4 * (1.0 - f);
            in4 = out3;
            out4
        })
        .collect();

    output
}
