import "../TextDecoder.js";
import init, { process } from "../wasm-audio/wasm_audio.js";

export const moogFilterProcessorURL = URL.createObjectURL(
	new Blob(
		[
			"(",
			(() => {
				class MoogFilterProcessor extends AudioWorkletProcessor {
					processor?: (
						audio_samples: Float32Array,
						cutoff: number,
						resonance: number,
					) => Float32Array;
					static get parameterDescriptors() {
						return [
							{
								name: "cutoff",
								defaultValue: 0.065,
								minValue: 0.0001,
								maxValue: 1.0,
							},
							{
								name: "resonance",
								defaultValue: 3.5,
								minValue: 0.0,
								maxValue: 4.0,
							},
							{
								name: "bypass",
								defaultValue: 0,
							},
						];
					}

					constructor() {
						super();

						// Listen to events from the RTANode running on the main thread.
						this.port.onmessage = (event) => this.onmessage(event);
					}

					onmessage(event: MessageEvent) {
						const { type, data } = event.data;
						switch (type) {
							case "send-wasm-module": {
								// RTANode has sent us a message containing the Wasm library to load into
								// our context as well as information about the audio device used for
								// recording.
								init(WebAssembly.compile(data)).then(() => {
									this.port.postMessage({ type: "wasm-module-loaded" });
								});
								//this.canvasPort = event.ports[0];
								break;
							}
							case "init-detector": {
								this.processor = process;

								break;
							}
						}
					}

					process(
						inputs: Float32Array[][],
						outputs: Float32Array[][],
						parameters: Record<string, Float32Array>,
					) {
						const input = inputs[0];
						const output = outputs[0];
						const cutoff = parameters.cutoff[0];
						const resonance = parameters.resonance[0];

						for (let channelNum = 0; channelNum < input.length; channelNum++) {
							const inputChannel = input[channelNum];
							const outputChannel = output[channelNum];

							if (this.processor) {
								outputChannel.set(
									this.processor(inputChannel, cutoff, resonance),
								);
							}
						}

						// Returning true tells the Audio system to keep going.
						return true;
					}
				}

				registerProcessor("MoogFilterProcessor", MoogFilterProcessor);
			}).toString(),
			")()",
		],
		{ type: "application/javascript" },
	),
);
