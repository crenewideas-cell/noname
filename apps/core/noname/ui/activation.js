import { lib } from "noname";

/** Touch UI may also be operated with a mouse or trackpad. */
export function listenForActivation(node, handler) {
	if (!lib.config.touchscreen) {
		node.addEventListener("click", handler);
		return;
	}
	let lastTouch = -Infinity;
	node.addEventListener("touchend", () => { lastTouch = performance.now(); });
	node.addEventListener("touchend", handler);
	node.addEventListener("click", function (event) {
		// Browsers synthesize a click after touchend; selecting twice would
		// immediately deselect a card or confirm the following prompt.
		if (event.sourceCapabilities?.firesTouchEvents || event.pointerType === "touch" || performance.now() - lastTouch < 750) return;
		handler.call(this, event);
	});
}
