var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var path = require("path");
var Template = require("./modules/web-values.js");

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
				var List = Template.list(filelist);
				var template = Template.HTML(
					title,
					List,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`,
					Template.navbar(filelist)
				);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir("./data", function (error, filelist) {
				var publicPath = path.parse(queryData.id).base;
				var sanitizedTitle = sanitizeHtml(title);
				var sanitizedDescription = sanitizeHtml(description, {
					allowedTags: ["h1", "strong", "a"],
				});
				fs.readFile(
					`data/${publicPath}`,
					"utf8",
					function (err, description) {
						var title = queryData.id;
						var List = Template.list(filelist);
						var template = Template.HTML(
							sanitizedTitle,
							List,
							`<h2>${title}</h2>${sanitizedDescription}`,
							`<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a> <form action="delete_process" method="post" onsubmit="really?"><input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete"></form>`,
							Template.navbar(filelist)
						);
						response.writeHead(200);
						response.end(template);
					}
				);
			});
		}
	} else if (pathname === "/create") {
		fs.readdir("./data", function (error, filelist) {
			var title = "create";
			var List = Template.list(filelist);
			var template = Template.HTML(
				title,
				List,
				`
			<form action="/update_process" method="post">
			  <p><input type="text" name="title" placeholder="title"></p>
			  <p>
				<textarea name="description" placeholder="description"></textarea>
			  </p>
			  <p>
				<input type="submit">
			  </p>
			</form>
		  `,
				``,
				Template.navbar(filelist)
			);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname === "/write_process") {
		var body = "";
		request.on("data", function (data) {
			body = body + data;
		});
		request.on("end", function () {
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;
			fs.writeFile(`data/${title}`, description, "utf8", function (err) {
				response.writeHead(302, { Location: `/?id=${title}` });
				response.end();
			});
		});
	} else if (pathname === "/update") {
		fs.readdir("./data", function (error, filelist) {
			var publicPath = path.parse(queryData.id).base;
			fs.readFile(
				`data/${publicPath}`,
				"utf8",
				function (err, description) {
					var title = queryData.id;
					var List = Template.list(filelist);
					var template = Template.HTML(
						title,
						List,
						`
						<form action="/update_process" method="post">
						<input type="hidden" name="id" value="${title}"
						<p><input type="text" name="title" placeholder="title" value="${title}"></p>
						<p>
						  <textarea name="description" placeholder="description">${description}</textarea>
						</p>
						<p>
						  <input type="submit">
						</p>
					  </form>
						`,
						``,
						Template.navbar(filelist)
					);
					response.writeHead(200);
					response.end(template);
				}
			);
		});
	} else if (pathname === "/update_process") {
		var body = "";
		request.on("data", function (data) {
			body = body + data;
		});
		request.on("end", function () {
			var post = qs.parse(body);
			var id = post.id;
			var title = post.title;
			var description = post.description;
			fs.rename(`data/${id}`, `data/${title}`, function (error) {
				fs.writeFile(
					`data/${title}`,
					description,
					"utf8",
					function (err) {
						response.writeHead(302, { Location: `/?id=${title}` });
						response.end();
					}
				);
			});
		});
	} else if (pathname === "/delete_process") {
		var body = "";
		request.on("data", function (data) {
			body = body + data;
		});
		request.on("end", function () {
			var post = qs.parse(body);
			var id = post.id;
			var publicDel = path.parse(id).base;
			fs.unlink(`data/${publicDel}`, function (error) {
				response.writeHead(302, { Location: `/` });
				response.end();
			});
		});
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
//Made by Jonathan Lim
//Visit my GitHub! https://github.com/jonathan0827
