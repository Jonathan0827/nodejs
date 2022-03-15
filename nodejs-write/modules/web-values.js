module.exports = {
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
			var _nav = nav + `<span>${i} post</span>`;
		} else {
			var _nav = nav + `<span>${i} posts</span>`;
		}
		return _nav;
	},
};
