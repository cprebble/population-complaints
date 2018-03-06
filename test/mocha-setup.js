
process.env.NODE_ENV = "test";
require("babel-register");

global.requestAnimationFrame = function(callback) {
	setTimeout(callback, 0);
};

function propagateToGlobal (window) {
	for (const key in window) {
		if (!window.hasOwnProperty(key)) continue;
		if (key in global) continue;
		global[key] = window[key];
	}
}

propagateToGlobal(global.window);
