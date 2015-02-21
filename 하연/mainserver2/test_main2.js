var gitTree = require('./git_log.js')();
var flag = 0;


function draw_handler(_finalObject) {
	var log_diff_cnt = 0;
	console.log("draw_handler======================");
	console.log(typeof(_finalObject));	//object
	console.log(_finalObject);

	//var finalObject = {};
	//finalObject.me = "";
	//finalObject.array = final

	//이 부분에서 ******************************
	//사용자가 push나 pull을 누를때마다,
	//받아온 _finalObject의 finalArray를 가지고 
	//origin폴더와 _mahabono폴더의 commit hash를 비교해서
	//ui 생성해주면 될듯
	// ( origin 폴더의 git log가 갱신되는 시점은, 
	//   사용자가 pull을 하고, 그다음 push를 하면 갱신된 log를 추가 )
	//****************************************

	//git log가 존재 안하면
	if(_finalObject.origin_no_commits_flag || _finalObject.user__no_commits_flag) 
	{
		if(_finalObject.origin_no_commits_flag) 
		{
			console.log("origin no commit");
			//***************************
			//origin에 git log아무것도 없을 때의 동작
			//***************************
		}

		if(_finalObject.user_no_commits_flag) 
		{
			console.log(_finalObject.my_name + " no commit");
			//***************************
			//_user_name folder에 git log아무것도 없을 때의 동작
			//***************************
		}
		
	}
	//git log가 존재하면
	else
	{	
		//log_diff_cnt 동작
		for(idx in _finalObject.originLogTreeArray)
		{
			if(_finalObject.originLogTreeArray[idx].commit_hash !== _finalObject.my_position) 
			{
				log_diff_cnt++;
			}	
			else
			{
				break;
			}
		}
		console.log("log_diff_cnt: " + log_diff_cnt);
		
		for(var i=0; i<log_diff_cnt; i++)
		{
			//*********************************
			//update가 필요한 git log들을 그려준다.
			//*********************************
			console.log(_finalObject.originLogTreeArray[i].commit_hash);
			console.log(_finalObject.originLogTreeArray[i].commit_name);
			console.log(_finalObject.originLogTreeArray[i].commit_date);
			console.log(_finalObject.originLogTreeArray[i].commit_date_rel);
			console.log(_finalObject.originLogTreeArray[i].commit_msg);
		}


	}

}

//gitTree.logTree('p_name','mahabono', draw_handler);	// draw_handler 테스트(V)
//gitTree.logTree('p_name','jinoobono', draw_handler);	// draw_handler 테스트(V)

gitTree.logTree('p_name','jinoobono', draw_handler);	// draw_handler 테스트2 - log있음(V) 
gitTree.logTree('d','mahabono', draw_handler);	// draw_handler 테스트2 - log없음(V)
