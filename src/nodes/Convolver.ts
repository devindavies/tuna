import { Super } from "../Super";
import { CONVOLVER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Convolver extends Super<typeof CONVOLVER_DEFAULTS> {
	output: GainNode;
	dry: GainNode;
	wet: GainNode;
	convolver: ConvolverNode;
	filterLow: BiquadFilterNode;
	filterHigh: BiquadFilterNode;
	input: AudioNode;

	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof CONVOLVER_DEFAULTS> & {
			impulse?: string;
		},
	) {
		super();
		this.defaults = CONVOLVER_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.convolver = this.userContext.createConvolver();
		this.dry = this.userContext.createGain();
		this.filterLow = this.userContext.createBiquadFilter();
		this.filterHigh = this.userContext.createBiquadFilter();
		this.wet = this.userContext.createGain();
		this.output = this.userContext.createGain();

		this.activateNode.connect(this.filterLow);
		this.activateNode.connect(this.dry);
		this.filterLow.connect(this.filterHigh);
		this.filterHigh.connect(this.convolver);
		this.convolver.connect(this.wet);
		this.wet.connect(this.output);
		this.dry.connect(this.output);

		//don't use setters at init to avoid smoothing
		this.dry.gain.value = initValue(
			properties.dryLevel,
			this.defaults.dryLevel.value,
		);
		this.wet.gain.value = initValue(
			properties.wetLevel,
			this.defaults.wetLevel.value,
		);
		this.filterHigh.frequency.value =
			properties.highCut || this.defaults.highCut.value;
		this.filterLow.frequency.value =
			properties.lowCut || this.defaults.lowCut.value;
		this.output.gain.value = initValue(
			properties.level,
			this.defaults.level.value,
		);
		this.filterHigh.type = "lowpass";
		this.filterLow.type = "highpass";
		this.buffer = properties.impulse || "../impulses/ir_rev_short.wav";
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get lowCut(): AudioParam {
		return this.filterLow.frequency;
	}
	set lowCut(value: number) {
		this.filterLow.frequency.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}

	get highCut(): AudioParam {
		return this.filterHigh.frequency;
	}
	set highCut(value: number) {
		this.filterHigh.frequency.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}

	get level(): AudioParam {
		return this.output.gain;
	}
	set level(value: number) {
		this.output.gain.setTargetAtTime(value, this.userContext.currentTime, 0.01);
	}

	get dryLevel(): AudioParam {
		return this.dry.gain;
	}
	set dryLevel(value: number) {
		this.dry.gain.setTargetAtTime(value, this.userContext.currentTime, 0.01);
	}
	get wetLevel(): AudioParam {
		return this.wet.gain;
	}
	set wetLevel(value: number) {
		this.wet.gain.setTargetAtTime(value, this.userContext.currentTime, 0.01);
	}
	get buffer(): AudioBuffer | null {
		return this.convolver.buffer;
	}
	set buffer(impulse: string) {
		const convolver = this.convolver;
		const xhr = new XMLHttpRequest();
		if (!impulse) {
			console.log("Tuna.Convolver.setBuffer: Missing impulse path!");
			return;
		}
		xhr.open("GET", impulse, true);
		xhr.responseType = "arraybuffer";
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if ((xhr.status < 300 && xhr.status > 199) || xhr.status === 302) {
					this.userContext.decodeAudioData(
						xhr.response,
						(buffer) => {
							convolver.buffer = buffer;
						},
						(e) => {
							if (e)
								console.log(
									`Tuna.Convolver.setBuffer: Error decoding data${e}`,
								);
						},
					);
				}
			}
		};
		xhr.send(null);
	}
}
