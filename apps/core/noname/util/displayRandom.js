// Drawing and audio must never advance the random sequence used by game rules.
// This stream is not used for cryptography or gameplay decisions.
export function createDisplayRandom(seed = 0x6d2b79f5) {
	let state = seed >>> 0 || 1;
	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		return (state >>> 0) / 0x100000000;
	};
}
export const displayRandom = createDisplayRandom();
export function displayChoice(values, ...excluded) {
	const choices = values.filter(value => !excluded.includes(value));
	return choices[Math.floor(displayRandom() * choices.length)];
}
