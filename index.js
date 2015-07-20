'use strict';
var sys = require('sys');
var path = require('path');

var Q = require('q');
var walk = require('walk');
var mime = require('mime');
var emailTemplate = require('lib/email-template');

var fs = require('fs');

process.chdir('templates');
var walker = walk.walk('./');
walker.on('file', function (root, fileStats, next) {
	var file = path.resolve(root, fileStats.name);
	var mimeType = mime.lookup(file);
	Q.nfcall(fs.readFile, file)
		.then(emailTemplate({type: mimeType}))
		.then(function (data) {
			sys.puts(data);
		});
	next();
});
