import type { DATATYPE } from "./DATATYPE";
export type Defaults = Record<
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
