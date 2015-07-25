## EXample:

```
require('email-template-swear').render('path/to/templates', {
	variable: 'pass to template',
	otherVariable: [
		{item: 'list'}
		{item: 'list2'}
	]
}).then(function (results) {
	var fileNames = Object.keys(results);

	fileNames.forEach(function (fileName) {
		var renderedCode = fileNames[fileName];
		console.log(fileName, ':', renderedCode);
	});
}).fail(function (error) {
	console.error(error);
}).catch(function (error) {
	console.error(error);
});
```
