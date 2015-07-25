/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

require('./').render(process.argv[2], {
	items: [
		{name: 'Item name'}
	]
}).then(function (files) {
	Object.keys(files).forEach(function (name) {
		var outpuName = path.join(process.argv[3], name.replace(process.argv[2], '')) + '.out';
		fs.writeFile(outpuName, files[name], function () {
			console.log('written', outpuName);
		});
	});
}).fail(function (err) {
	console.error('compile failed', err);
}).catch(function (err) {
	console.error('Err: compile failed', err);
});
