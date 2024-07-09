import { Super } from "../Super";
import { PHASER_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { fmod } from "../utils/fmod";
import type { LFO } from "./LFO";

export class Phaser extends Super<typeof PHASER_DEFAULTS> {
	stage: number;
	splitter: ChannelSplitterNode;
	feedbackGainNodeL: GainNode;
	feedbackGainNodeR: GainNode;
	merger: ChannelMergerNode;
	filteredSignal: GainNode;
	filtersL: BiquadFilterNode[];
	filtersR: BiquadFilterNode[];
	lfoL: LFO;
	lfoR: LFO;
	#depth!: number;
	#baseModulationFrequency!: number;
	#rate!: number;
	#feedback!: number;
	#stereoPhase!: number;
	userInstance: Tuna;

	constructor(
		instance: Tuna,
		context: AudioContext,
		propertiesArg: Properties<typeof PHASER_DEFAULTS>,
	) {
		super(context);
		this.stage = 4;
		this.defaults = PHASER_DEFAULTS;

		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		this.userInstance = instance;
		this.splitter = this.activateNode = new ChannelSplitterNode(context, {
			numberOfOutputs: 2,
		});
		this.filtersL = [];
		this.filtersR = [];
		this.feedbackGainNodeL = new GainNode(context);
		this.feedbackGainNodeR = new GainNode(context);
		this.merger = new ChannelMergerNode(context, { numberOfInputs: 2 });
		this.filteredSignal = new GainNode(context);
		this.output = new GainNode(context);
		this.lfoL = this.userInstance.createLFO({
			target: this.filtersL,
			callback: this.callback,
		});
		this.lfoR = this.userInstance.createLFO({
			target: this.filtersR,
			callback: this.callback,
		});

		let i = this.stage;
		while (i--) {
			this.filtersL[i] = new BiquadFilterNode(context);
			this.filtersR[i] = new BiquadFilterNode(context);
			this.filtersL[i].type = "allpass";
			this.filtersR[i].type = "allpass";
		}
		this.connect(this.splitter);
		this.connect(this.output);
		this.splitter.connect(this.filtersL[0], 0, 0);
		this.splitter.connect(this.filtersR[0], 1, 0);
		this.connectInOrder(this.filtersL);
		this.connectInOrder(this.filtersR);
		this.filtersL[this.stage - 1].connect(this.feedbackGainNodeL);
		this.filtersL[this.stage - 1].connect(this.merger, 0, 0);
		this.filtersR[this.stage - 1].connect(this.feedbackGainNodeR);
		this.filtersR[this.stage - 1].connect(this.merger, 0, 1);
		this.feedbackGainNodeL.connect(this.filtersL[0]);
		this.feedbackGainNodeR.connect(this.filtersR[0]);
		this.merger.connect(this.output);

		this.rate = options.rate;
		this.baseModulationFrequency = options.baseModulationFrequency;
		this.depth = options.depth;
		this.feedback = options.feedback;
		this.stereoPhase = options.stereoPhase;

		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = options.bypass;
	}
	get depth() {
		return this.#depth;
	}
	set depth(value) {
		this.#depth = value;
		this.lfoL.oscillation = this.#baseModulationFrequency * this.#depth;
		this.lfoR.oscillation = this.#baseModulationFrequency * this.#depth;
	}
	get rate() {
		return this.#rate;
	}
	set rate(value) {
		this.#rate = value;
		this.lfoL.frequency = this.#rate;
		this.lfoR.frequency = this.#rate;
	}
	get baseModulationFrequency() {
		return this.#baseModulationFrequency;
	}
	set baseModulationFrequency(value) {
		this.#baseModulationFrequency = value;
		this.lfoL.offset = this.#baseModulationFrequency;
		this.lfoR.offset = this.#baseModulationFrequency;
		this.depth = this.#depth;
	}
	get feedback() {
		return this.#feedback;
	}
	set feedback(value) {
		this.#feedback = value;
		this.feedbackGainNodeL.gain.setTargetAtTime(
			this.#feedback,
			this.context.currentTime,
			0.01,
		);
		this.feedbackGainNodeR.gain.setTargetAtTime(
			this.#feedback,
			this.context.currentTime,
			0.01,
		);
	}
	get stereoPhase() {
		return this.#stereoPhase;
	}
	set stereoPhase(value) {
		this.#stereoPhase = value;
		let newPhase = this.lfoL._phase + (this.#stereoPhase * Math.PI) / 180;
		newPhase = fmod(newPhase, 2 * Math.PI);
		this.lfoR._phase = newPhase;
	}

	callback(filters: { frequency: { value: number } }[], value: number) {
		for (let stage = 0; stage < 4; stage++) {
			filters[stage].frequency.value = value;
		}
	}
}
