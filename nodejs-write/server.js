var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
function templeteHTML(title, list, body, control) {
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
    ${body}
	<br>
	${control}
	<br>
	<input type="button" value="night" onclick="colorScheme(this)" />
	<script>
		document.querySelector("body").dataset.mode = "day";

		var cmode = document.querySelector("body").dataset.mode;
		function colorScheme(i) {
			if (cmode === "day") {
				document.querySelector("body").style.backgroundColor = "black";
				document.querySelector("body").style.color = "white";
				document.querySelector("body").dataset.mode = "night";
				cmode = "night";
				i.value = "day";
			} else {
				document.querySelector("body").style.backgroundColor = "white";
				document.querySelector("body").style.color = "black";
				document.querySelector("body").dataset.mode = "day";
				cmode = "day";
				i.value = "night";
			}
		}
	</script>
  </body>
  </html>
  `;
}
function templeteList(filelist) {
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
				var list = templeteList(filelist);
				var templete = templeteHTML(
					title,
					list,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`
				);
				response.writeHead(200);
				response.end(templete);
			});
		} else {
			fs.readdir("./data", function (error, filelist) {
				fs.readFile(
					`data/${queryData.id}`,
					"utf8",
					function (err, description) {
						var title = queryData.id;
						var list = templeteList(filelist);
						var templete = templeteHTML(
							title,
							list,
							`<h2>${title}</h2>${description}`,
							`<a href="/create">create</a> <a href="/update?id=${title}">update</a> <form action="delete_process" method="post" onsubmit="really?"><input type="hidden" name="id" value="${title}"><input type="submit" value="delete"></form>`
						);
						response.writeHead(200);
						response.end(templete);
					}
				);
			});
		}
	} else if (pathname === "/create") {
		fs.readdir("./data", function (error, filelist) {
			var title = "create";
			var list = templeteList(filelist);
			var templete = templeteHTML(
				title,
				list,
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
				``
			);
			response.writeHead(200);
			response.end(templete);
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
			fs.readFile(
				`data/${queryData.id}`,
				"utf8",
				function (err, description) {
					var title = queryData.id;
					var list = templeteList(filelist);
					var templete = templeteHTML(
						title,
						list,
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
						`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
					);
					response.writeHead(200);
					response.end(templete);
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
			fs.unlink(`data/${id}`, function (err) {
				console.log("deleted");
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
