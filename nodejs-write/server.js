var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

var Template = {
	HTML: function templateHTML(title, list, body, control, nav) {
		return `
  <!doctype html>
  <html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
  </head>
  <style>
  a {
	  color: blue;
	  text-decoration: none;

	  font-size: large;
  }
  html {
	  font-family: Arial, Helvetica, sans-serif;
	  text-align: center;
  }
  .topnav {
	  background-color: #000000;
	  overflow: hidden;
  }
  .topnav a {
	  float: left;
	  color: #f2f2f2;
	  text-align: center;
	  padding: 14px 16px;
	  text-decoration: none;
	  font-size: 17px;
  }
  .topnav span {
	float: left;
	color: #f2f2f2;
	text-align: center;
	padding: 14px 16px;
	text-decoration: none;
	font-size: 17px;
}
  .topnav a:hover {
	  background-color: #ddd;
	  color: black;
  }

  .topnav a.active {
	  background-color: #af00ff;
	  color: white;
  }
  </style>
  <body>
  	<div class="topnav">
		<a class="active" href="/">Home</a>
		${nav}
	</div>
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
				document.querySelector("html").style.backgroundColor = "black";
				document.querySelector("html").style.color = "white";
				document.querySelector("html").dataset.mode = "night";
				cmode = "night";
				i.value = "day";
			} else {
				document.querySelector("html").style.backgroundColor = "white";
				document.querySelector("html").style.color = "black";
				document.querySelector("html").dataset.mode = "day";
				cmode = "day";
				i.value = "night";
			}
		}
	</script>
  </body>
  </html>
  `;
	},
	list: function templatelist(filelist) {
		var list = "<ul>";
		var i = 0;
		while (i < filelist.length) {
			list =
				list +
				`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
			i = i + 1;
		}
		var _list = list + "</ul>";
		return _list;
	},
	navbar: function templatelist(filelist) {
		var i = 0;
		var nav;
		while (i < filelist.length) {
			nav = nav + `<a href="/?id=${filelist[i]}">${filelist[i]}</a>`;
			i = i + 1;
		}
		if (i in [1, 0]) {
			var posts = "post";
		} else {
			var posts = "posts";
		}
		var _nav = nav + `<span>${i} ${posts}</span>`;
		return _nav;
	},
};

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
				fs.readFile(
					`data/${queryData.id}`,
					"utf8",
					function (err, description) {
						var title = queryData.id;
						var List = Template.list(filelist);
						var template = Template.HTML(
							title,
							List,
							`<h2>${title}</h2>${description}`,
							`<a href="/create">create</a> <a href="/update?id=${title}">update</a> <form action="delete_process" method="post" onsubmit="really?"><input type="hidden" name="id" value="${title}"><input type="submit" value="delete"></form>`,
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
			fs.readFile(
				`data/${queryData.id}`,
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
