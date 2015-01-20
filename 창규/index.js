/**
 * @author CHANGKYU.AHN
 */

var websocket = new WebSocket("ws://localhost:8001");
var packet = {send:null, rec:null};

function setLog(str) {
	document.getElementById('log').innerHTML
	 = "<p>" + str + "</p>";
}

websocket.onmessage = function(e) {
	packet.recv = JSON.parse(e.data);
	
	if (packet.recv.sender != "server")
		console.log("data is not for the client.");
		
	switch (packet.recv.header)
	{
		case "ack":
			setLog(packet.recv.content);
			break;		
	}
}

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

function action(command) {
	
	
	switch (command)
	{
		case "save":
		break;
		
		case "load":
		break;
		
		case "new":
		break;
		
		case "commit":
		break;
		
		case "push":
		break;
		
		case "pull":
		break;
	}
}
