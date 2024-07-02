import { Super } from "../Super";
import { MOOGFILTER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class MoogFilter extends Super<typeof MOOGFILTER_DEFAULTS> {
	processor: ScriptProcessorNode & {
		cutoff?: number;
		resonance?: number;
	};
	bufferSize: number;
	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof MOOGFILTER_DEFAULTS>,
	) {
		super();
		this.defaults = MOOGFILTER_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.bufferSize = properties.bufferSize || this.defaults.bufferSize.value;
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.processor = this.userContext.createScriptProcessor(
			this.bufferSize,
			1,
			1,
		);
		this.output = this.userContext.createGain();

		this.activateNode.connect(this.processor);
		this.processor.connect(this.output);

		let in1 = 0.0;
		let in2 = 0.0;
		let in3 = 0.0;
		let in4 = 0.0;
		let out1 = 0.0;
		let out2 = 0.0;
		let out3 = 0.0;
		let out4 = 0.0;
		let input: Float32Array;
		let output: Float32Array;
		let f: number;
		let fb: number;
		let i: number;
		let length: number;
		let inputFactor: number;
		this.processor.onaudioprocess = (e) => {
			input = e.inputBuffer.getChannelData(0);
			output = e.outputBuffer.getChannelData(0);
			f = (this.cutoff || 0) * 1.16;
			inputFactor = 0.35013 * (f * f) * (f * f);
			fb = (this.resonance || 0) * (1.0 - 0.15 * f * f);
			length = input.length;
			for (i = 0; i < length; i++) {
				input[i] -= out4 * fb;
				input[i] *= inputFactor;
				out1 = input[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
				in1 = input[i];
				out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
				in2 = out1;
				out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
				in3 = out2;
				out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
				in4 = out3;
				output[i] = out4;
			}
		};

		this.cutoff = initValue(properties.cutoff, this.defaults.cutoff.value);
		this.resonance = initValue(
			properties.resonance,
			this.defaults.resonance.value,
		);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get cutoff() {
		return this.processor.cutoff;
	}
	set cutoff(value) {
		this.processor.cutoff = value;
	}

	get resonance() {
		return this.processor.resonance;
	}
	set resonance(value) {
		this.processor.resonance = value;
	}
}
