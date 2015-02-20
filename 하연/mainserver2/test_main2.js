var gitTree = require('./git_log.js')();
var flag = 0;


function draw_handler(data) {
	console.log("draw_handler======================");
	console.log(typeof(data));
	console.log(data);

	//이 부분에서 ******************************
	//사용자가 push나 pull을 누를때마다,
	//받아온 finalArray를 가지고 ui 생성해주면 될듯
	// ( origin 폴더의 git log가 갱신되는 시점은, 
	//   사용자가 pull을 하고, 그다음 push를 하면 갱신된 log를 추가 )
	//****************************************
}

gitTree.logTree('p_name', draw_handler);