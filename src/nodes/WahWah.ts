import { Super } from "../Super";
import { WAHWAH_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";
import type { EnvelopeFollower } from "./EnvelopeFollower";

export class WahWah extends Super<typeof WAHWAH_DEFAULTS> {
	filterFreqTimeout: ReturnType<typeof setTimeout> | number;
	envelopeFollower: EnvelopeFollower;
	filterBp: BiquadFilterNode;
	filterPeaking: BiquadFilterNode;
	activateNode: GainNode;
	output: GainNode;
	#automode!: boolean;
	#sweep!: number;
	#sensitivity!: number;
	#baseFrequency!: number;
	#excursionOctaves!: number;
	#resonance!: number;
	#excursionFrequency!: number;
	userInstance: Tuna;

	constructor(
		instance: Tuna,
		context: AudioContext,
		propertiesArg: Properties<typeof WAHWAH_DEFAULTS>,
	) {
		super();
		this.filterFreqTimeout = 0;
		this.defaults = WAHWAH_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.userInstance = instance;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.envelopeFollower = this.userInstance.createEnvelopeFollower({
			target: this,
			callback: <T>(context: { sweep: T }, value: T) => {
				context.sweep = value;
			},
		});
		this.filterBp = this.userContext.createBiquadFilter();
		this.filterPeaking = this.userContext.createBiquadFilter();
		this.output = this.userContext.createGain();

		//Connect AudioNodes
		this.activateNode.connect(this.filterBp);
		this.filterBp.connect(this.filterPeaking);
		this.filterPeaking.connect(this.output);

		//Set Properties
		this.init();
		this.automode = initValue(
			properties.automode,
			this.defaults.automode.value,
		);
		this.resonance = properties.resonance || this.defaults.resonance.value;
		this.sensitivity = initValue(
			properties.sensitivity,
			this.defaults.sensitivity.value,
		);
		this.baseFrequency = initValue(
			properties.baseFrequency,
			this.defaults.baseFrequency.value,
		);
		this.excursionOctaves =
			properties.excursionOctaves || this.defaults.excursionOctaves.value;
		this.sweep = initValue(properties.sweep, this.defaults.sweep.value);

		this.activateNode.gain.value = 2;
		this.envelopeFollower.activate(true);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}
	get automode() {
		return this.#automode;
	}
	set automode(value) {
		this.#automode = value;
		if (value) {
			this.activateNode.connect(this.envelopeFollower.input);
			this.envelopeFollower.activate(true);
		} else {
			this.envelopeFollower.activate(false);
			this.activateNode.disconnect();
			this.activateNode.connect(this.filterBp);
		}
	}
	get sweep() {
		return this.#sweep;
	}
	set sweep(value) {
		this.#sweep = (value > 1 ? 1 : value < 0 ? 0 : value) ** this.#sensitivity;
		this.setFilterFreq();
	}
	get baseFrequency() {
		return this.#baseFrequency;
	}
	set baseFrequency(value) {
		this.#baseFrequency = 50 * 10 ** (value * 2);
		this.#excursionFrequency = Math.min(
			this.userContext.sampleRate / 2,
			this.baseFrequency * 2 ** this.#excursionOctaves,
		);
		this.setFilterFreq();
	}
	get excursionOctaves() {
		return this.#excursionOctaves;
	}
	set excursionOctaves(value) {
		this.#excursionOctaves = value;
		this.#excursionFrequency = Math.min(
			this.userContext.sampleRate / 2,
			this.baseFrequency * 2 ** this.#excursionOctaves,
		);
		this.setFilterFreq();
	}
	get sensitivity() {
		return this.#sensitivity;
	}
	set sensitivity(value) {
		this.#sensitivity = 10 ** value;
	}
	get resonance() {
		return this.#resonance;
	}
	set resonance(value) {
		this.#resonance = value;
		this.filterPeaking.Q.value = this.#resonance;
	}

	setFilterFreq() {
		try {
			this.filterBp.frequency.value = Math.min(
				22050,
				this.#baseFrequency + this.#excursionFrequency * this.#sweep,
			);
			this.filterPeaking.frequency.value = Math.min(
				22050,
				this.#baseFrequency + this.#excursionFrequency * this.#sweep,
			);
		} catch (e) {
			clearTimeout(this.filterFreqTimeout);
			//put on the next cycle to let all init properties be set
			this.filterFreqTimeout = setTimeout(() => {
				this.setFilterFreq();
			}, 0);
		}
	}

	init() {
		this.output.gain.value = 1;
		this.filterPeaking.type = "peaking";
		this.filterBp.type = "bandpass";
		this.filterPeaking.frequency.value = 100;
		this.filterPeaking.gain.value = 20;
		this.filterPeaking.Q.value = 5;
		this.filterBp.frequency.value = 100;
		this.filterBp.Q.value = 1;
	}
}
