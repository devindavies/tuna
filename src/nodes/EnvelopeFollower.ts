import { Super } from "../Super";
import { ENVELOPEFOLLOWER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";
import type { WahWah } from "./WahWah";

export class EnvelopeFollower extends Super<typeof ENVELOPEFOLLOWER_DEFAULTS> {
	#callback!: <T>(
		context: {
			sweep: T;
		},
		value: T,
	) => void;
	buffersize: number;
	envelope: number;
	sampleRate: number;
	jsNode: ScriptProcessorNode;
	#envelope: number;
	#attackTime!: number;
	#attackC!: number;
	#releaseTime!: number;
	#releaseC!: number;
	#target?: AudioNode;
	activated: boolean;
	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof ENVELOPEFOLLOWER_DEFAULTS> & {
			target?: WahWah;
			callback?: <T>(context: { sweep: T }, value: T) => void;
		},
	) {
		super();
		this.buffersize = 256;
		this.envelope = 0;
		this.sampleRate = 44100;
		this.defaults = ENVELOPEFOLLOWER_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.activated = false;
		this.input = this.userContext.createGain();
		this.jsNode = this.output = this.userContext.createScriptProcessor(
			this.buffersize,
			1,
			1,
		);

		this.input.connect(this.output);

		this.attackTime = initValue(
			properties.attackTime,
			this.defaults.attackTime.value,
		);
		this.releaseTime = initValue(
			properties.releaseTime,
			this.defaults.releaseTime.value,
		);
		this.#envelope = 0;
		this.target = properties.target;
		this.callback = properties.callback || (() => {});

		this.bypass = properties.bypass || this.defaults.bypass.value;
	}
	get attackTime() {
		return this.#attackTime;
	}
	set attackTime(value) {
		this.#attackTime = value;
		this.#attackC = Math.exp(
			((-1 / this.#attackTime) * this.sampleRate) / this.buffersize,
		);
	}
	get releaseTime() {
		return this.#releaseTime;
	}
	set releaseTime(value) {
		this.#releaseTime = value;
		this.#releaseC = Math.exp(
			((-1 / this.#releaseTime) * this.sampleRate) / this.buffersize,
		);
	}
	get callback() {
		return this.#callback;
	}
	set callback(value: <T>(
		context: {
			sweep: T;
		},
		value: T,
	) => void) {
		if (typeof value === "function") {
			this.#callback = value;
		} else {
			console.error(
				`tuna.js: ${this.constructor.name}: Callback must be a function!`,
			);
		}
	}
	get target(): AudioNode | undefined {
		return this.#target;
	}
	set target(value: AudioNode | undefined) {
		this.#target = value;
	}

	activate(doActivate: boolean) {
		this.activated = doActivate;
		if (doActivate) {
			this.jsNode.connect(this.userContext.destination);
			this.jsNode.onaudioprocess = this.returnCompute(this);
		} else {
			this.jsNode.disconnect();
			this.jsNode.onaudioprocess = null;
		}
		if (this.activateCallback) {
			this.activateCallback(doActivate);
		}
	}

	returnCompute(instance: this) {
		return (event: AudioProcessingEvent) => {
			instance.compute(event);
		};
	}

	compute(event: AudioProcessingEvent) {
		const count = event.inputBuffer.getChannelData(0).length;
		const channels = event.inputBuffer.numberOfChannels;
		let current: number;
		let chan: number;
		let rms: number;
		let i: number;
		chan = rms = i = 0;

		for (chan = 0; chan < channels; ++chan) {
			for (i = 0; i < count; ++i) {
				current = event.inputBuffer.getChannelData(chan)[i];
				rms += current * current;
			}
		}
		rms = Math.sqrt(rms / channels);

		if (this.#envelope < rms) {
			this.#envelope *= this.#attackC;
			this.#envelope += (1 - this.#attackC) * rms;
		} else {
			this.#envelope *= this.#releaseC;
			this.#envelope += (1 - this.#releaseC) * rms;
		}
		this.#target && this.#callback(this.#target as WahWah, this.#envelope);
	}
}
