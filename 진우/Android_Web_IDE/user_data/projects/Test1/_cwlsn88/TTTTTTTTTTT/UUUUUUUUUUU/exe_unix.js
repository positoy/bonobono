// sys module
var sys = require('sys');

// exec module
var exec = require('child_process').exec;

// exec("unix command to execute", callback function(err message if command is denied, result of command, error message of command))
var child = exec("pwd", function(err, stdout, stderr){
	sys.print('stdout : ' + stdout);
	sys.print('stderr : ' + stderr + "\n");
	if(err !== null)
		console.log('err : ' + err);
});