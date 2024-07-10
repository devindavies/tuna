import type { Properties } from "./types/Properties";
import { Bitcrusher } from "./nodes/Bitcrusher";
import { Compressor } from "./nodes/Compressor";
import { Cabinet } from "./nodes/Cabinet";
import { Convolver } from "./nodes/Convolver";
import { Gain } from "./nodes/Gain";
import { MoogFilter } from "./nodes/MoogFilter";
import { Overdrive } from "./nodes/Overdrive";
import { Filter } from "./nodes/Filter";
import { Panner } from "./nodes/Panner";
import { Phaser } from "./nodes/Phaser";
import { Chorus } from "./nodes/Chorus";
import { Delay } from "./nodes/Delay";
import { PingPongDelay } from "./nodes/PingPongDelay";
import { Tremolo } from "./nodes/Tremolo";
import { WahWah } from "./nodes/WahWah";
import { EnvelopeFollower } from "./nodes/EnvelopeFollower";
import { LFO } from "./nodes/LFO";

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

export class Tuna {
	userContext: AudioContext;
	userInstance: this;

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

		this.userContext = newContext;
		this.userInstance = this;
	}

	createBitcrusher(properties: Properties<Bitcrusher["defaults"]>) {
		return new Bitcrusher(this.userContext, properties);
	}

	createCompressor(properties: Properties<Compressor["defaults"]>) {
		return new Compressor(this.userContext, properties);
	}

	createCabinet(properties: Properties<Cabinet["defaults"]>) {
		return new Cabinet(this.userInstance, this.userContext, properties);
	}

	createChorus(properties: Properties<Chorus["defaults"]>) {
		return new Chorus(this.userInstance, this.userContext, properties);
	}

	createConvolver(
		properties: Properties<Convolver["defaults"]> & { impulse?: string },
	) {
		return new Convolver(this.userContext, properties);
	}

	createDelay(properties: Properties<Delay["defaults"]>) {
		return new Delay(this.userContext, properties);
	}

	createFilter(properties: Properties<Filter["defaults"]>) {
		return new Filter(this.userContext, properties);
	}

	createGain(properties: Properties<Gain["defaults"]>) {
		return new Gain(this.userContext, properties);
	}

	createMoogFilter(properties: Properties<MoogFilter["defaults"]>) {
		return new MoogFilter(this.userContext, properties);
	}

	createOverdrive(properties: Properties<Overdrive["defaults"]>) {
		return new Overdrive(this.userContext, properties);
	}

	createPanner(properties: Properties<Panner["defaults"]>) {
		return new Panner(this.userContext, properties);
	}

	createPhaser(properties: Properties<Phaser["defaults"]>) {
		return new Phaser(this.userInstance, this.userContext, properties);
	}

	createPingPongDelay(properties: Properties<PingPongDelay["defaults"]>) {
		return new PingPongDelay(this.userContext, properties);
	}

	createTremolo(properties: Properties<Tremolo["defaults"]>) {
		return new Tremolo(this.userInstance, this.userContext, properties);
	}

	createWahWah(properties: Properties<WahWah["defaults"]>) {
		return new WahWah(this.userInstance, this.userContext, properties);
	}

	createEnvelopeFollower(
		properties: Properties<EnvelopeFollower["defaults"]> & {
			target?: WahWah;
			callback?: <T>(context: { sweep: T }, value: T) => void;
		},
	) {
		return new EnvelopeFollower(this.userContext, properties);
	}

	createLFO(
		properties: Properties<LFO["defaults"]> & {
			target?: AudioParam | AudioNode | AudioNode[];
			callback?: (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				...args: any[]
			) => void;
		},
	) {
		return new LFO(this.userContext, properties);
	}

	toString() {
		return "Please visit https://github.com/Theodeus/tuna/wiki for instructions on how to use Tuna.js";
	}
}

export default Tuna;
