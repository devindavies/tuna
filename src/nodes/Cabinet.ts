import { Super } from "../Super";
import { CABINET_DEFAULTS } from "../constants";
import type Tuna from "../tuna";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";
import type { Convolver } from "./Convolver";

export class Cabinet extends Super<typeof CABINET_DEFAULTS> {
	userInstance: Tuna;
	computeMakeup(): number {
		throw new Error("Method not implemented.");
	}
	makeupNode: GainNode;
	convolver: Convolver;

	constructor(
		instance: Tuna,
		context: AudioContext,
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
		this.userContext = context;
		this.userInstance = instance;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.convolver = this.newConvolver(
			properties.impulsePath || "../impulses/impulse_guitar.wav",
		);
		this.makeupNode = this.userContext.createGain();
		this.output = this.userContext.createGain();

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
			this.userContext.currentTime,
			0.01,
		);
	}

	newConvolver = (impulsePath: string) =>
		this.userInstance.createConvolver({
			impulse: impulsePath,
			dryLevel: 0,
			wetLevel: 1,
		});
}
