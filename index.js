/* jshint node: true */

var path = require('path');
var fs = require('fs');

var Q = require('q');
var walk = require('walk');
var mime = require('mime');

var emailTemplate = require('./lib/email-template');

exports.render = function (templatesDir) {
	'use strict';

	var walker = walk.walk(templatesDir);
	var defer = Q.defer();

	var files = {};
	var proc = 0;
	var end = false;

	function onEnd() {
		if (end && proc === 0) {
			defer.resolve(files);
		}
	}

	walker.on('end', function () {
		end = true;
		onEnd();
	});

	walker.on('file', function (root, fileStats, next) {
		var file = path.join(root, fileStats.name);
		var mimeType = mime.lookup(file);

		++proc;

		Q.nfcall(fs.readFile, file)
			.then(emailTemplate({
				type: mimeType,
				webResources: {
					relativeTo: path.dirname(file)
				}
			}))
			.then(function (data) {
				if (data !== null) {
					files[file] = data;
				}
				--proc;
				onEnd();
				next();
			}).fail(function (err) {
				defer.reject(err);
			}).catch(function (err) {
				defer.reject(err);
			});
	});

	return defer.promise;
};
