import { Super } from "../Super";
import { PINGPONGDELAY_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

export class PingPongDelay extends Super<typeof PINGPONGDELAY_DEFAULTS> {
	wet: GainNode;
	stereoToMonoMix: GainNode;
	feedbackLevel: GainNode;
	delayLeft: DelayNode;
	delayRight: DelayNode;
	splitter: ChannelSplitterNode;
	merger: ChannelMergerNode;
	#delayTimeLeft!: number;
	#delayTimeRight!: number;

	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof PINGPONGDELAY_DEFAULTS>,
	) {
		super();
		this.defaults = PINGPONGDELAY_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.wet = this.userContext.createGain();
		this.stereoToMonoMix = this.userContext.createGain();
		this.feedbackLevel = this.userContext.createGain();
		this.output = this.userContext.createGain();
		this.delayLeft = this.userContext.createDelay(10);
		this.delayRight = this.userContext.createDelay(10);

		this.activateNode = this.userContext.createGain();
		this.splitter = this.userContext.createChannelSplitter(2);
		this.merger = this.userContext.createChannelMerger(2);

		this.activateNode.connect(this.splitter);
		this.splitter.connect(this.stereoToMonoMix, 0, 0);
		this.splitter.connect(this.stereoToMonoMix, 1, 0);
		this.stereoToMonoMix.gain.value = 0.5;
		this.stereoToMonoMix.connect(this.wet);
		this.wet.connect(this.delayLeft);
		this.feedbackLevel.connect(this.wet);
		this.delayLeft.connect(this.delayRight);
		this.delayRight.connect(this.feedbackLevel);
		this.delayLeft.connect(this.merger, 0, 0);
		this.delayRight.connect(this.merger, 0, 1);
		this.merger.connect(this.output);
		this.activateNode.connect(this.output);

		this.delayTimeLeft =
			properties.delayTimeLeft !== undefined
				? properties.delayTimeLeft
				: this.defaults.delayTimeLeft.value;
		this.delayTimeRight =
			properties.delayTimeRight !== undefined
				? properties.delayTimeRight
				: this.defaults.delayTimeRight.value;
		this.feedbackLevel.gain.value =
			properties.feedback !== undefined
				? properties.feedback
				: this.defaults.feedback.value;
		this.wet.gain.value =
			properties.wetLevel !== undefined
				? properties.wetLevel
				: this.defaults.wetLevel.value;
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}
	get delayTimeLeft() {
		return this.#delayTimeLeft;
	}
	set delayTimeLeft(value) {
		this.#delayTimeLeft = value;
		this.delayLeft.delayTime.value = value / 1000;
	}
	get delayTimeRight() {
		return this.#delayTimeRight;
	}
	set delayTimeRight(value) {
		this.#delayTimeRight = value;
		this.delayRight.delayTime.value = value / 1000;
	}
	get wetLevel(): AudioParam {
		return this.wet.gain;
	}
	set wetLevel(value: number) {
		this.wet.gain.setTargetAtTime(value, this.userContext.currentTime, 0.01);
	}
	get feedback(): AudioParam {
		return this.feedbackLevel.gain;
	}
	set feedback(value: number) {
		this.feedbackLevel.gain.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}
}
