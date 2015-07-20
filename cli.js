/* jshint node: true */

var fs = require('fs');
var path = require('path');

require('./').render(process.argv[2]).then(function (files) {
	'use strict';
	Object.keys(files).forEach(function (name) {
		var outpuName = path.join(process.argv[3], name.replace(process.argv[2], '')) + '.html';
		fs.writeFile(outpuName, files[name], function () {
			console.log('written', outpuName);
		});
	});
});
