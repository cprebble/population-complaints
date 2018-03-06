/* eslint-env browser */
process.env.NODE_ENV = "test";

const { JSDOM } = require("jsdom");

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

const dom = new JSDOM(`<!doctype html><html><body></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
propagateToGlobal(global.window);
