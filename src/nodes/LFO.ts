import { Super } from "../Super";
import { LFO_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";

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
		super(context);
		this.bufferSize = 256;
		this.sampleRate = 44100;

		this.defaults = LFO_DEFAULTS;
		const options = {
			...this.getDefaults(),
			...propertiesArg,
		};

		//Instantiate AudioNode
		this.output = this.context.createScriptProcessor(256, 1, 1);
		this.activateNode = this.context.destination;

		//Set Properties
		this.frequency = options.frequency;
		this.offset = options.offset;
		this.oscillation = options.oscillation;
		this.phase = options.phase;
		this.target = options.target;
		this.output.onaudioprocess = this.callback(options.callback || (() => {}));
		this.bypass = options.bypass;
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
			this.output.connect(this.context.destination);
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
