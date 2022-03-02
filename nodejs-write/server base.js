var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	console.log(pathname);
	if (pathname === "/") {
		response.writeHead(200);
		response.end(`<title>Web</title>Hello`);
	} else {
		response.writeHead(404);
		response.end(`
		<!doctype html>
		<html>
		<head>
		  <title>404-Not Found</title>
		  <meta charset="utf-8">
		</head>
		<style>
		a {
			color: blue;
			text-decoration: none;
	  
			font-size: large;
		}
		body {
			text-align: center;
			font-family: Arial, Helvetica, sans-serif;
		}
		</style>
		<body>
		  <h1>404 Not Found!</h1>
		</body>
		</html>
		`);
	}
});
app.listen(3000);
