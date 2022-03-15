var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "111111",
	database: "database",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (error, results, feilds) {
	if (error);
	console.log(results);
});

connection.end;
