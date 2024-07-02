import { Super } from "../Super";
import { PHASER_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { fmod } from "../utils/fmod";
import { initValue } from "../utils/initValue";
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
		super();
		this.stage = 4;
		this.defaults = PHASER_DEFAULTS;

		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.userInstance = instance;
		this.input = this.userContext.createGain();
		this.splitter = this.activateNode =
			this.userContext.createChannelSplitter(2);
		this.filtersL = [];
		this.filtersR = [];
		this.feedbackGainNodeL = this.userContext.createGain();
		this.feedbackGainNodeR = this.userContext.createGain();
		this.merger = this.userContext.createChannelMerger(2);
		this.filteredSignal = this.userContext.createGain();
		this.output = this.userContext.createGain();
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
			this.filtersL[i] = this.userContext.createBiquadFilter();
			this.filtersR[i] = this.userContext.createBiquadFilter();
			this.filtersL[i].type = "allpass";
			this.filtersR[i].type = "allpass";
		}
		this.input.connect(this.splitter);
		this.input.connect(this.output);
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

		this.rate = initValue(properties.rate, this.defaults.rate.value);
		this.baseModulationFrequency =
			properties.baseModulationFrequency ||
			this.defaults.baseModulationFrequency.value;
		this.depth = initValue(properties.depth, this.defaults.depth.value);
		this.feedback = initValue(
			properties.feedback,
			this.defaults.feedback.value,
		);
		this.stereoPhase = initValue(
			properties.stereoPhase,
			this.defaults.stereoPhase.value,
		);

		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = properties.bypass || this.defaults.bypass.value;
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
			this.userContext.currentTime,
			0.01,
		);
		this.feedbackGainNodeR.gain.setTargetAtTime(
			this.#feedback,
			this.userContext.currentTime,
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
