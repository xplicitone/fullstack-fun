const http = require('http');
const port = 3000

http.createServer(function (req, res) {
	res.write("On the way to be a full snack engineer!");
	res.end();
}).listen(port);

console.log("Server started on ze p0rt andre 3000");
