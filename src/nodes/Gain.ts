import { Super } from "../Super";
import { GAIN_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Gain extends Super<typeof GAIN_DEFAULTS> {
	gainNode: GainNode;
	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof GAIN_DEFAULTS>,
	) {
		super();
		this.defaults = GAIN_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;

		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.gainNode = this.userContext.createGain();
		this.output = this.userContext.createGain();

		this.activateNode.connect(this.gainNode);
		this.gainNode.connect(this.output);

		//don't use setter at init to avoid smoothing
		this.gainNode.gain.value = initValue(
			properties.gain,
			this.defaults.gain.value,
		);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get gain(): AudioParam {
		return this.gainNode.gain;
	}
	set gain(value: number) {
		this.gainNode.gain.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}
}
