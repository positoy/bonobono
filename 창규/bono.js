var ws = require("nodejs-websocket")

var file	= require("./file.js")
var db		= require("./db.js")
var ant		= require("./ant.js")
var git		= require("./git.js")

console.log();
console.log(" node websocket server has been started.");
console.log(" .");
console.log(" .");
console.log(" .");

var Packet = function(sender, header, body, load, content) {
	
	this.sender = sender;
	// server, client

	this.header	= header;
	this.body	= body;
	this.load	= load;
	this.content= content;

	// #file
	// save, load
	// path

	// #git
	// init, add, commit, push, pull
	// params

	// #db
	//

	// #ack

};


function handler_text(str) {

	var p = JSON.parse(str);
	console.log(p);

	if (p.sender != "client")
		console.log(" .error : the packet not intend for server.");


	switch(p.header)
	{
		// 모든 모듈은 패킷처리를 수행하고 ack 패킷을 보낸 후 종료한다.
		case "file":
		file.handle(p);
		break;

		case "git":
		break;

		case "db":
		break;

		case "ant":
		break;
	}
}

function handler_close(code, reason) {
	console.log(" << connection closed.")

}

var server = ws.createServer(function (conn) {
    console.log(" >> new connection.")
    conn.on("text", handler_text)
    conn.on("close",  handler_close)
}).listen(8001)
