export function initValue<T>(userVal: T | undefined, defaultVal: T) {
	return userVal === undefined ? defaultVal : userVal;
}
