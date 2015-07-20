'use strict';

var juice = require('juice');
var Q = require('q');

var jadeCompiler = {
	compile: function (html) {
		var options = {
			pretty: true,
			compileDebug: true
		};

		return Q.fcall(function () {
			return require('jade').compile(html, options)();
		});

	}
};

var noCompiler = {
	compile: function (html) {
		return Q.fcall(function () {
			return html;
		});
	}
};

var htmlCompiler = noCompiler;
var txtCompiler = noCompiler;

function getDataParser(options) {
	if (options.type === 'html' || options.type === 'text/html') {
		return htmlCompiler;
	} else if (options.type === 'txt' || options.type === 'plain/text') {
		return txtCompiler;
	} else if (options.type === 'jade' || options.type === 'text/jade') {
		return jadeCompiler;
	} else {
		return null;
	}
}

function juiceIt(data) {
	if (!data) {
		return null;
	}

	return Q.nfcall(juice.juiceResources, data, {});
}
function run(options) {
	return function (data) {
		return getDataParser(options).compile(data.toString('utf8')).then(juiceIt);
	};
}

module.exports = run;
