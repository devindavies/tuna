/*
    Copyright (c) 2012 DinahMoe AB & Oskar Eriksson

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
    modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
    is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*global module*/

enum DATATYPE {
	FLOAT = "float",
	BOOLEAN = "boolean",
	STRING = "string",
	INT = "int",
}

const BITCRUSHER_DEFAULTS = {
	bits: {
		value: 4,
		min: 1,
		max: 16,
		automatable: false,
		type: DATATYPE.INT,
	},
	bufferSize: {
		value: 4096,
		min: 256,
		max: 16384,
		automatable: false,
		type: DATATYPE.INT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	normfreq: {
		value: 0.1,
		min: 0.0001,
		max: 1.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
} satisfies Defaults;

const COMPRESSOR_DEFAULTS = {
	threshold: {
		value: -20,
		min: -60,
		max: 0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	release: {
		value: 250,
		min: 10,
		max: 2000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	makeupGain: {
		value: 1,
		min: 1,
		max: 100,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	attack: {
		value: 1,
		min: 0,
		max: 1000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	ratio: {
		value: 4,
		min: 1,
		max: 50,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	knee: {
		value: 5,
		min: 0,
		max: 40,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	automakeup: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const CABINET_DEFAULTS = {
	makeupGain: {
		value: 1,
		min: 0,
		max: 20,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const CHORUS_DEFAULTS = {
	feedback: {
		value: 0.4,
		min: 0,
		max: 0.95,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	delay: {
		value: 0.0045,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	depth: {
		value: 0.7,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	rate: {
		value: 1.5,
		min: 0,
		max: 8,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const CONVOLVER_DEFAULTS = {
	highCut: {
		value: 22050,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	lowCut: {
		value: 20,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	dryLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	level: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const DELAY_DEFAULTS = {
	delayTime: {
		value: 100,
		min: 20,
		max: 1000,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	feedback: {
		value: 0.45,
		min: 0,
		max: 0.9,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	cutoff: {
		value: 20000,
		min: 20,
		max: 20000,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 0.5,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	dryLevel: {
		value: 1,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const FILTER_DEFAULTS = {
	frequency: {
		value: 800,
		min: 20,
		max: 22050,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	Q: {
		value: 1,
		min: 0.001,
		max: 100,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	gain: {
		value: 0,
		min: -40,
		max: 40,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	filterType: {
		value: "lowpass",
		automatable: false,
		type: DATATYPE.STRING,
	},
} satisfies Defaults;

const GAIN_DEFAULTS = {
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	gain: {
		value: 1.0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
} satisfies Defaults;

const MOOGFILTER_DEFAULTS = {
	bufferSize: {
		value: 4096,
		min: 256,
		max: 16384,
		automatable: false,
		type: DATATYPE.INT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	cutoff: {
		value: 0.065,
		min: 0.0001,
		max: 1.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	resonance: {
		value: 3.5,
		min: 0.0,
		max: 4.0,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
} satisfies Defaults;

const OVERDRIVE_DEFAULTS = {
	drive: {
		value: 0.197,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
		scaled: true,
	},
	outputGain: {
		value: -9.154,
		min: -46,
		max: 0,
		automatable: true,
		type: DATATYPE.FLOAT,
		scaled: true,
	},
	curveAmount: {
		value: 0.979,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	algorithmIndex: {
		value: 0,
		min: 0,
		max: 5,
		automatable: false,
		type: DATATYPE.INT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const PANNER_DEFAULTS = {
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	pan: {
		value: 0.0,
		min: -1.0,
		max: 1.0,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
} satisfies Defaults;

const PHASER_DEFAULTS = {
	rate: {
		value: 0.1,
		min: 0,
		max: 8,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	depth: {
		value: 0.6,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	feedback: {
		value: 0.7,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	stereoPhase: {
		value: 40,
		min: 0,
		max: 180,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	baseModulationFrequency: {
		value: 700,
		min: 500,
		max: 1500,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const PINGPONGDELAY_DEFAULTS = {
	delayTimeLeft: {
		value: 200,
		min: 1,
		max: 10000,
		automatable: false,
		type: DATATYPE.INT,
	},
	delayTimeRight: {
		value: 400,
		min: 1,
		max: 10000,
		automatable: false,
		type: DATATYPE.INT,
	},
	feedback: {
		value: 0.3,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	wetLevel: {
		value: 0.5,
		min: 0,
		max: 1,
		automatable: true,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const TREMOLO_DEFAULTS = {
	intensity: {
		value: 0.3,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	stereoPhase: {
		value: 0,
		min: 0,
		max: 180,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	rate: {
		value: 5,
		min: 0.1,
		max: 11,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const WAHWAH_DEFAULTS = {
	automode: {
		value: true,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
	baseFrequency: {
		value: 0.153,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	excursionOctaves: {
		value: 3.3,
		min: 1,
		max: 6,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	sweep: {
		value: 0.35,
		min: 0,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	resonance: {
		value: 19,
		min: 1,
		max: 100,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	sensitivity: {
		value: -0.5,
		min: -1,
		max: 1,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const ENVELOPEFOLLOWER_DEFAULTS = {
	attackTime: {
		value: 0.003,
		min: 0,
		max: 0.5,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	releaseTime: {
		value: 0.5,
		min: 0,
		max: 0.5,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

const LFO_DEFAULTS = {
	frequency: {
		value: 1,
		min: 0,
		max: 20,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	offset: {
		value: 0.85,
		min: 0,
		max: 22049,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	oscillation: {
		value: 0.3,
		min: -22050,
		max: 22050,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	phase: {
		value: 0,
		min: 0,
		max: 2 * Math.PI,
		automatable: false,
		type: DATATYPE.FLOAT,
	},
	bypass: {
		value: false,
		automatable: false,
		type: DATATYPE.BOOLEAN,
	},
} satisfies Defaults;

type Defaults = Record<
	string,
	{
		min?: number;
		max?: number;
		value: number | boolean | BiquadFilterType;
		automatable: boolean;
		type: DATATYPE;
		scaled?: boolean;
	}
>;

type Properties<T extends Defaults> = Partial<{
	[K in keyof T]: T[K]["value"];
}>;

abstract class Super<T extends Defaults> extends AudioNode {
	input!: AudioNode;
	output!: AudioNode;
	activateNode!: AudioNode;
	activateCallback!: (doActivate: boolean) => void;
	defaults!: T;

	protected _bypass!: boolean;
	protected _lastBypassValue!: boolean;

	get bypass() {
		return this._bypass;
	}

	set bypass(value) {
		if (this._lastBypassValue === value) {
			return;
		}
		this._bypass = value;
		this.activate(!value);
		this._lastBypassValue = value;
	}

	activate(doActivate: boolean) {
		if (doActivate) {
			this.input.disconnect();
			this.input.connect(this.activateNode);
			if (this.activateCallback) {
				this.activateCallback(doActivate);
			}
		} else {
			this.input.disconnect();
			this.input.connect(this.output);
		}
	}

	connectInOrder<C extends AudioNode | Super<T>>(nodeArray: C[]) {
		let i = nodeArray.length - 1;
		while (i--) {
			if (!nodeArray[i].connect) {
				return console.error(
					"AudioNode.connectInOrder: TypeError: Not an AudioNode.",
					nodeArray[i],
				);
			}
			const node = nodeArray[i + 1];
			if (node instanceof Super) {
				nodeArray[i].connect(node.input);
			} else {
				nodeArray[i].connect(node);
			}
		}
	}

	getDefaults() {
		const defaults = Object.fromEntries(
			Object.keys(this.defaults).map((key) => [
				key,
				this.defaults[key as keyof typeof this.defaults].value,
			]),
		);
		return defaults as Properties<typeof this.defaults>;
	}

	automate(
		property: keyof Properties<typeof this.defaults>,
		value: number,
		duration?: number,
		startTime?: number,
	) {
		const start = startTime ? ~~(startTime / 1000) : userContext.currentTime;
		const dur = duration ? ~~(duration / 1000) : 0;
		const _is = this.defaults[property];
		let param = this[property as keyof this];
		let method: "setValueAtTime" | "linearRampToValueAtTime";

		if (param) {
			if (_is.automatable) {
				if (!duration) {
					method = "setValueAtTime";
				} else {
					method = "linearRampToValueAtTime";
					(param as unknown as AudioParam).cancelScheduledValues(start);
					(param as unknown as AudioParam).setValueAtTime(
						(param as unknown as AudioParam).value,
						start,
					);
				}
				(param as unknown as AudioParam)[method](value, dur + start);
			} else {
				(param as number) = value;
			}
		} else {
			console.error(`Invalid Property for ${this.constructor.name}`);
		}
	}
}

export class Tuna {
	constructor(context: AudioContext) {
		if (!window.AudioContext) {
			window.AudioContext = window.webkitAudioContext;
		}
		let newContext: AudioContext = context;
		if (!context) {
			console.log(
				"tuna.js: Missing audio context! Creating a new context for you.",
			);
			newContext = window.AudioContext && new window.AudioContext();
		}
		if (!newContext) {
			throw new Error(
				"Tuna cannot initialize because this environment does not support web audio.",
			);
		}
		connectify(newContext);
		userContext = newContext;
		userInstance = this;
	}

	Bitcrusher = class Bitcrusher extends Super<typeof BITCRUSHER_DEFAULTS> {
		processor: ScriptProcessorNode & { bits?: number; normfreq?: number };
		bufferSize: number;
		defaults: typeof BITCRUSHER_DEFAULTS;

		constructor(propertiesArg: Properties<typeof BITCRUSHER_DEFAULTS>) {
			super();
			this.defaults = BITCRUSHER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.bufferSize = properties.bufferSize || this.defaults.bufferSize.value;

			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.processor = userContext.createScriptProcessor(this.bufferSize, 1, 1);
			this.output = userContext.createGain();

			this.activateNode.connect(this.processor);
			this.processor.connect(this.output);

			let phaser = 0;
			let last = 0;
			let input: Float32Array;
			let output: Float32Array;
			let step: number;
			let i: number;
			let length: number;
			this.processor.onaudioprocess = (e) => {
				input = e.inputBuffer.getChannelData(0);
				output = e.outputBuffer.getChannelData(0);
				step = (1 / 2) ** (this.bits || 0);
				length = input.length;
				for (i = 0; i < length; i++) {
					phaser += this.normfreq || 0;
					if (phaser >= 1.0) {
						phaser -= 1.0;
						last = step * Math.floor(input[i] / step + 0.5);
					}
					output[i] = last;
				}
			};

			this.bits = properties.bits || this.defaults.bits.value;
			this.normfreq = initValue(
				properties.normfreq,
				this.defaults.normfreq.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get bits() {
			return this.processor.bits;
		}

		set bits(value) {
			this.processor.bits = value;
		}

		get normfreq() {
			return this.processor.normfreq;
		}

		set normfreq(value) {
			this.processor.normfreq = value;
		}
	};

	Compressor = class Compressor extends Super<typeof COMPRESSOR_DEFAULTS> {
		compNode: DynamicsCompressorNode;
		makeupNode: GainNode;
		private _automakeup!: boolean;
		threshold: number;
		defaults: typeof COMPRESSOR_DEFAULTS;
		constructor(propertiesArg: Properties<typeof COMPRESSOR_DEFAULTS>) {
			super();
			this.defaults = COMPRESSOR_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.compNode = this.activateNode =
				userContext.createDynamicsCompressor();
			this.makeupNode = userContext.createGain();
			this.output = userContext.createGain();

			this.compNode.connect(this.makeupNode);
			this.makeupNode.connect(this.output);

			this.automakeup = initValue(
				properties.automakeup,
				this.defaults.automakeup.value,
			);

			//don't use makeupGain setter at initialization to avoid smoothing
			if (this.automakeup) {
				this.makeupNode.gain.value = dbToWAVolume(this.computeMakeup());
			} else {
				this.makeupNode.gain.value = dbToWAVolume(
					initValue(properties.makeupGain, this.defaults.makeupGain.value),
				);
			}
			this.threshold = initValue(
				properties.threshold,
				this.defaults.threshold.value,
			);
			this.release = initValue(properties.release, this.defaults.release.value);
			this.attack = initValue(properties.attack, this.defaults.attack.value);
			this.ratio = properties.ratio || this.defaults.ratio.value;
			this.knee = initValue(properties.knee, this.defaults.knee.value);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		computeMakeup() {
			const magicCoefficient = 4; // raise me if the output is too hot
			const c = this.compNode;
			return (
				-(c.threshold.value - c.threshold.value / c.ratio.value) /
				magicCoefficient
			);
		}

		get automakeup() {
			return this._automakeup;
		}
		set automakeup(value) {
			this._automakeup = value;
			if (this._automakeup) this.makeupGain = this.computeMakeup();
		}

		get makeupGain(): AudioParam {
			return this.makeupNode.gain;
		}
		set makeupGain(value: number) {
			this.makeupNode.gain.setTargetAtTime(
				dbToWAVolume(value),
				userContext.currentTime,
				0.01,
			);
		}

		get ratio(): AudioParam {
			return this.compNode.ratio;
		}

		set ratio(value: number) {
			this.compNode.ratio.value = value;
			if (this._automakeup) this.makeupGain = this.computeMakeup();
		}

		get knee(): AudioParam {
			return this.compNode.knee;
		}

		set knee(value: number) {
			this.compNode.knee.value = value;
			if (this._automakeup) this.makeupGain = this.computeMakeup();
		}

		get attack(): AudioParam {
			return this.compNode.attack;
		}

		set attack(value: number) {
			this.compNode.attack.value = value / 1000;
		}

		get release(): AudioParam {
			return this.compNode.release;
		}

		set release(value: number) {
			this.compNode.release.value = value / 1000;
		}
	};

	Cabinet = class Cabinet extends Super<typeof CABINET_DEFAULTS> {
		computeMakeup(): number {
			throw new Error("Method not implemented.");
		}
		makeupNode: GainNode;
		convolver: InstanceType<Tuna["Convolver"]>;
		_automakeup!: boolean;
		constructor(
			propertiesArg: Properties<typeof CABINET_DEFAULTS> & {
				impulsePath?: string;
			},
		) {
			super();
			this.defaults = CABINET_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.convolver = this.newConvolver(
				properties.impulsePath || "../impulses/impulse_guitar.wav",
			);
			this.makeupNode = userContext.createGain();
			this.output = userContext.createGain();

			this.activateNode.connect(this.convolver.input);
			this.convolver.output.connect(this.makeupNode);
			this.makeupNode.connect(this.output);
			//don't use makeupGain setter at init to avoid smoothing
			this.makeupNode.gain.value = initValue(
				properties.makeupGain,
				this.defaults.makeupGain.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get makeupGain(): AudioParam {
			return this.makeupNode.gain;
		}

		set makeupGain(value: number) {
			this.makeupNode.gain.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}

		newConvolver = (impulsePath: string) =>
			new userInstance.Convolver({
				impulse: impulsePath,
				dryLevel: 0,
				wetLevel: 1,
			});
	};

	Chorus = class Chorus extends Super<typeof CHORUS_DEFAULTS> {
		attenuator: GainNode;
		splitter: ChannelSplitterNode;
		delayL: DelayNode;
		delayR: DelayNode;
		feedbackGainNodeLR: GainNode;
		feedbackGainNodeRL: GainNode;
		merger: ChannelMergerNode;
		lfoL: InstanceType<Tuna["LFO"]>;
		lfoR: InstanceType<Tuna["LFO"]>;
		private _delay!: number;
		private _depth!: number;
		private _feedback!: number;
		private _rate!: number;

		constructor(propertiesArg: Properties<typeof CHORUS_DEFAULTS>) {
			super();
			this.defaults = CHORUS_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.attenuator = this.activateNode = userContext.createGain();
			this.splitter = userContext.createChannelSplitter(2);
			this.delayL = userContext.createDelay();
			this.delayR = userContext.createDelay();
			this.feedbackGainNodeLR = userContext.createGain();
			this.feedbackGainNodeRL = userContext.createGain();
			this.merger = userContext.createChannelMerger(2);
			this.output = userContext.createGain();

			this.lfoL = new userInstance.LFO({
				target: this.delayL.delayTime,
				callback: pipe,
			});
			this.lfoR = new userInstance.LFO({
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
			return this._delay;
		}

		set delay(value: number) {
			this._delay = 0.0002 * (10 ** value * 2);
			this.lfoL.offset = this._delay;
			this.lfoR.offset = this._delay;
			this._depth = this._depth;
		}

		get depth() {
			return this._depth;
		}

		set depth(value: number) {
			this._depth = value;
			this.lfoL.oscillation = this._depth * this._delay;
			this.lfoR.oscillation = this._depth * this._delay;
		}

		get feedback() {
			return this._feedback;
		}

		set feedback(value: number) {
			this._feedback = value;
			this.feedbackGainNodeLR.gain.setTargetAtTime(
				this._feedback,
				userContext.currentTime,
				0.01,
			);
			this.feedbackGainNodeRL.gain.setTargetAtTime(
				this._feedback,
				userContext.currentTime,
				0.01,
			);
		}

		get rate() {
			return this._rate;
		}

		set rate(value: number) {
			this._rate = value;
			this.lfoL.frequency = this._rate;
			this.lfoR.frequency = this._rate;
		}
	};

	Convolver = class Convolver extends Super<typeof CONVOLVER_DEFAULTS> {
		output: GainNode;
		dry: GainNode;
		wet: GainNode;
		convolver: ConvolverNode;
		filterLow: BiquadFilterNode;
		filterHigh: BiquadFilterNode;

		constructor(
			propertiesArg: Properties<typeof CONVOLVER_DEFAULTS> & {
				impulse?: string;
			},
		) {
			super();
			this.defaults = CONVOLVER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.convolver = userContext.createConvolver();
			this.dry = userContext.createGain();
			this.filterLow = userContext.createBiquadFilter();
			this.filterHigh = userContext.createBiquadFilter();
			this.wet = userContext.createGain();
			this.output = userContext.createGain();

			this.activateNode.connect(this.filterLow);
			this.activateNode.connect(this.dry);
			this.filterLow.connect(this.filterHigh);
			this.filterHigh.connect(this.convolver);
			this.convolver.connect(this.wet);
			this.wet.connect(this.output);
			this.dry.connect(this.output);

			//don't use setters at init to avoid smoothing
			this.dry.gain.value = initValue(
				properties.dryLevel,
				this.defaults.dryLevel.value,
			);
			this.wet.gain.value = initValue(
				properties.wetLevel,
				this.defaults.wetLevel.value,
			);
			this.filterHigh.frequency.value =
				properties.highCut || this.defaults.highCut.value;
			this.filterLow.frequency.value =
				properties.lowCut || this.defaults.lowCut.value;
			this.output.gain.value = initValue(
				properties.level,
				this.defaults.level.value,
			);
			this.filterHigh.type = "lowpass";
			this.filterLow.type = "highpass";
			this.buffer = properties.impulse || "../impulses/ir_rev_short.wav";
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get lowCut(): AudioParam {
			return this.filterLow.frequency;
		}
		set lowCut(value: number) {
			this.filterLow.frequency.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}

		get highCut(): AudioParam {
			return this.filterHigh.frequency;
		}
		set highCut(value: number) {
			this.filterHigh.frequency.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}

		get level(): AudioParam {
			return this.output.gain;
		}
		set level(value: number) {
			this.output.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}

		get dryLevel(): AudioParam {
			return this.dry.gain;
		}
		set dryLevel(value: number) {
			this.dry.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get wetLevel(): AudioParam {
			return this.wet.gain;
		}
		set wetLevel(value: number) {
			this.wet.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get buffer(): AudioBuffer | null {
			return this.convolver.buffer;
		}
		set buffer(impulse: string) {
			const convolver = this.convolver;
			const xhr = new XMLHttpRequest();
			if (!impulse) {
				console.log("Tuna.Convolver.setBuffer: Missing impulse path!");
				return;
			}
			xhr.open("GET", impulse, true);
			xhr.responseType = "arraybuffer";
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if ((xhr.status < 300 && xhr.status > 199) || xhr.status === 302) {
						userContext.decodeAudioData(
							xhr.response,
							(buffer) => {
								convolver.buffer = buffer;
							},
							(e) => {
								if (e)
									console.log(
										`Tuna.Convolver.setBuffer: Error decoding data${e}`,
									);
							},
						);
					}
				}
			};
			xhr.send(null);
		}
	};

	Delay = class Delay extends Super<typeof DELAY_DEFAULTS> {
		dry: GainNode;
		wet: GainNode;
		filter: BiquadFilterNode;
		delay: DelayNode;
		feedbackNode: GainNode;

		constructor(propertiesArg: Properties<typeof DELAY_DEFAULTS>) {
			super();
			this.defaults = DELAY_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.dry = userContext.createGain();
			this.wet = userContext.createGain();
			this.filter = userContext.createBiquadFilter();
			this.delay = userContext.createDelay(10);
			this.feedbackNode = userContext.createGain();
			this.output = userContext.createGain();

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
			this.dry.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get wetLevel(): AudioParam {
			return this.wet.gain;
		}
		set wetLevel(value: number) {
			this.wet.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get feedBack(): AudioParam {
			return this.feedbackNode.gain;
		}
		set feedBack(value: number) {
			this.feedbackNode.gain.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}
		get cutoff(): AudioParam {
			return this.filter.frequency;
		}
		set cutoff(value: number) {
			this.filter.frequency.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}
	};

	Filter = class Filter extends Super<typeof FILTER_DEFAULTS> {
		filter: BiquadFilterNode;
		constructor(
			propertiesArg: Properties<typeof FILTER_DEFAULTS> & {
				resonance?: number;
			},
		) {
			super();
			this.defaults = FILTER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.filter = userContext.createBiquadFilter();
			this.output = userContext.createGain();

			this.activateNode.connect(this.filter);
			this.filter.connect(this.output);

			//don't use setters for freq and gain at init to avoid smoothing
			this.filter.frequency.value =
				properties.frequency || this.defaults.frequency.value;
			this.Q = properties.resonance || this.defaults.Q.value;
			this.filterType = initValue(
				properties.filterType,
				this.defaults.filterType.value,
			);
			this.filter.gain.value = initValue(
				properties.gain,
				this.defaults.gain.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get filterType() {
			return this.filter.type;
		}
		set filterType(value) {
			this.filter.type = value;
		}
		get Q(): AudioParam {
			return this.filter.Q;
		}
		set Q(value: number) {
			this.filter.Q.value = value;
		}
		get gain(): AudioParam {
			return this.filter.gain;
		}
		set gain(value: number) {
			this.filter.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get frequency(): AudioParam {
			return this.filter.frequency;
		}
		set frequency(value: number) {
			this.filter.frequency.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}
	};

	Gain = class Gain extends Super<typeof GAIN_DEFAULTS> {
		gainNode: GainNode;
		constructor(propertiesArg: Properties<typeof GAIN_DEFAULTS>) {
			super();
			this.defaults = GAIN_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}

			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.gainNode = userContext.createGain();
			this.output = userContext.createGain();

			this.activateNode.connect(this.gainNode);
			this.gainNode.connect(this.output);

			//don't use setter at init to avoid smoothing
			this.gainNode.gain.value = initValue(
				properties.gain,
				this.defaults.gain.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get gain(): AudioParam {
			return this.gainNode.gain;
		}
		set gain(value: number) {
			this.gainNode.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
	};

	MoogFilter = class MoogFilter extends Super<typeof MOOGFILTER_DEFAULTS> {
		processor: ScriptProcessorNode & {
			cutoff?: number;
			resonance?: number;
		};
		bufferSize: number;
		constructor(propertiesArg: Properties<typeof MOOGFILTER_DEFAULTS>) {
			super();
			this.defaults = MOOGFILTER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.bufferSize = properties.bufferSize || this.defaults.bufferSize.value;

			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.processor = userContext.createScriptProcessor(this.bufferSize, 1, 1);
			this.output = userContext.createGain();

			this.activateNode.connect(this.processor);
			this.processor.connect(this.output);

			let in1 = 0.0;
			let in2 = 0.0;
			let in3 = 0.0;
			let in4 = 0.0;
			let out1 = 0.0;
			let out2 = 0.0;
			let out3 = 0.0;
			let out4 = 0.0;
			let input: Float32Array;
			let output: Float32Array;
			let f: number;
			let fb: number;
			let i: number;
			let length: number;
			let inputFactor: number;
			this.processor.onaudioprocess = (e) => {
				input = e.inputBuffer.getChannelData(0);
				output = e.outputBuffer.getChannelData(0);
				f = (this.cutoff || 0) * 1.16;
				inputFactor = 0.35013 * (f * f) * (f * f);
				fb = (this.resonance || 0) * (1.0 - 0.15 * f * f);
				length = input.length;
				for (i = 0; i < length; i++) {
					input[i] -= out4 * fb;
					input[i] *= inputFactor;
					out1 = input[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
					in1 = input[i];
					out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
					in2 = out1;
					out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
					in3 = out2;
					out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
					in4 = out3;
					output[i] = out4;
				}
			};

			this.cutoff = initValue(properties.cutoff, this.defaults.cutoff.value);
			this.resonance = initValue(
				properties.resonance,
				this.defaults.resonance.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}

		get cutoff() {
			return this.processor.cutoff;
		}
		set cutoff(value) {
			this.processor.cutoff = value;
		}

		get resonance() {
			return this.processor.resonance;
		}
		set resonance(value) {
			this.processor.resonance = value;
		}
	};

	Overdrive = class Overdrive extends Super<typeof OVERDRIVE_DEFAULTS> {
		k_nSamples: number;
		waveshaperAlgorithms: ((
			amountArg: number,
			n_samples: number,
			ws_table: Float32Array,
		) => void)[];
		inputDrive: GainNode;
		waveshaper: WaveShaperNode;
		outputDrive: GainNode;
		ws_table: Float32Array;
		private _curveAmount!: number;
		private _algorithmIndex!: number;
		private _outputGain!: number;

		constructor(propertiesArg: Properties<typeof OVERDRIVE_DEFAULTS>) {
			super();
			this.k_nSamples = 8192;
			this.defaults = OVERDRIVE_DEFAULTS;
			this.waveshaperAlgorithms = [
				(amountArg, n_samples, ws_table) => {
					let amount = amountArg;
					amount = Math.min(amount, 0.9999);
					const k = (2 * amount) / (1 - amount);
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						ws_table[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
					}
				},
				(_amount, n_samples, ws_table) => {
					let y: number | undefined;
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						y = (0.5 * (x + 1.4) ** 2 - 1) * (y && y >= 0 ? 5.8 : 1.2);
						ws_table[i] = tanh(y);
					}
				},
				(amount, n_samples, ws_table) => {
					const a = 1 - amount;
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						const y = x < 0 ? -(Math.abs(x) ** (a + 0.04)) : x ** a;
						ws_table[i] = tanh(y * 2);
					}
				},
				(amount, n_samples, ws_table) => {
					let y: number | undefined;
					let abx: number;
					const a = 1 - amount > 0.99 ? 0.99 : 1 - amount;
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						abx = Math.abs(x);
						if (abx < a) {
							y = abx;
						} else if (abx > a) {
							y = a + (abx - a) / (1 + ((abx - a) / (1 - a)) ** 2);
						} else if (abx > 1) {
							y = abx;
						}
						ws_table[i] = sign(x) * Number(y) * (1 / ((a + 1) / 2));
					}
				},
				(_amount, n_samples, ws_table) => {
					// fixed curve, amount doesn't do anything, the distortion is just from the drive
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						if (x < -0.08905) {
							ws_table[i] =
								(-3 / 4) *
									(1 -
										(1 - (Math.abs(x) - 0.032857)) ** 12 +
										(1 / 3) * (Math.abs(x) - 0.032847)) +
								0.01;
						} else if (x >= -0.08905 && x < 0.320018) {
							ws_table[i] = -6.153 * (x * x) + 3.9375 * x;
						} else {
							ws_table[i] = 0.630035;
						}
					}
				},
				(amount, n_samples, ws_table) => {
					const a = 2 + Math.round(amount * 14);
					// we go from 2 to 16 bits, keep in mind for the UI
					const bits = Math.round(2 ** (a - 1));
					// real number of quantization steps divided by 2
					for (let i = 0; i < n_samples; i++) {
						const x = (i * 2) / n_samples - 1;
						ws_table[i] = Math.round(x * bits) / bits;
					}
				},
			];

			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.inputDrive = userContext.createGain();
			this.waveshaper = userContext.createWaveShaper();
			this.outputDrive = userContext.createGain();
			this.output = userContext.createGain();

			this.activateNode.connect(this.inputDrive);
			this.inputDrive.connect(this.waveshaper);
			this.waveshaper.connect(this.outputDrive);
			this.outputDrive.connect(this.output);

			this.ws_table = new Float32Array(this.k_nSamples);
			this.drive = initValue(properties.drive, this.defaults.drive.value);
			this.outputGain = initValue(
				properties.outputGain,
				this.defaults.outputGain.value,
			);
			this.curveAmount = initValue(
				properties.curveAmount,
				this.defaults.curveAmount.value,
			);
			this.algorithmIndex = initValue(
				properties.algorithmIndex,
				this.defaults.algorithmIndex.value,
			);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}
		get drive(): AudioParam {
			return this.inputDrive.gain;
		}
		set drive(value: number) {
			this.inputDrive.gain.value = value;
		}
		get curveAmount() {
			return this._curveAmount;
		}
		set curveAmount(value) {
			this._curveAmount = value;
			if (this._algorithmIndex === undefined) {
				this._algorithmIndex = 0;
			}
			this.waveshaperAlgorithms[this._algorithmIndex](
				this._curveAmount,
				this.k_nSamples,
				this.ws_table,
			);
			this.waveshaper.curve = this.ws_table;
		}
		get outputGain(): AudioParam {
			return this.outputDrive.gain;
		}
		set outputGain(value: number) {
			this._outputGain = dbToWAVolume(value);
			this.outputDrive.gain.setTargetAtTime(
				this._outputGain,
				userContext.currentTime,
				0.01,
			);
		}
		get algorithmIndex() {
			return this._algorithmIndex;
		}
		set algorithmIndex(value) {
			this._algorithmIndex = value;
			this.curveAmount = this._curveAmount;
		}
	};

	Panner = class Panner extends Super<typeof PANNER_DEFAULTS> {
		panner: StereoPannerNode;
		constructor(propertiesArg: Properties<typeof PANNER_DEFAULTS>) {
			super();
			this.defaults = PANNER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}

			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.panner = userContext.createStereoPanner();
			this.output = userContext.createGain();

			this.activateNode.connect(this.panner);
			this.panner.connect(this.output);

			this.pan = initValue(properties.pan, this.defaults.pan.value);
			this.bypass = properties.bypass || this.defaults.bypass.value;
		}
		get pan(): AudioParam {
			return this.panner.pan;
		}
		set pan(value: number) {
			this.panner.pan.value = value;
		}
	};

	Phaser = class Phaser extends Super<typeof PHASER_DEFAULTS> {
		stage: number;
		splitter: ChannelSplitterNode;
		feedbackGainNodeL: GainNode;
		feedbackGainNodeR: GainNode;
		merger: ChannelMergerNode;
		filteredSignal: GainNode;
		filtersL: BiquadFilterNode[];
		filtersR: BiquadFilterNode[];
		lfoL: InstanceType<Tuna["LFO"]>;
		lfoR: InstanceType<Tuna["LFO"]>;
		private _depth!: number;
		private _baseModulationFrequency!: number;
		private _rate!: number;
		private _feedback!: number;
		private _stereoPhase!: number;

		constructor(propertiesArg: Properties<typeof PHASER_DEFAULTS>) {
			super();
			this.stage = 4;
			this.defaults = PHASER_DEFAULTS;

			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.splitter = this.activateNode = userContext.createChannelSplitter(2);
			this.filtersL = [];
			this.filtersR = [];
			this.feedbackGainNodeL = userContext.createGain();
			this.feedbackGainNodeR = userContext.createGain();
			this.merger = userContext.createChannelMerger(2);
			this.filteredSignal = userContext.createGain();
			this.output = userContext.createGain();
			this.lfoL = new userInstance.LFO({
				target: this.filtersL,
				callback: this.callback,
			});
			this.lfoR = new userInstance.LFO({
				target: this.filtersR,
				callback: this.callback,
			});

			let i = this.stage;
			while (i--) {
				this.filtersL[i] = userContext.createBiquadFilter();
				this.filtersR[i] = userContext.createBiquadFilter();
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
			return this._depth;
		}
		set depth(value) {
			this._depth = value;
			this.lfoL.oscillation = this._baseModulationFrequency * this._depth;
			this.lfoR.oscillation = this._baseModulationFrequency * this._depth;
		}
		get rate() {
			return this._rate;
		}
		set rate(value) {
			this._rate = value;
			this.lfoL.frequency = this._rate;
			this.lfoR.frequency = this._rate;
		}
		get baseModulationFrequency() {
			return this._baseModulationFrequency;
		}
		set baseModulationFrequency(value) {
			this._baseModulationFrequency = value;
			this.lfoL.offset = this._baseModulationFrequency;
			this.lfoR.offset = this._baseModulationFrequency;
			this.depth = this._depth;
		}
		get feedback() {
			return this._feedback;
		}
		set feedback(value) {
			this._feedback = value;
			this.feedbackGainNodeL.gain.setTargetAtTime(
				this._feedback,
				userContext.currentTime,
				0.01,
			);
			this.feedbackGainNodeR.gain.setTargetAtTime(
				this._feedback,
				userContext.currentTime,
				0.01,
			);
		}
		get stereoPhase() {
			return this._stereoPhase;
		}
		set stereoPhase(value) {
			this._stereoPhase = value;
			let newPhase = this.lfoL._phase + (this._stereoPhase * Math.PI) / 180;
			newPhase = fmod(newPhase, 2 * Math.PI);
			this.lfoR._phase = newPhase;
		}

		callback(filters: { frequency: { value: number } }[], value: number) {
			for (let stage = 0; stage < 4; stage++) {
				filters[stage].frequency.value = value;
			}
		}
	};

	PingPongDelay = class PingPongDelay extends Super<
		typeof PINGPONGDELAY_DEFAULTS
	> {
		wet: GainNode;
		stereoToMonoMix: GainNode;
		feedbackLevel: GainNode;
		delayLeft: DelayNode;
		delayRight: DelayNode;
		splitter: ChannelSplitterNode;
		merger: ChannelMergerNode;
		private _delayTimeLeft!: number;
		private _delayTimeRight!: number;

		constructor(propertiesArg: Properties<typeof PINGPONGDELAY_DEFAULTS>) {
			super();
			this.defaults = PINGPONGDELAY_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.wet = userContext.createGain();
			this.stereoToMonoMix = userContext.createGain();
			this.feedbackLevel = userContext.createGain();
			this.output = userContext.createGain();
			this.delayLeft = userContext.createDelay(10);
			this.delayRight = userContext.createDelay(10);

			this.activateNode = userContext.createGain();
			this.splitter = userContext.createChannelSplitter(2);
			this.merger = userContext.createChannelMerger(2);

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
			return this._delayTimeLeft;
		}
		set delayTimeLeft(value) {
			this._delayTimeLeft = value;
			this.delayLeft.delayTime.value = value / 1000;
		}
		get delayTimeRight() {
			return this._delayTimeRight;
		}
		set delayTimeRight(value) {
			this._delayTimeRight = value;
			this.delayRight.delayTime.value = value / 1000;
		}
		get wetLevel(): AudioParam {
			return this.wet.gain;
		}
		set wetLevel(value: number) {
			this.wet.gain.setTargetAtTime(value, userContext.currentTime, 0.01);
		}
		get feedback(): AudioParam {
			return this.feedbackLevel.gain;
		}
		set feedback(value: number) {
			this.feedbackLevel.gain.setTargetAtTime(
				value,
				userContext.currentTime,
				0.01,
			);
		}
	};

	Tremolo = class Tremolo extends Super<typeof TREMOLO_DEFAULTS> {
		splitter: ChannelSplitterNode;
		amplitudeL: GainNode;
		amplitudeR: GainNode;
		merger: ChannelMergerNode;
		lfoL: InstanceType<Tuna["LFO"]>;
		lfoR: InstanceType<Tuna["LFO"]>;
		private _intensity!: number;
		private _rate!: number;
		private _stereoPhase!: number;

		constructor(propertiesArg: Properties<typeof TREMOLO_DEFAULTS>) {
			super();
			this.defaults = TREMOLO_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.splitter = this.activateNode = userContext.createChannelSplitter(2);
			this.amplitudeL = userContext.createGain();
			this.amplitudeR = userContext.createGain();
			this.merger = userContext.createChannelMerger(2);
			this.output = userContext.createGain();
			this.lfoL = new userInstance.LFO({
				target: this.amplitudeL.gain,
				callback: pipe,
			});
			this.lfoR = new userInstance.LFO({
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
			return this._intensity;
		}
		set intensity(value) {
			this._intensity = value;
			this.lfoL.offset = 1 - this._intensity / 2;
			this.lfoR.offset = 1 - this._intensity / 2;
			this.lfoL.oscillation = this._intensity;
			this.lfoR.oscillation = this._intensity;
		}
		get rate() {
			return this._rate;
		}
		set rate(value) {
			this._rate = value;
			this.lfoL.frequency = this._rate;
			this.lfoR.frequency = this._rate;
		}
		get stereoPhase() {
			return this._stereoPhase;
		}
		set stereoPhase(value) {
			this._stereoPhase = value;
			let newPhase = this.lfoL._phase + (this._stereoPhase * Math.PI) / 180;
			newPhase = fmod(newPhase, 2 * Math.PI);
			this.lfoR.phase = newPhase;
		}
	};

	WahWah = class WahWah extends Super<typeof WAHWAH_DEFAULTS> {
		filterFreqTimeout: ReturnType<typeof setTimeout> | number;
		envelopeFollower: InstanceType<Tuna["EnvelopeFollower"]>;
		filterBp: BiquadFilterNode;
		filterPeaking: BiquadFilterNode;
		activateNode: GainNode;
		output: GainNode;
		private _automode!: boolean;
		private _sweep!: number;
		private _sensitivity!: number;
		private _baseFrequency!: number;
		private _excursionOctaves!: number;
		private _resonance!: number;
		private _excursionFrequency!: number;
		constructor(propertiesArg: Properties<typeof WAHWAH_DEFAULTS>) {
			super();
			this.filterFreqTimeout = 0;
			this.defaults = WAHWAH_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.input = userContext.createGain();
			this.activateNode = userContext.createGain();
			this.envelopeFollower = new userInstance.EnvelopeFollower({
				target: this,
				callback: <T>(context: { sweep: T }, value: T) => {
					context.sweep = value;
				},
			});
			this.filterBp = userContext.createBiquadFilter();
			this.filterPeaking = userContext.createBiquadFilter();
			this.output = userContext.createGain();

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
			return this._automode;
		}
		set automode(value) {
			this._automode = value;
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
			return this._sweep;
		}
		set sweep(value) {
			this._sweep =
				(value > 1 ? 1 : value < 0 ? 0 : value) ** this._sensitivity;
			this.setFilterFreq();
		}
		get baseFrequency() {
			return this._baseFrequency;
		}
		set baseFrequency(value) {
			this._baseFrequency = 50 * 10 ** (value * 2);
			this._excursionFrequency = Math.min(
				userContext.sampleRate / 2,
				this.baseFrequency * 2 ** this._excursionOctaves,
			);
			this.setFilterFreq();
		}
		get excursionOctaves() {
			return this._excursionOctaves;
		}
		set excursionOctaves(value) {
			this._excursionOctaves = value;
			this._excursionFrequency = Math.min(
				userContext.sampleRate / 2,
				this.baseFrequency * 2 ** this._excursionOctaves,
			);
			this.setFilterFreq();
		}
		get sensitivity() {
			return this._sensitivity;
		}
		set sensitivity(value) {
			this._sensitivity = 10 ** value;
		}
		get resonance() {
			return this._resonance;
		}
		set resonance(value) {
			this._resonance = value;
			this.filterPeaking.Q.value = this._resonance;
		}

		setFilterFreq() {
			try {
				this.filterBp.frequency.value = Math.min(
					22050,
					this._baseFrequency + this._excursionFrequency * this._sweep,
				);
				this.filterPeaking.frequency.value = Math.min(
					22050,
					this._baseFrequency + this._excursionFrequency * this._sweep,
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
	};

	EnvelopeFollower = class EnvelopeFollower extends Super<
		typeof ENVELOPEFOLLOWER_DEFAULTS
	> {
		private _callback!: <T>(
			context: {
				sweep: T;
			},
			value: T,
		) => void;
		buffersize: number;
		envelope: number;
		sampleRate: number;
		jsNode: ScriptProcessorNode;
		private _envelope: number;
		private _attackTime!: number;
		private _attackC!: number;
		private _releaseTime!: number;
		private _releaseC!: number;
		private _target?: InstanceType<Tuna["WahWah"]>;
		activated: boolean;
		constructor(
			propertiesArg: Properties<typeof ENVELOPEFOLLOWER_DEFAULTS> & {
				target?: InstanceType<Tuna["WahWah"]>;
				callback?: <T>(context: { sweep: T }, value: T) => void;
			},
		) {
			super();
			this.buffersize = 256;
			this.envelope = 0;
			this.sampleRate = 44100;
			this.defaults = ENVELOPEFOLLOWER_DEFAULTS;
			let properties = propertiesArg;
			if (!properties) {
				properties = this.getDefaults();
			}
			this.activated = false;
			this.input = userContext.createGain();
			this.jsNode = this.output = userContext.createScriptProcessor(
				this.buffersize,
				1,
				1,
			);

			this.input.connect(this.output);

			this.attackTime = initValue(
				properties.attackTime,
				this.defaults.attackTime.value,
			);
			this.releaseTime = initValue(
				properties.releaseTime,
				this.defaults.releaseTime.value,
			);
			this._envelope = 0;
			this.target = properties.target;
			this.callback = properties.callback || (() => {});

			this.bypass = properties.bypass || this.defaults.bypass.value;
		}
		get attackTime() {
			return this._attackTime;
		}
		set attackTime(value) {
			this._attackTime = value;
			this._attackC = Math.exp(
				((-1 / this._attackTime) * this.sampleRate) / this.buffersize,
			);
		}
		get releaseTime() {
			return this._releaseTime;
		}
		set releaseTime(value) {
			this._releaseTime = value;
			this._releaseC = Math.exp(
				((-1 / this._releaseTime) * this.sampleRate) / this.buffersize,
			);
		}
		get callback() {
			return this._callback;
		}
		set callback(value: <T>(
			context: {
				sweep: T;
			},
			value: T,
		) => void) {
			if (typeof value === "function") {
				this._callback = value;
			} else {
				console.error(
					`tuna.js: ${this.constructor.name}: Callback must be a function!`,
				);
			}
		}
		get target(): InstanceType<Tuna["WahWah"]> | undefined {
			return this._target;
		}
		set target(value: InstanceType<Tuna["WahWah"]> | undefined) {
			this._target = value;
		}

		activate(doActivate: boolean) {
			this.activated = doActivate;
			if (doActivate) {
				this.jsNode.connect(userContext.destination);
				this.jsNode.onaudioprocess = this.returnCompute(this);
			} else {
				this.jsNode.disconnect();
				this.jsNode.onaudioprocess = null;
			}
			if (this.activateCallback) {
				this.activateCallback(doActivate);
			}
		}

		returnCompute(instance: this) {
			return (event: AudioProcessingEvent) => {
				instance.compute(event);
			};
		}

		compute(event: AudioProcessingEvent) {
			const count = event.inputBuffer.getChannelData(0).length;
			const channels = event.inputBuffer.numberOfChannels;
			let current: number;
			let chan: number;
			let rms: number;
			let i: number;
			chan = rms = i = 0;

			for (chan = 0; chan < channels; ++chan) {
				for (i = 0; i < count; ++i) {
					current = event.inputBuffer.getChannelData(chan)[i];
					rms += current * current;
				}
			}
			rms = Math.sqrt(rms / channels);

			if (this._envelope < rms) {
				this._envelope *= this._attackC;
				this._envelope += (1 - this._attackC) * rms;
			} else {
				this._envelope *= this._releaseC;
				this._envelope += (1 - this._releaseC) * rms;
			}
			this._target && this._callback(this._target, this._envelope);
		}
	};

	LFO = class LFO extends Super<typeof LFO_DEFAULTS> {
		bufferSize: number;
		sampleRate: number;
		output: ScriptProcessorNode;

		private _frequency!: number;
		private _phaseInc!: number;
		private _offset!: number;
		private _oscillation!: number;
		_phase!: number;
		private _target!: AudioParam | AudioNode | AudioNode[] | undefined;

		constructor(
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
			this.input = userContext.createGain();
			this.output = userContext.createScriptProcessor(256, 1, 1);
			this.activateNode = userContext.destination;

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
			return this._frequency;
		}
		set frequency(value) {
			this._frequency = value;
			this._phaseInc =
				(2 * Math.PI * this._frequency * this.bufferSize) / this.sampleRate;
		}
		get offset() {
			return this._offset;
		}
		set offset(value) {
			this._offset = value;
		}
		get oscillation() {
			return this._oscillation;
		}
		set oscillation(value) {
			this._oscillation = value;
		}
		get phase() {
			return this._phase;
		}
		set phase(value) {
			this._phase = value;
		}
		get target(): AudioParam | AudioNode | AudioNode[] | undefined {
			return this._target;
		}
		set target(value: AudioParam | AudioNode | AudioNode[] | undefined) {
			this._target = value;
		}

		activate(doActivate: boolean) {
			if (doActivate) {
				this.output.connect(userContext.destination);
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
				this._phase += this._phaseInc;
				if (this._phase > 2 * Math.PI) {
					this._phase = 0;
				}
				callback(
					this._target,
					this._offset + this._oscillation * Math.sin(this._phase),
				);
			};
		}
	};
	/**
    
	toString() {
		return "Please visit https://github.com/Theodeus/tuna/wiki for instructions on how to use Tuna.js";
	}
    */
}
let userContext: AudioContext;
let userInstance: Tuna;
const pipe = <T>(param: { value: T }, val: T) => {
	param.value = val;
};

function connectify(context: AudioContext & { __connectified__?: boolean }) {
	if (context.__connectified__ === true) return;

	const gain = context.createGain();
	const proto = Object.getPrototypeOf(Object.getPrototypeOf(gain));
	const oconnect = proto.connect;

	proto.connect = shimConnect;
	context.__connectified__ = true; // Prevent overriding connect more than once

	function shimConnect(this: AudioNode, ...args: AudioNode[]) {
		const node = args[0];
		args[0] = node instanceof Super ? node.input : node;
		oconnect.apply(this, args);
		return node;
	}
}

function dbToWAVolume(db: number) {
	return Math.max(0, Math.round(100 * 2 ** (db / 6)) / 100);
}

function fmod(x: number, y: number) {
	// http://kevin.vanzonneveld.net
	// *     example 1: fmod(5.7, 1.3);
	// *     returns 1: 0.5
	let tmp: number | RegExpMatchArray | null;
	let tmp2: number | RegExpMatchArray | null;
	let p = 0;
	let pY = 0;
	let l = 0.0;
	let l2 = 0.0;

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/)!;
	p = Number.parseInt(tmp[2], 10) - `${tmp[1]}`.length;
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/)!;
	pY = Number.parseInt(tmp[2], 10) - `${tmp[1]}`.length;

	if (pY > p) {
		p = pY;
	}

	tmp2 = x % y;

	if (p < -100 || p > 20) {
		// toFixed will give an out of bound error so we fix it like this:
		l = Math.round(Math.log(tmp2) / Math.log(10));
		l2 = 10 ** l;

		return Number.parseFloat((tmp2 / l2).toFixed(l - p)) * l2;
	}
	return Number.parseFloat(tmp2.toFixed(-p));
}

function sign(x: number) {
	if (x === 0) {
		return 1;
	}
	return Math.abs(x) / x;
}

function tanh(n: number) {
	return (Math.exp(n) - Math.exp(-n)) / (Math.exp(n) + Math.exp(-n));
}

function initValue<T>(userVal: T | undefined, defaultVal: T) {
	return userVal === undefined ? defaultVal : userVal;
}
