import { Super } from "../Super";
import { BITCRUSHER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Bitcrusher extends Super<typeof BITCRUSHER_DEFAULTS> {
	processor: ScriptProcessorNode & { bits?: number; normfreq?: number };
	bufferSize: number;
	defaults: typeof BITCRUSHER_DEFAULTS;

	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof BITCRUSHER_DEFAULTS>,
	) {
		super();
		this.defaults = BITCRUSHER_DEFAULTS;
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

		let phaser = 0;
		let last = 0;
		let input: Float32Array;
		let output: Float32Array;
		let step: number;
		let i: number;
		let length: number;
		this.processor.onaudioprocess = (e) => {
			input = e.inputBuffer.getChannelData(0);
			output = e.outputBuffer.getChannelData(0);
			step = (1 / 2) ** (this.bits || 0);
			length = input.length;
			for (i = 0; i < length; i++) {
				phaser += this.normfreq || 0;
				if (phaser >= 1.0) {
					phaser -= 1.0;
					last = step * Math.floor(input[i] / step + 0.5);
				}
				output[i] = last;
			}
		};

		this.bits = properties.bits || this.defaults.bits.value;
		this.normfreq = initValue(
			properties.normfreq,
			this.defaults.normfreq.value,
		);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get bits() {
		return this.processor.bits;
	}

	set bits(value) {
		this.processor.bits = value;
	}

	get normfreq() {
		return this.processor.normfreq;
	}

	set normfreq(value) {
		this.processor.normfreq = value;
	}
}
