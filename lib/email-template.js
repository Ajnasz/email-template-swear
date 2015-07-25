/* jshint node: true */
'use strict';

var juice = require('juice');
var Q = require('q');

var jadeCompiler = {
	compile: function (html, locals) {
		var options = {
			pretty: true,
			compileDebug: true
		};

		return Q.fcall(function () {
			return require('jade').compile(html, options)(locals);
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

var invalidType = {
	compile: function () {
		return Q.fcall(function () {
			return null;
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
		return invalidType;
	}
}

function juiceIt(webResources) {
	return function (data) {
		if (!data) {
			return null;
		}

		var options = webResources ? {webResources: webResources} : {};

		return Q.nfcall(juice.juiceResources, data, options);
	};
}

function run(options) {
	return function (data) {
		return getDataParser(options).compile(data.toString('utf8'), options.locals)
			.then(juiceIt(options.webResources));
	};
}

module.exports = run;
