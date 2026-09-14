// Deliberately retain legacy syntax: these functions are decompiled by StepCompiler.
export function legacyRedo() {
	"step 0";
	event.trace.push("start");
	event.value = 1;
	"step 1";
	event.trace.push("value:" + event.value + ":result:" + result.answer);
	event.value++;
	if (event.value < 3) event.redo();
	"step 2";
	event.trace.push("end:" + event.value);
	event.finish();
}
export function legacyGoto() {
	"step 0";
	event.trace.push("start");
	event.goto(2);
	"step 1";
	event.trace.push("must-not-run");
	"step 2";
	event.trace.push("end");
	event.finish();
}
export async function modernAsync(event) {
	event.trace.push("start");
	await Promise.resolve();
	event.trace.push("end");
	event.finish();
}
