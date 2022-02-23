var http = require("http");
var fs = require("fs");
var url = require("url");

function templateHTML(title, list, body) {
	return `
  <!doctype html>
  <html>
  <head>
    <title>${title}</title>
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
  h1{
	font-size: xx-large;
  }
  </style>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
	<a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist) {
	var list = "<ul>";
	var i = 0;
	while (i < filelist.length) {
		list =
			list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list + "</ul>";
	return list;
}

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	console.log(pathname);
	if (pathname === "/") {
		if (queryData.id === undefined) {
			fs.readdir("./data", function (error, filelist) {
				var title = "Welcome";
				var description = "Hello, Node.js";
				var list = templateList(filelist);
				var template = templateHTML(
					title,
					list,
					`<h2>${title}</h2>${description}`
				);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir("./data", function (error, filelist) {
				fs.readFile(
					`data/${queryData.id}`,
					"utf8",
					function (err, description) {
						var title = queryData.id;
						var list = templateList(filelist);
						var template = templateHTML(
							title,
							list,
							`<h2>${title}</h2>${description}`
						);
						response.writeHead(200);
						response.end(template);
					}
				);
			});
		}
	} else if (pathname === "/create") {
		fs.readdir("./data", function (error, filelist) {
			var title = "WEB - create";
			var list = templateList(filelist);
			var template = templateHTML(
				title,
				list,
				`
			<form action="http://localhost:1000/write_process" method="post">
			  <p><input type="text" name="title" placeholder="title"></p>
			  <p>
				<textarea name="description" placeholder="description"></textarea>
			  </p>
			  <p>
				<input type="submit">
			  </p>
			</form>
		  `
			);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname === "/write_process") {
		var body = "";
		request.on("data", function (data) {
			body = body + data;
		});
		request.on("data", function (qs) {
			var post = qs.parse(body);
			console.log(post);
		});
		response.writeHead(200);
		response.end(`write process`);
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
app.listen(1000);
