import { Super } from "../Super";
import { TREMOLO_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { fmod } from "../utils/fmod";
import { initValue } from "../utils/initValue";
import { pipe } from "../utils/pipe";
import type { LFO } from "./LFO";

export class Tremolo extends Super<typeof TREMOLO_DEFAULTS> {
	splitter: ChannelSplitterNode;
	amplitudeL: GainNode;
	amplitudeR: GainNode;
	merger: ChannelMergerNode;
	lfoL: LFO;
	lfoR: LFO;
	#intensity!: number;
	#rate!: number;
	#stereoPhase!: number;
	userInstance: Tuna;

	constructor(
		instance: Tuna,
		context: AudioContext,
		propertiesArg: Properties<typeof TREMOLO_DEFAULTS>,
	) {
		super();
		this.defaults = TREMOLO_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.userInstance = instance;
		this.input = this.userContext.createGain();
		this.splitter = this.activateNode =
			this.userContext.createChannelSplitter(2);
		this.amplitudeL = this.userContext.createGain();
		this.amplitudeR = this.userContext.createGain();
		this.merger = this.userContext.createChannelMerger(2);
		this.output = this.userContext.createGain();
		this.lfoL = this.userInstance.createLFO({
			target: this.amplitudeL.gain,
			callback: pipe,
		});
		this.lfoR = this.userInstance.createLFO({
			target: this.amplitudeR.gain,
			callback: pipe,
		});

		this.input.connect(this.splitter);
		this.splitter.connect(this.amplitudeL, 0);
		this.splitter.connect(this.amplitudeR, 1);
		this.amplitudeL.connect(this.merger, 0, 0);
		this.amplitudeR.connect(this.merger, 0, 1);
		this.merger.connect(this.output);

		this.rate = properties.rate || this.defaults.rate.value;
		this.intensity = initValue(
			properties.intensity,
			this.defaults.intensity.value,
		);
		this.stereoPhase = initValue(
			properties.stereoPhase,
			this.defaults.stereoPhase.value,
		);

		this.lfoL.offset = 1 - this.intensity / 2;
		this.lfoR.offset = 1 - this.intensity / 2;
		this.lfoL.phase = (this.stereoPhase * Math.PI) / 180;

		this.lfoL.activate(true);
		this.lfoR.activate(true);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}
	get intensity() {
		return this.#intensity;
	}
	set intensity(value) {
		this.#intensity = value;
		this.lfoL.offset = 1 - this.#intensity / 2;
		this.lfoR.offset = 1 - this.#intensity / 2;
		this.lfoL.oscillation = this.#intensity;
		this.lfoR.oscillation = this.#intensity;
	}
	get rate() {
		return this.#rate;
	}
	set rate(value) {
		this.#rate = value;
		this.lfoL.frequency = this.#rate;
		this.lfoR.frequency = this.#rate;
	}
	get stereoPhase() {
		return this.#stereoPhase;
	}
	set stereoPhase(value) {
		this.#stereoPhase = value;
		let newPhase = this.lfoL._phase + (this.#stereoPhase * Math.PI) / 180;
		newPhase = fmod(newPhase, 2 * Math.PI);
		this.lfoR.phase = newPhase;
	}
}
