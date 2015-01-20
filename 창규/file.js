// file.js
var fs = require("fs")

/*
	this.header	= header;
	this.body	= body;
	this.load	= load;
	this.content= content;
*/

module.exports = function() {
	return {
		handle: function(packet) {

			switch(packet.body)
			{
				case "save":
					var path = packet.load;
					var data = packet.content;

					fs.writeFile(path, data, function() {
						console.log(path + " has been successfully written.");

						// ack 전송
						var p = new Packet("server", "ack", "")
						// conn.sendText()
					});
					break;

				case "load":
				break;

			}


		}

	};
}
