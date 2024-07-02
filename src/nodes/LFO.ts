import { Super } from "../Super";
import { LFO_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class LFO extends Super<typeof LFO_DEFAULTS> {
	bufferSize: number;
	sampleRate: number;
	output: ScriptProcessorNode;

	#frequency!: number;
	#phaseInc!: number;
	#offset!: number;
	#oscillation!: number;
	_phase!: number;
	#target!: AudioParam | AudioNode | AudioNode[] | undefined;

	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof LFO_DEFAULTS> & {
			target?: AudioParam | AudioNode[] | AudioNode;
			callback?: (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				...args: any[]
			) => void;
		},
	) {
		super();
		this.bufferSize = 256;
		this.sampleRate = 44100;

		this.defaults = LFO_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}

		//Instantiate AudioNode
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.output = this.userContext.createScriptProcessor(256, 1, 1);
		this.activateNode = this.userContext.destination;

		//Set Properties
		this.frequency = initValue(
			properties.frequency,
			this.defaults.frequency.value,
		);
		this.offset = initValue(properties.offset, this.defaults.offset.value);
		this.oscillation = initValue(
			properties.oscillation,
			this.defaults.oscillation.value,
		);
		this.phase = initValue(properties.phase, this.defaults.phase.value);
		this.target = properties.target;
		this.output.onaudioprocess = this.callback(
			properties.callback || (() => {}),
		);
		this.bypass = properties.bypass || this.defaults.bypass.value;
	}
	get frequency() {
		return this.#frequency;
	}
	set frequency(value) {
		this.#frequency = value;
		this.#phaseInc =
			(2 * Math.PI * this.#frequency * this.bufferSize) / this.sampleRate;
	}
	get offset() {
		return this.#offset;
	}
	set offset(value) {
		this.#offset = value;
	}
	get oscillation() {
		return this.#oscillation;
	}
	set oscillation(value) {
		this.#oscillation = value;
	}
	get phase() {
		return this._phase;
	}
	set phase(value) {
		this._phase = value;
	}
	get target(): AudioParam | AudioNode | AudioNode[] | undefined {
		return this.#target;
	}
	set target(value: AudioParam | AudioNode | AudioNode[] | undefined) {
		this.#target = value;
	}

	activate(doActivate: boolean) {
		if (doActivate) {
			this.output.connect(this.userContext.destination);
			if (this.activateCallback) {
				this.activateCallback(doActivate);
			}
		} else {
			this.output.disconnect();
		}
	}

	callback(
		callback: (
			...args: [AudioNode | AudioNode[] | AudioParam | undefined, number]
		) => void,
	) {
		return () => {
			this._phase += this.#phaseInc;
			if (this._phase > 2 * Math.PI) {
				this._phase = 0;
			}
			callback(
				this.#target,
				this.#offset + this.#oscillation * Math.sin(this._phase),
			);
		};
	}
}
