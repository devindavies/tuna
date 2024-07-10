import { Super } from "../Super";
import { CHORUS_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
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
		propertiesArg?: Properties<typeof CHORUS_DEFAULTS>,
	) {
		super(context);
		this.defaults = CHORUS_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.userInstance = instance;

		this.attenuator = this.activateNode = new GainNode(context);
		this.splitter = new ChannelSplitterNode(context, {
			numberOfOutputs: 2,
		});
		this.delayL = new DelayNode(context);
		this.delayR = new DelayNode(context);
		this.feedbackGainNodeLR = new GainNode(context);
		this.feedbackGainNodeRL = new GainNode(context);
		this.merger = new ChannelMergerNode(context, {
			numberOfInputs: 2,
		});

		this.lfoL = this.userInstance.createLFO({
			target: this.delayL.delayTime,
			callback: pipe,
		});
		this.lfoR = this.userInstance.createLFO({
			target: this.delayR.delayTime,
			callback: pipe,
		});

		this.inputConnect(this.attenuator);
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

		this.feedback = options.feedback;
		this.rate = options.rate;
		this.delay = options.delay;
		this.depth = options.depth;
		this.lfoR.phase = Math.PI / 2;
		this.attenuator.gain.value = 0.6934; // 1 / (10 ^ (((20 * log10(3)) / 3) / 20))
		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = options.bypass;
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
			this.context.currentTime,
			0.01,
		);
		this.feedbackGainNodeRL.gain.setTargetAtTime(
			this.#feedback,
			this.context.currentTime,
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
