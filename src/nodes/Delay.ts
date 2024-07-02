import { Super } from "../Super";
import { DELAY_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Delay extends Super<typeof DELAY_DEFAULTS> {
	dry: GainNode;
	wet: GainNode;
	filter: BiquadFilterNode;
	delay: DelayNode;
	feedbackNode: GainNode;

	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof DELAY_DEFAULTS>,
	) {
		super();
		this.defaults = DELAY_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.dry = this.userContext.createGain();
		this.wet = this.userContext.createGain();
		this.filter = this.userContext.createBiquadFilter();
		this.delay = this.userContext.createDelay(10);
		this.feedbackNode = this.userContext.createGain();
		this.output = this.userContext.createGain();

		this.activateNode.connect(this.delay);
		this.activateNode.connect(this.dry);
		this.delay.connect(this.filter);
		this.filter.connect(this.feedbackNode);
		this.feedbackNode.connect(this.delay);
		this.feedbackNode.connect(this.wet);
		this.wet.connect(this.output);
		this.dry.connect(this.output);

		this.delayTime = properties.delayTime || this.defaults.delayTime.value;
		//don't use setters at init to avoid smoothing
		this.feedbackNode.gain.value = initValue(
			properties.feedback,
			this.defaults.feedback.value,
		);
		this.wet.gain.value = initValue(
			properties.wetLevel,
			this.defaults.wetLevel.value,
		);
		this.dry.gain.value = initValue(
			properties.dryLevel,
			this.defaults.dryLevel.value,
		);
		this.filter.frequency.value =
			properties.cutoff || this.defaults.cutoff.value;
		this.filter.type = "lowpass";
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get delayTime(): AudioParam {
		return this.delay.delayTime;
	}
	set delayTime(value: number) {
		this.delay.delayTime.value = value / 1000;
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
	get feedBack(): AudioParam {
		return this.feedbackNode.gain;
	}
	set feedBack(value: number) {
		this.feedbackNode.gain.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}
	get cutoff(): AudioParam {
		return this.filter.frequency;
	}
	set cutoff(value: number) {
		this.filter.frequency.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}
}
