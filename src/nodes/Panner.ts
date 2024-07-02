import { Super } from "../Super";
import { PANNER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Panner extends Super<typeof PANNER_DEFAULTS> {
	panner: StereoPannerNode;
	constructor(
		context: AudioContext,
		propertiesArg: Properties<typeof PANNER_DEFAULTS>,
	) {
		super();
		this.defaults = PANNER_DEFAULTS;
		let properties = propertiesArg;
		if (!properties) {
			properties = this.getDefaults();
		}
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.panner = this.userContext.createStereoPanner();
		this.output = this.userContext.createGain();

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
}
