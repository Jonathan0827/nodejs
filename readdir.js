const testFolder = "./tests/";
const fs = require("fs");

fs.readdir(testFolder, function (err, filelist) {
	console.log(filelist);
});
