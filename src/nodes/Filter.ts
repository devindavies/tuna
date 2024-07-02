import { Super } from "../Super";
import { FILTER_DEFAULTS } from "../constants";
import type { Properties } from "../types/Properties";
import { initValue } from "../utils/initValue";

export class Filter extends Super<typeof FILTER_DEFAULTS> {
	filter: BiquadFilterNode;
	constructor(
		context: AudioContext,
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
		this.userContext = context;
		this.input = this.userContext.createGain();
		this.activateNode = this.userContext.createGain();
		this.filter = this.userContext.createBiquadFilter();
		this.output = this.userContext.createGain();

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
		this.filter.gain.setTargetAtTime(value, this.userContext.currentTime, 0.01);
	}
	get frequency(): AudioParam {
		return this.filter.frequency;
	}
	set frequency(value: number) {
		this.filter.frequency.setTargetAtTime(
			value,
			this.userContext.currentTime,
			0.01,
		);
	}
}
