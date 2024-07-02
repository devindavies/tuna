import { Super } from "../Super";
import { COMPRESSOR_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { dbToWAVolume } from "../utils/dbToWAVolume";
import { initValue } from "../utils/initValue";

export class Compressor extends Super<typeof COMPRESSOR_DEFAULTS> {
	compNode: DynamicsCompressorNode;
	makeupNode: GainNode;
	#automakeup!: boolean;
	threshold: number;
	defaults: typeof COMPRESSOR_DEFAULTS;
	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof COMPRESSOR_DEFAULTS>,
	) {
		super();
		this.defaults = COMPRESSOR_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.compNode = this.activateNode =
			this.userContext.createDynamicsCompressor();
		this.makeupNode = this.userContext.createGain();
		this.output = this.userContext.createGain();

		this.compNode.connect(this.makeupNode);
		this.makeupNode.connect(this.output);

		this.automakeup = initValue(
			properties.automakeup,
			this.defaults.automakeup.value,
		);

		//don't use makeupGain setter at initialization to avoid smoothing
		if (this.automakeup) {
			this.makeupNode.gain.value = dbToWAVolume(this.computeMakeup());
		} else {
			this.makeupNode.gain.value = dbToWAVolume(
				initValue(properties.makeupGain, this.defaults.makeupGain.value),
			);
		}
		this.threshold = initValue(
			properties.threshold,
			this.defaults.threshold.value,
		);
		this.release = initValue(properties.release, this.defaults.release.value);
		this.attack = initValue(properties.attack, this.defaults.attack.value);
		this.ratio = properties.ratio || this.defaults.ratio.value;
		this.knee = initValue(properties.knee, this.defaults.knee.value);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	computeMakeup() {
		const magicCoefficient = 4; // raise me if the output is too hot
		const c = this.compNode;
		return (
			-(c.threshold.value - c.threshold.value / c.ratio.value) /
			magicCoefficient
		);
	}

	get automakeup() {
		return this.#automakeup;
	}
	set automakeup(value) {
		this.#automakeup = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get makeupGain(): AudioParam {
		return this.makeupNode.gain;
	}
	set makeupGain(value: number) {
		this.makeupNode.gain.setTargetAtTime(
			dbToWAVolume(value),
			this.userContext.currentTime,
			0.01,
		);
	}

	get ratio(): AudioParam {
		return this.compNode.ratio;
	}

	set ratio(value: number) {
		this.compNode.ratio.value = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get knee(): AudioParam {
		return this.compNode.knee;
	}

	set knee(value: number) {
		this.compNode.knee.value = value;
		if (this.#automakeup) this.makeupGain = this.computeMakeup();
	}

	get attack(): AudioParam {
		return this.compNode.attack;
	}

	set attack(value: number) {
		this.compNode.attack.value = value / 1000;
	}

	get release(): AudioParam {
		return this.compNode.release;
	}

	set release(value: number) {
		this.compNode.release.value = value / 1000;
	}
}
