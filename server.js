var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var title = queryData.id;

	if (pathname === "/") {
		if (queryData.id === undefined) {
			var template = `
          <!doctype html>
          <html>
          <head>
            <title>Welcome</title>
            <meta charset="utf-8">
          </head>
            <style>
              html{
                font-family: Arial, Helvetica, sans-serif;
                text-align: center;
              }
            </style>
          <body>
            <h1><a href="/">Home</a></h1>
            <ul>
              <li><a href="/?id=Code">Code</a></li>
              <li><a href="/?id=Lorem">Lorem</a></li>
            </ul>
            <h2>Welcome</h2>
          </body>
          </html>
          `;
			response.writeHead(200);
			response.end(template);
		} else {
			fs.readFile(
				`data/${queryData.id}`,
				"utf8",
				function (err, description) {
					var template = `
        <!doctype html>
        <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
        </head>
        <style>
        html{
          font-family: Arial, Helvetica, sans-serif;
          text-align: center;
        }
      </style>
        <body>
          <h1><a href="/">Home</a></h1>
          <ul>
            <li><a href="/?id=Code">Code</a></li>
            <li><a href="/?id=Lorem">Lorem</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
					response.writeHead(200);
					response.end(template);
				}
			);
		}
	} else {
		response.writeHead(404);
		response.end(`
    <!doctype html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
    <style>
    html{
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
    }
  </style>
    <body>
      <h1><a href="/">Home</a></h1>
      <ul>
        <li><a href="/?id=Code">Code</a></li>
        <li><a href="/?id=Lorem">Lorem</a></li>
      </ul>
      <h1>404 Not Found!!!</h1>
    </body>
    </html>
    `);
	}
});
app.listen(3000);
