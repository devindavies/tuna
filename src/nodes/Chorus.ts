import { Super } from "../Super";
import { CHORUS_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";
import { pipe } from "../utils/pipe";
import type { LFO } from "./LFO";

export class Chorus extends Super<typeof CHORUS_DEFAULTS> {
	attenuator: GainNode;
	splitter: ChannelSplitterNode;
	delayL: DelayNode;
	delayR: DelayNode;
	feedbackGainNodeLR: GainNode;
	feedbackGainNodeRL: GainNode;
	merger: ChannelMergerNode;
	lfoL: LFO;
	lfoR: LFO;
	#delay!: number;
	#depth!: number;
	#feedback!: number;
	#rate!: number;
	userInstance: Tuna;

	constructor(
		instance: Tuna,
		context: AudioContext,
		propertiesArg: Properties<typeof CHORUS_DEFAULTS>,
	) {
		super();
		this.defaults = CHORUS_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.userInstance = instance;
		this.input = this.userContext.createGain();
		this.attenuator = this.activateNode = this.userContext.createGain();
		this.splitter = this.userContext.createChannelSplitter(2);
		this.delayL = this.userContext.createDelay();
		this.delayR = this.userContext.createDelay();
		this.feedbackGainNodeLR = this.userContext.createGain();
		this.feedbackGainNodeRL = this.userContext.createGain();
		this.merger = this.userContext.createChannelMerger(2);
		this.output = this.userContext.createGain();

		this.lfoL = this.userInstance.createLFO({
			target: this.delayL.delayTime,
			callback: pipe,
		});
		this.lfoR = this.userInstance.createLFO({
			target: this.delayR.delayTime,
			callback: pipe,
		});

		this.input.connect(this.attenuator);
		this.attenuator.connect(this.output);
		this.attenuator.connect(this.splitter);
		this.splitter.connect(this.delayL, 0);
		this.splitter.connect(this.delayR, 1);
		this.delayL.connect(this.feedbackGainNodeLR);
		this.delayR.connect(this.feedbackGainNodeRL);
		this.feedbackGainNodeLR.connect(this.delayR);
		this.feedbackGainNodeRL.connect(this.delayL);
		this.delayL.connect(this.merger, 0, 0);
		this.delayR.connect(this.merger, 0, 1);
		this.merger.connect(this.output);

		this.feedback = initValue(
			properties.feedback,
			this.defaults.feedback.value,
		);
		this.rate = initValue(properties.rate, this.defaults.rate.value);
		this.delay = initValue(properties.delay, this.defaults.delay.value);
		this.depth = initValue(properties.depth, this.defaults.depth.value);
		this.lfoR.phase = Math.PI / 2;
		this.attenuator.gain.value = 0.6934; // 1 / (10 ^ (((20 * log10(3)) / 3) / 20))
		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}

	get delay() {
		return this.#delay;
	}

	set delay(value: number) {
		this.#delay = 0.0002 * (10 ** value * 2);
		this.lfoL.offset = this.#delay;
		this.lfoR.offset = this.#delay;
		this.#depth = this.#depth;
	}

	get depth() {
		return this.#depth;
	}

	set depth(value: number) {
		this.#depth = value;
		this.lfoL.oscillation = this.#depth * this.#delay;
		this.lfoR.oscillation = this.#depth * this.#delay;
	}

	get feedback() {
		return this.#feedback;
	}

	set feedback(value: number) {
		this.#feedback = value;
		this.feedbackGainNodeLR.gain.setTargetAtTime(
			this.#feedback,
			this.userContext.currentTime,
			0.01,
		);
		this.feedbackGainNodeRL.gain.setTargetAtTime(
			this.#feedback,
			this.userContext.currentTime,
			0.01,
		);
	}

	get rate() {
		return this.#rate;
	}

	set rate(value: number) {
		this.#rate = value;
		this.lfoL.frequency = this.#rate;
		this.lfoR.frequency = this.#rate;
	}
}
