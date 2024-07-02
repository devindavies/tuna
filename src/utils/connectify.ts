import { Super } from "../Super";

export function connectify(
	context: AudioContext & { __connectified__?: boolean },
) {
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
