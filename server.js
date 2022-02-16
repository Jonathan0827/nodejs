var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var title = queryData.id;
	if (_url == "/") {
		title = "Welcome";
	}
	if (_url == "/favicon.ico") {
		return response.writeHead(404);
	}
	response.writeHead(200);
	fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
		var template = `
    <!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
      <style>
        html{
          font-family : 'Arial'
        }
      </style>
    <body>
      <h1><a href="/?id=web">WEB</a></h1>
      <ul>
        <li><a href="/?id=Code">Code</a></li>
        <li><a href="/?id=Lorem">Lorem</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;
		response.end(template);
	});
});
app.listen(3000);
